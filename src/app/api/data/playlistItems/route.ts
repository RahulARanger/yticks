import ask, { letThemKnow, sendError } from '@/components/helper/generalRequest'
import { type PlayListItemResponse } from '@/components/types/playlist'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET (request: NextRequest): Promise<NextResponse> {
  const { listID } = Object.fromEntries(
    new URL(request.url).searchParams.entries()
  )

  if (!listID) return letThemKnow('Please provide the ID for the playlist.')
  try {
    const resp = await ask(
      'https://www.googleapis.com/youtube/v3/playlistItems',
      {
        playlistId: String(listID),
        part: 'id,snippet,status,contentDetails'
      }
    )
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const playList: PlayListItemResponse = await resp.json()

    if (!playList.items.length) {
      return letThemKnow(playList.error?.message ?? 'No Results found')
    }

    return NextResponse.json({ failed: false, details: playList })
  } catch (error) {
    return letThemKnow(
      sendError(
        error,
        `Failed to retrieve the comments added for the playlist ${listID}`
      )
    )
  }
}
