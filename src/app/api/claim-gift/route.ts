import { claimGift, updateConfirmacionGift } from '@/lib/sheets'

export async function POST(req: Request) {
  const { giftId, guestInfo, confirmacionRow, giftName } = await req.json()
  try {
    if (giftId !== 'cash') {
      await claimGift(giftId, guestInfo)
    }
    if (confirmacionRow) {
      await updateConfirmacionGift(confirmacionRow, String(giftId), giftName ?? '')
    }
    return Response.json({ success: true })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'UNKNOWN'
    const status = message === 'ALREADY_CLAIMED' ? 409 : 500
    return Response.json({ error: message }, { status })
  }
}
