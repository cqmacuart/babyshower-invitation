import { updateRSVP } from '@/lib/sheets'

export async function PUT(req: Request) {
  const { rowIndex, guestInfo, giftId, giftName, asistentes } = await req.json()
  if (!rowIndex || !guestInfo) {
    return Response.json({ error: 'MISSING_PARAMS' }, { status: 400 })
  }
  try {
    await updateRSVP(rowIndex, guestInfo, giftId, giftName, asistentes)
    return Response.json({ success: true })
  } catch {
    return Response.json({ error: 'UPDATE_FAILED' }, { status: 500 })
  }
}
