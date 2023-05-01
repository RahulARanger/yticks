import Head from "next/head";
import { Component, ReactNode } from "react";
import Header from "@/components/header";
import DetailedPageView, {
    FromMainPageWhichAreState,
} from "@/components/Video/DetailedPageView";
import Settings, {
    VideoSettings,
} from "@/components/Video/settings";
import { withRouter } from "next/router";
import { WithRouterProps } from "next/dist/client/with-router";

interface DetailedVideoViewState
    extends VideoSettings,
    FromMainPageWhichAreState {
    openSettings: boolean;
}

class DetailedVideoView extends Component<
    DetailedVideoViewState & WithRouterProps
> {
    state: DetailedVideoViewState = {
        videoID: "",
        openSettings: false,
    };

    handleSearch(videoID: string): void {
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

    render(): ReactNode {
        return (
            <>
                <Head>
                    <title>Video by ID</title>
                </Head>
                <Header
                    textSearched={this.state.videoID}
                    title="YTicks"
                    onSearch={this.handleSearch.bind(this)}
                    onSettingsRequest={this.toggleSettings.bind(this, true)}
                    requested={String(this.props.router.query.q || "")}
                />
                <Settings
                    open={this.state.openSettings}
                    onClose={() => this.toggleSettings(false)}
                />
                {this.state.videoID ? (
                    <DetailedPageView
                        videoID={this.state.videoID}
                    />
                ) : (
                    <></>
                )}
            </>
        );
    }
}

export default withRouter(DetailedVideoView);
