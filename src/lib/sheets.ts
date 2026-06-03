import type { GuestInfo, SheetData, SheetMetadata, Gift } from '@/lib/types'

const SHEETS_BASE = 'https://sheets.googleapis.com/v4/spreadsheets'

// ── Token cache ────────────────────────────────────────────────────────────────

interface TokenCache {
  token: string
  expiresAt: number
}
let tokenCache: TokenCache | null = null

async function getAccessToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt - 60_000) {
    return tokenCache.token
  }

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY!
  const privateKey = rawKey.replace(/\\n/g, '\n')

  const now = Math.floor(Date.now() / 1000)
  const header = { alg: 'RS256', typ: 'JWT' }
  const payload = {
    iss: email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }

  const encode = (obj: object) =>
    Buffer.from(JSON.stringify(obj)).toString('base64url')

  const headerB64 = encode(header)
  const payloadB64 = encode(payload)
  const signingInput = `${headerB64}.${payloadB64}`

  const keyData = privateKey
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s/g, '')

  const binaryKey = Buffer.from(keyData, 'base64')

  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    binaryKey,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    Buffer.from(signingInput)
  )

  const sigB64 = Buffer.from(signature).toString('base64url')
  const jwt = `${signingInput}.${sigB64}`

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Failed to get access token: ${err}`)
  }

  const json = await res.json() as { access_token: string; expires_in: number }
  tokenCache = {
    token: json.access_token,
    expiresAt: Date.now() + json.expires_in * 1000,
  }
  return tokenCache.token
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function sheetUrl(range: string): string {
  const id = process.env.GOOGLE_SHEET_ID!
  return `${SHEETS_BASE}/${id}/values/${encodeURIComponent(range)}`
}

async function sheetsGet(range: string, token: string) {
  const res = await fetch(sheetUrl(range), {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Sheets GET ${range} failed: ${res.status} — ${body}`)
  }
  return res.json() as Promise<{ values?: string[][] }>
}

// ── Public API ─────────────────────────────────────────────────────────────────

/*
 * Actual sheet structure:
 *
 * Tab "Config"  → key-value pairs, A=key, B=value, starting row 2
 *   keys: bebe_nombre, padre_nombre, madre_nombre, fecha_evento,
 *         hora_evento, maps_url, direccion, mensaje_intro, fecha_limite_rsvp
 *
 * Tab "Regalos" → A=id, B=nombre, C=descripcion, D=tomado_por,
 *                 E=telefono, F=email, G=fecha_marcado  (row 1 = headers)
 *   Available = D (tomado_por) is empty
 *
 * Tab "Confirmaciones" → A=nombre, B=telefono, C=email,
 *                        D=regalo_id, E=regalo_nombre, F=fecha  (row 1 = headers)
 */

export async function getSheetData(): Promise<SheetData> {
  const token = await getAccessToken()

  const [configRes, giftsRes] = await Promise.all([
    sheetsGet('Config!A2:B20', token),
    sheetsGet('Regalos!A2:G999', token),
  ])

  // Build key→value map from Config tab
  const cfg: Record<string, string> = {}
  for (const row of configRes.values ?? []) {
    if (row[0]) cfg[row[0].trim()] = row[1] ?? ''
  }

  // fecha_evento may be "2026-08-15 16:00:00" — extract just the date part
  const rawDate = cfg['fecha_evento'] ?? ''
  const eventDate = rawDate.split(' ')[0] ?? rawDate  // "2026-08-15"

  const metadata: SheetMetadata = {
    parentA: cfg['madre_nombre'] ?? '',
    parentB: cfg['padre_nombre'] ?? '',
    babyName: cfg['bebe_nombre'] ?? '',
    eventDate,
    eventTime: cfg['hora_evento'] ?? '',
    mapsUrl: cfg['maps_url'] ?? '',
  }

  // Regalos: row 1 is headers, data from row 2
  // Status: D (tomado_por) non-empty → Claimed
  const gifts: Gift[] = (giftsRes.values ?? []).map((row) => ({
    id: String(row[0] ?? ''),
    title: row[1] ?? '',
    description: row[2] ?? '',
    status: row[3] ? 'Claimed' : 'Available',
  }))

  return { metadata, gifts }
}

export async function claimGift(
  giftId: string,
  guestInfo: GuestInfo
): Promise<{ success: true }> {
  const token = await getAccessToken()
  const spreadsheetId = process.env.GOOGLE_SHEET_ID!

  const listRes = await sheetsGet('Regalos!A2:G999', token)
  const rows = listRes.values ?? []
  const rowIndex = rows.findIndex((r) => String(r[0]) === String(giftId))
  if (rowIndex === -1) throw new Error('GIFT_NOT_FOUND')

  const row = rows[rowIndex]
  // D column (index 3) = tomado_por; non-empty means claimed
  if (row[3]) throw new Error('ALREADY_CLAIMED')

  // Sheet row = rowIndex + 2 (data starts at row 2, 1-indexed)
  const sheetRow = rowIndex + 2
  const range = `Regalos!D${sheetRow}:G${sheetRow}`

  const patchRes = await fetch(
    `${SHEETS_BASE}/${spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [[
          guestInfo.name,
          guestInfo.phone,
          guestInfo.email ?? '',
          new Date().toISOString(),
        ]],
      }),
    }
  )

  if (!patchRes.ok) {
    const body = await patchRes.text()
    throw new Error(`Claim gift PUT failed: ${patchRes.status} — ${body}`)
  }
  return { success: true }
}

export async function appendRSVP(
  guestInfo: GuestInfo,
  giftId?: string,
  giftName?: string,
): Promise<{ success: true; rowIndex: number }> {
  const token = await getAccessToken()
  const spreadsheetId = process.env.GOOGLE_SHEET_ID!

  // Confirmaciones: nombre, telefono, email, regalo_id, regalo_nombre, fecha
  const res = await fetch(
    `${SHEETS_BASE}/${spreadsheetId}/values/${encodeURIComponent('Confirmaciones!A:F')}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [[
          guestInfo.name,
          guestInfo.phone,
          guestInfo.email ?? '',
          giftId ?? '',
          giftName ?? '',
          new Date().toISOString(),
        ]],
      }),
    }
  )

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Append RSVP failed: ${res.status} — ${body}`)
  }

  const json = await res.json() as { updates?: { updatedRange?: string } }
  const updatedRange = json.updates?.updatedRange ?? ''
  const match = updatedRange.match(/(\d+)$/)
  const rowIndex = match ? parseInt(match[1], 10) : -1

  return { success: true, rowIndex }
}
