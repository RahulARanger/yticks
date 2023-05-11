import VideoPlayerHeader, { VideoPlayListHeader } from "@/components/header";
import { Component, ReactNode } from "react";
import Head from "next/head";
import { withRouter } from "next/router";
import { WithRouterProps } from "next/dist/client/with-router";
import { PlayListViewState } from "@/components/types/playlist";
import DetailedPageView from "@/components/Playlist/DetailedPageView";

class Playlist extends Component<WithRouterProps, PlayListViewState> {
    state: PlayListViewState = {
        listID: "",
    };

    resetSearch() {
        this.props.router.push({
            pathname: this.props.router.pathname,
            query: {},
        });
        this.setState({ listID: "" });
    }

    toggleSettings() {}

    handleSearch(listID: string) {
        this.props.router.push({
            pathname: this.props.router.pathname,
            query: { id: listID },
        });
        this.setState({ listID });
    }

    render(): ReactNode {
        return (
            <>
                <Head>
                    <title>Search Playlist by ID</title>
                </Head>
                <VideoPlayListHeader
                    textSearched={this.state.listID}
                    title="YTicks"
                    resetSearch={this.resetSearch.bind(this)}
                    onSettingsRequest={this.toggleSettings.bind(this)}
                    requested={String(
                        this.props.router.query.q ||
                            this.props.router.query.id ||
                            ""
                    )}
                    onSearch={this.handleSearch.bind(this)}
                />
                {this.state.listID ? <DetailedPageView /> : <></>}
            </>
        );
    }
}

export default withRouter(Playlist);
