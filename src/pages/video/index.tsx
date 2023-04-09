import Head from "next/head";
import { Component, ReactNode, RefObject, createRef } from "react";
import Header from "@/components/header";
import DetailedPageView, {
	FromMainPageWhichAreProps,
	FromMainPageWhichAreState,
} from "@/components/Video/DetailedPageView";

export default class DetailedVideoView extends Component<
	FromMainPageWhichAreProps,
	FromMainPageWhichAreState
> {
	searchBar: RefObject<HTMLInputElement> = createRef();
	state: FromMainPageWhichAreState = {
		videoID: "",
	};

	handleSearch(videoID: string): void {
		this.setState({ videoID });
	}

	render(): ReactNode {
		return (
			<>
				<Head>
					<title>{"Search a Video"}</title>
				</Head>

				<Header
					textSearched={this.state.videoID}
					title="YTA"
					onSearch={this.handleSearch.bind(this)}
					pocket={this.searchBar}
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
