import Head from "next/head";
import { Component, ReactNode } from "react";
import VideoPlayerHeader from "@/components/header";
import DetailedPageView, {
    FromMainPageWhichAreState,
} from "@/components/Video/DetailedPageView";
import Settings, { VideoSettings } from "@/components/Video/settings";
import { withRouter } from "next/router";
import { WithRouterProps } from "next/dist/client/with-router";

interface DetailedVideoViewState
    extends VideoSettings,
        FromMainPageWhichAreState {
    openSettings: boolean;
}

class DetailedVideoView extends Component<
    DetailedVideoViewState & WithRouterProps,
    DetailedVideoViewState
> {
    state: DetailedVideoViewState = {
        videoID: "",
        openSettings: false,
    };

    handleSearch(videoID: string): void {
        this.props.router.push({
            pathname: this.props.router.pathname,
            query: { id: videoID },
        });
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
        this.props.router.push({
            pathname: this.props.router.pathname,
            query: {},
        });
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
                    requested={String(
                        this.props.router.query.q ||
                            this.props.router.query.id ||
                            ""
                    )}
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

export default withRouter(DetailedVideoView);
