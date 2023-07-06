"use client";

import Head from "next/head";
import { Component, ReactNode, useState } from "react";
import VideoPlayerHeader from "@/components/header";
import DetailedPageView, {
  FromMainPageWhichAreState,
} from "@/components/Video/DetailedPageView";
import Settings, { VideoSettings } from "@/components/Video/settings";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";

interface DetailedVideoViewState
  extends VideoSettings,
    FromMainPageWhichAreState {
  openSettings: boolean;
}

class DetailedVideoView extends Component<
  { router: AppRouterInstance; param_key: string },
  DetailedVideoViewState
> {
  state: DetailedVideoViewState = {
    videoID: "",
    openSettings: false,
  };

  handleSearch(videoID: string): void {
    this.props.router.push(`/video?id=${videoID}`);
    this.setState({ videoID });
  }

  toggleSettings(force: boolean) {
    // this.setState({
    //     openSettings: force ? force : !this.state.openSettings,
    // });
  }

  setSettings(settings: VideoSettings) {
    this.setState({ ...settings });
  }

  resetSearch() {
    // order matters
    // first reset the location
    this.props.router.push("/video");
    // then reset the state
    this.setState({
      videoID: "",
      openSettings: false,
    });
  }

  render(): ReactNode {
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
          onClose={() => this.toggleSettings(false)}
        />
        {this.state.videoID ? (
          <DetailedPageView videoID={this.state.videoID} />
        ) : (
          <></>
        )}
      </>
    );
  }
}

export default function WithCached() {
  const router = useRouter();
  const params = useSearchParams();
  return (
    <DetailedVideoView
      router={router}
      param_key={params.get("q") || params.get("id") || ""}
    />
  );
}
