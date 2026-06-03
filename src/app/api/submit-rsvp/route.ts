import { appendRSVP } from '@/lib/sheets'

export async function POST(req: Request) {
  const { guestInfo, giftId, giftName } = await req.json()
  try {
    const result = await appendRSVP(guestInfo, giftId, giftName)
    return Response.json({ success: true, rowIndex: result.rowIndex })
  } catch {
    return Response.json({ error: 'RSVP_FAILED' }, { status: 500 })
  }
}
