import React, { Component, type ReactNode } from 'react'
import Stack from '@mui/material/Stack'
import CommentArea from '@/components/Video/commentListArea'
import {
  type PlayListDetailedViewProps,
  type PlayListDetailedViewState
} from '../types/playlist'
import VideoEmbedded from '@/components/Video/youtubeVideoPlayer'
import VideoStyle from '@/styles/video.module.css'
import PlayListItems from './playListItems'

export default class DetailedPageView extends Component<
PlayListDetailedViewProps,
PlayListDetailedViewState
> {
  formatter: Intl.NumberFormat = Intl.NumberFormat('en', {
    notation: 'compact'
  })

  state: PlayListDetailedViewState = {
    videoIDs: [],
    index: 0
  }

  render (): ReactNode {
    alert(this.props.videoID)
    return (
      <>
        <Stack
          direction="row"
          pl="2%"
          py="2%"
          pr="10px"
          columnGap={1}
          rowGap={1}
          flexWrap={'wrap'}
          className={VideoStyle.detailedView}
          justifyContent={'stretch'}
          alignItems={'stretch'}
        >
          <VideoEmbedded
            videoID={this.props.videoID}
            // listID={this.props.listID}

            className={VideoStyle.embeddedVideo}
            formatter={this.formatter}
          />
          <CommentArea
            videoID={this.props.videoID}
            formatter={this.formatter}
            className={VideoStyle.commentBox}
          />
        </Stack>
        <PlayListItems listID={this.props.listID} />
      </>
    )
  }
}
