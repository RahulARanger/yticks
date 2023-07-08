import { type ListCommentThreadResponse } from '@/components/types/Comments'
import ask, { letThemKnow, sendError } from '@/components/helper/generalRequest'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET (request: NextRequest): Promise<NextResponse> {
  const { videoID, pageToken } = Object.fromEntries(
    new URL(request.url).searchParams.entries()
  )
  if (!videoID) return letThemKnow('Please provide the ID for the video.')

  try {
    const resp = await ask(
      'https://www.googleapis.com/youtube/v3/commentThreads',
      {
        videoId: String(videoID),
        part: 'id,snippet,replies',
        order: 'relevance',
        pageToken: String(pageToken || '')
      }
    )

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const commentThread: ListCommentThreadResponse = await resp.json()
    if (!commentThread.pageInfo.totalResults) {
      return letThemKnow(commentThread.error?.message ?? 'No Results found')
    }

    return NextResponse.json({ failed: false, details: commentThread })
  } catch (error) {
    return letThemKnow(
      sendError(
        error,
        `Failed to retrieve the comments added for the video ${videoID}`
      )
    )
  }
}
