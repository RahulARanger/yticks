'use client'

import Head from 'next/head'
import React, { Component, type ReactNode } from 'react'
import VideoPlayerHeader from '@/components/header'
import DetailedPageView, {
  type FromMainPageWhichAreState
} from '@/components/Video/DetailedPageView'
import Settings, { type VideoSettings } from '@/components/Video/settings'
import { useRouter, useSearchParams } from 'next/navigation'
import { type AppRouterInstance } from 'next/dist/shared/lib/app-router-context'

interface DetailedVideoViewState
  extends VideoSettings,
  FromMainPageWhichAreState {
  openSettings: boolean
}

class DetailedVideoView extends Component<
{ router: AppRouterInstance, param_key: string },
DetailedVideoViewState
> {
  state: DetailedVideoViewState = {
    videoID: '',
    openSettings: false
  }

  handleSearch (videoID: string): void {
    this.props.router.push(`/video?id=${videoID}`)
    this.setState({ videoID })
  }

  toggleSettings (force: boolean): void {
    this.setState({
        openSettings: force ? force : !this.state.openSettings,
    });
  }

  setSettings (settings: VideoSettings): void {
    this.setState({ ...settings })
  }

  resetSearch (): void {
    // order matters
    // first reset the location
    this.props.router.push('/video')
    // then reset the state
    this.setState({
      videoID: '',
      openSettings: false
    })
  }

  render (): ReactNode {
    return (
      <>
        <Head>
          <title>Video by ID</title>
        </Head>
        <VideoPlayerHeader
          textSearched={this.state.videoID}
          title="YTicks"
          resetSearch={this.resetSearch.bind(this)}
          onSearch={this.handleSearch.bind(this)}
          onSettingsRequest={this.toggleSettings.bind(this, true)}
          requested={this.props.param_key}
        />
        <Settings
          open={this.state.openSettings}
          onClose={() => { this.toggleSettings(false) }}
        />
        {this.state.videoID
          ? (
          <DetailedPageView videoID={this.state.videoID} />
            )
          : (
          <></>
            )}
      </>
    )
  }
}

export default function WithCached (): ReactNode {
  const router = useRouter()
  const params = useSearchParams()
  return (
    <DetailedVideoView
      router={router}
      param_key={params.get('q') ?? params.get('id') ?? ''}
    />
  )
}
