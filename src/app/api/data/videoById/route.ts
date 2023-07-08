import { type NextRequest, NextResponse } from 'next/server'
import ask, { letThemKnow, sendError } from '@/components/helper/generalRequest'
import { type VideoListDetails } from '@/components/types/Video'

export async function GET (request: NextRequest): Promise<NextResponse> {
  const { videoID, maxWidth, maxHeight } = Object.fromEntries(
    new URL(request.url).searchParams.entries()
  )

  if (!videoID) return letThemKnow('Please provide the ID for the video.')
  try {
    const resp = await ask('https://www.googleapis.com/youtube/v3/videos', {
      id: String(videoID),
      part: 'liveStreamingDetails,player,recordingDetails,snippet,statistics,status,topicDetails',
      maxWidth: String(maxWidth),
      maxHeight: String(maxHeight)
    })

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const videoDetails: VideoListDetails = await resp.json()
    if (!videoDetails.pageInfo.totalResults) {
      return letThemKnow('No Results found')
    }

    return NextResponse.json({ failed: false, details: videoDetails })
  } catch (error) {
    return letThemKnow(
      sendError(
        error,
        `Failed to retrieve the details for the video ${videoID}`
      )
    )
  }
}
