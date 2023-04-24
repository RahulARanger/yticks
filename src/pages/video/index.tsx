import Head from "next/head";
import { Component, ReactNode, RefObject, createRef } from "react";
import Header from "@/components/header";
import DetailedPageView, {
	FromMainPageWhichAreProps,
	FromMainPageWhichAreState,
} from "@/components/Video/DetailedPageView";
import Settings, {
	SettingsProps,
	VideoSettings,
} from "@/components/Video/settings";
import Script from "next/script";
import { AskVideo } from "@/components/helper/ask";

export function TitleFromVideo(props: { videoID: string }) {
	const { data, isLoading } = AskVideo(props.videoID);
	if (data?.details) return <title>{data.details.items[0].snippet.title}</title>
	return <title>{isLoading ? "Loading" : "Failed"}</title>
}

interface DetailedVideoViewState
	extends VideoSettings,
	FromMainPageWhichAreState {
	openSettings: boolean;
}

export default class DetailedVideoView extends Component<
	FromMainPageWhichAreProps,
	DetailedVideoViewState
> {
	searchBar: RefObject<HTMLInputElement> = createRef();
	state: DetailedVideoViewState = {
		videoID: "",
		openSettings: false,
	};

	handleSearch(videoID: string): void {
		this.setState({ videoID });
	}

	toggleSettings(force: boolean) {
		this.setState({
			openSettings: force ? force : !this.state.openSettings,
		});
	}

	setSettings(settings: VideoSettings) {
		this.setState({ ...settings });
	}



	render(): ReactNode {
		return (
			<>
				<Script src="https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js" />
				<Head>
					<TitleFromVideo videoID={this.state.videoID} />
				</Head>
				<Header
					textSearched={this.state.videoID}
					title="YTA"
					onSearch={this.handleSearch.bind(this)}
					pocket={this.searchBar}
					onSettingsRequest={this.toggleSettings.bind(this, true)}
				/>
				<Settings
					open={this.state.openSettings}
					onClose={() => this.toggleSettings(false)}
				/>
				{this.state.videoID ? (
					<DetailedPageView
						videoID={this.state.videoID}
						suggest={this.searchBar}
					/>
				) : (
					<></>
				)}
			</>
		);
	}
}
