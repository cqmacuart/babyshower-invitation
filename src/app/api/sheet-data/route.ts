import { getSheetData } from '@/lib/sheets'

export async function GET() {
  try {
    const data = await getSheetData()
    return Response.json(data)
  } catch {
    return Response.json({ error: 'SHEETS_UNAVAILABLE' }, { status: 503 })
  }
}
