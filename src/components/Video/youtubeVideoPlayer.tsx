import { Component, ReactNode } from "react";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import EChartsReact, { EChartsOption } from "echarts-for-react";

export interface VideoPlayerSharedProps {
	title: string;
	channelID: string;
	channelName: string;
	viewCount: number;
	likeCount: number;
	commentCount: number;
}

export default class VideoEmbedded extends Component<VideoPlayerSharedProps> {
	getChannelURL(): string {
		return `https://www.youtube.com/channel/${this.props.channelID}`;
	}

	renderEmbeddedVideo() {
		return (
			<>
				<Box
					sx={{
						minWidth: "300px",
						height: "300px",
						flexGrow: 1,
					}}
				>
					<Skeleton
						height="100%"
						animation="wave"
						style={{ margin: 0 }}
						variant="rounded"
					/>
				</Box>
			</>
		);
	}

	renderChannelDetails() {
		if (!this.props.channelID) return <Skeleton height={50} />;
		return (
			<>
				<Link fontSize={"2"} href={this.getChannelURL()}>
					{this.props.channelName}
				</Link>
			</>
		);
	}

	renderVideoSummary() {
		return (
			<>
				<Box flexDirection={"column"} flexWrap={"nowrap"}>
					<Typography gutterBottom variant="h5">
						{this.props.title}
					</Typography>
					{this.renderChannelDetails()}
				</Box>
			</>
		);
	}

	thinkOfOptions(): EChartsOption {
		return {
			option: false,
		};
	}

	render(): ReactNode {
		return (
			<>
				<Box>
					{[this.renderEmbeddedVideo(), this.renderVideoSummary()]}
				</Box>
			</>
		);
	}
}
