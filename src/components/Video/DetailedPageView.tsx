import { Component, ReactNode, RefObject, createRef } from "react";
import VideoEmbedded, {
	VideoPlayerSharedProps,
} from "@/components/Video/youtubeVideoPlayer";
import CommentArea, { CommentSharedProps } from "@/components/Video/comments";
import VideoStyle from "@/styles/video.module.css";
import Stack from "@mui/material/Stack";

export interface FromMainPageWhichAreProps {
	suggest: RefObject<HTMLInputElement>;
}

export interface FromMainPageWhichAreState {
	videoID: string;
}

export interface DetailedPageViewRelatedProps
	extends FromMainPageWhichAreProps,
	FromMainPageWhichAreState { }

interface VideoSummaryState
	extends VideoPlayerSharedProps,
	CommentSharedProps { }

export default class DetailedPageView extends Component<
	DetailedPageViewRelatedProps,
	VideoSummaryState
> {
	embeddedVideoFrame: RefObject<HTMLDivElement> = createRef();
	formatter: Intl.NumberFormat = Intl.NumberFormat("en", { notation: "compact" });
	state: VideoSummaryState = {
		videoID: "",
	};

	render(): ReactNode {
		return (
			<>
				<Stack
					direction="row"
					px="2%"
					py="2%"
					spacing={2}
					flexWrap={"nowrap"}
					className={VideoStyle.detailedView}
					justifyContent={"stretch"}
					alignItems={"stretch"}
				>
					<VideoEmbedded
						videoID={this.props.videoID}
						formatter={this.formatter}
					/>
					<CommentArea videoID={this.props.videoID} formatter={this.formatter}
					/>
				</Stack>
			</>
		);
	}
}
