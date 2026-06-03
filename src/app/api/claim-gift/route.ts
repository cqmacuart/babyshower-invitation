import { claimGift } from '@/lib/sheets'

export async function POST(req: Request) {
  const { giftId, guestInfo } = await req.json()
  try {
    await claimGift(giftId, guestInfo)
    return Response.json({ success: true })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'UNKNOWN'
    const status = message === 'ALREADY_CLAIMED' ? 409 : 500
    return Response.json({ error: message }, { status })
  }
}
