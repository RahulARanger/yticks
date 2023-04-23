import { Component, ReactNode, Fragment } from "react";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Accordion from "@mui/material/Accordion";
import Stack from "@mui/material/Stack";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChildFriendlyIcon from "@mui/icons-material/ChildFriendly";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import videoPlayerStyles from "@/styles/videoPlayer.module.css";
import { askVideo, isError } from "../helper/ask";
import Alert from "@mui/material/Alert";
import { ExpectedVideoDetails } from "@/pages/api/data/videoById";
import { askVideoType } from "../types/Video";

export interface VideoPlayerSharedProps {
	title: string;
	channelID: string;
	channelName: string;
	viewCount: number;
	likeCount: number;
	commentCount: number;
	frame: string;
	description: string;
	tags: Array<string>;
	childFriendly: boolean;
	videoID: string;
}



export function EmbeddedVideo(props: askVideoType) {
	const { data, isLoading, error } = askVideo<ExpectedVideoDetails>(props.videoID)
	if (isLoading) return <Skeleton
		height="100%"
		animation="wave"
		style={{ margin: 0 }}
		variant="rounded"
	/>
	if (!data || typeof data?.details === "string" || isError(data, error)) return <Alert color="error" severity="error" title="error">{error?.toString() || "Failed to display the requested video"}</Alert>

	return <div
		dangerouslySetInnerHTML={{
			__html: data.details.items[0].player.embedHtml,
		}}
		className={videoPlayerStyles.frame}
	></div>
}

export function VideoSummary(props: askVideoType) {
	const { data, isLoading, error } = askVideo<ExpectedVideoDetails>(props.videoID)
	if (isLoading) return <Skeleton height="69px" animation="wave" variant="rectangular" />
	if (!data || typeof data?.details === "string")
}

export default class VideoEmbedded extends Component<VideoPlayerSharedProps> {
	formatter = Intl.NumberFormat("en", { notation: "compact" });

	getChannelURL(): string {
		return `https://www.youtube.com/channel/${this.props.channelID}`;
	}

	_renderEmbeddedVideo() {
		return <Stack
			sx={{
				minWidth: "300px",
				height: "400px",
				flexGrow: 1,
				backdropFilter: "blur(20px)",
			}} alignItems="center" justifyContent="center"
		>
			<EmbeddedVideo videoID={this.props.videoID} />
		</Stack >

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

	renderChips(): ReactNode {
		return this.props.tags.map(function (tag) {
			return (
				<Fragment key={tag}>
					<Chip
						label={tag}
						size="small"
						sx={{ margin: "3px" }}
					></Chip>
				</Fragment>
			);
		});
	}

	renderBadges(): ReactNode {
		return (
			<Stack mt="10px">
				<Tooltip
					title={
						this.props.childFriendly
							? "Made For Kids"
							: "Not Made for Kids"
					}
					color={this.props.childFriendly ? "green" : "red"}
				>
					<ChildFriendlyIcon />
				</Tooltip>
			</Stack>
		);
	}

	statsBadge(): ReactNode {
		const format = new Intl.NumberFormat();
		return (
			<Stack
				flexGrow={1}
				justifyContent={"flex-end"}
				alignItems={"center"}
				direction={"row"}
				columnGap={"12px"}
			>
				<Tooltip
					title={`Like Count: ${format.format(this.props.likeCount)}`}
				>
					<Chip
						icon={<ThumbUpAltIcon />}
						label={this.formatter.format(this.props.likeCount)}
					/>
				</Tooltip>

				<Tooltip
					title={`View Count: ${format.format(this.props.viewCount)}`}
				>
					<Chip
						icon={<VisibilityIcon />}
						label={this.formatter.format(this.props.viewCount)}
					/>
				</Tooltip>
			</Stack>
		);
	}

	renderVideoSummary() {
		return (
			<>
				<Box
					flexDirection={"column"}
					flexWrap={"nowrap"}
					sx={{ maxWidth: "710px" }}
				>
					<Typography gutterBottom variant="h5" mt="10px">
						{this.props.title}
					</Typography>
					<Accordion sx={{ my: "12px" }}>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel1a-content"
							id="panel1a-header"
						>
							<Typography>Description</Typography>
							{this.statsBadge()}
						</AccordionSummary>
						<AccordionDetails>
							{this.props.tags.length ? (
								<>
									<Typography variant="h6">Tags:</Typography>
									<hr />
									{this.renderChips()}
									<hr />
								</>
							) : (
								<></>
							)}
							{this.props.description
								.split("\n")
								.map((i, key) => {
									return <div key={key}>{i}</div>;
								})}
						</AccordionDetails>
					</Accordion>
				</Box>
			</>
		);
	}

	_renderVideoSummary() {
		return <Skeleton></Skeleton>
	}

	render(): ReactNode {
		return (
			<>
				<Box>
					{[this._renderEmbeddedVideo(), this.renderVideoSummary()]}
				</Box>
			</>
		);
	}
}
