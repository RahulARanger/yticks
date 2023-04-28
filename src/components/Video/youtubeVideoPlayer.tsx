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
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import videoPlayerStyles from "@/styles/videoPlayer.module.css";
import { AskVideo } from "../helper/ask";
import Alert from "@mui/material/Alert";
import { ExpectedVideoDetails } from "@/pages/api/data/videoById";
import { Snackbar } from "@mui/material";
import { VideoDetails } from "../types/Video";
import ParseDesc, { YoutubeHashTag } from "../parseDesc";
import { getChannelURL } from "../helper/urls";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent, {
	TimelineContentProps,
} from "@mui/lab/TimelineContent";
import TimelineOppositeContent, {
	TimelineOppositeContentProps,
} from "@mui/lab/TimelineOppositeContent";
import TimelineDot from "@mui/lab/TimelineDot";
import PublishIcon from "@mui/icons-material/Publish";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CallEndIcon from "@mui/icons-material/CallEnd";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export interface VideoPlayerSharedProps {
	videoID: string;
}

interface VideoPlayerProps extends VideoPlayerSharedProps {
	formatter: Intl.NumberFormat;
}

type miniProps = { details: VideoDetails; formatter: Intl.NumberFormat };

export function EmbeddedVideo(props: VideoPlayerSharedProps) {
	const { data, isLoading, error } = AskVideo(props.videoID);
	if (isLoading)
		return (
			<Skeleton
				height="100%"
				animation="wave"
				style={{ margin: 0 }}
				variant="rounded"
				className={videoPlayerStyles.frame}
			/>
		);
	if (data?.details)
		return (
			<div
				dangerouslySetInnerHTML={{
					__html: data.details.items[0].player.embedHtml,
				}}
				className={videoPlayerStyles.frame}
			></div>
		);
	return (
		<Stack
			className={videoPlayerStyles.frame}
			justifyContent={"center"}
			alignItems={"center"}
		>
			<Alert color="error" severity="error" title="error">
				{data?.failed || String(error)}
			</Alert>
		</Stack>
	);
}

function StatsBadge(props: miniProps) {
	const stats = props.details.statistics;
	const likeCount = Number(stats.likeCount) ?? 0;
	const viewCount = Number(stats.viewCount) ?? 0;

	const format = new Intl.NumberFormat();
	return (
		<Stack
			flexGrow={1}
			justifyContent={"flex-end"}
			alignItems={"center"}
			direction={"row"}
			columnGap={"12px"}
		>
			<Tooltip title={`Like Count: ${format.format(likeCount)}`}>
				<Chip
					icon={<ThumbUpAltIcon />}
					size="small"
					label={props.formatter.format(likeCount)}
				/>
			</Tooltip>

			<Tooltip title={`View Count: ${format.format(viewCount)}`}>
				<Chip
					icon={<VisibilityIcon />}
					size="small"
					label={props.formatter.format(viewCount)}
				/>
			</Tooltip>
		</Stack>
	);
}

export function TimelineItemWithTime(
	props: TimelineOppositeContentProps & {
		date: string | undefined;
		icon: ReactNode;
		text: string;
	}
) {
	if (!props.date) return <></>;
	const parsedDate = new Date(props.date);
	return (
		<TimelineItem>
			<TimelineOppositeContent {...props}>
				<Typography>{parsedDate.toLocaleString()}</Typography>
				<Typography variant="caption">
					{dayjs(parsedDate).fromNow()}
				</Typography>
			</TimelineOppositeContent>
			<TimelineSeparator>
				<TimelineConnector />
				<TimelineDot color="primary" variant="outlined">
					{props.icon}
				</TimelineDot>
				<TimelineConnector />
			</TimelineSeparator>
			<TimelineContentOnRight text={props.text} />
		</TimelineItem>
	);
}

export function TimelineContentOnRight(
	props: TimelineContentProps & { text: string }
) {
	return (
		<TimelineContent sx={{ my: "auto" }} {...props}>
			<Typography variant="subtitle1">{props.text}</Typography>
		</TimelineContent>
	);
}

function VideoTimeline(props: { details: VideoDetails }) {
	const publishedDate = props.details.snippet.publishedAt;
	const scheduled = props.details?.liveStreamingDetails?.scheduledStartTime;
	const actualStartTime =
		props.details?.liveStreamingDetails?.actualStartTime;
	const actualEndTime = props.details?.liveStreamingDetails?.actualEndTime;

	return (
		<>
			<Timeline>
				<TimelineItemWithTime
					date={scheduled}
					icon={<ScheduleIcon />}
					text={"Scheduled Live Stream"}
				/>
				<TimelineItemWithTime
					date={actualStartTime}
					icon={<PlayArrowIcon />}
					text={"Live Steam Started"}
				/>
				<TimelineItemWithTime
					date={publishedDate}
					icon={<PublishIcon />}
					text={"Published Date"}
				/>
				<TimelineItemWithTime
					date={actualEndTime}
					icon={<CallEndIcon />}
					text={"Live Steam Ended"}
				/>
			</Timeline>
		</>
	);
}

export function PureVideoSummary(props: miniProps) {
	const snippet = props.details.snippet;
	document.title = snippet.title;

	return (
		<>
			<Box
				flexDirection={"column"}
				flexWrap={"nowrap"}
				sx={{ maxWidth: "710px" }}
			>
				<Typography gutterBottom variant="h5" mt="10px">
					{snippet.title}
				</Typography>
				<Link variant="caption" href={getChannelURL(snippet.channelId)}>
					{snippet.channelTitle}
				</Link>
				<Accordion
					sx={{ my: "12px" }}
					className={videoPlayerStyles.description}
				>
					<AccordionSummary
						expandIcon={<ExpandMoreIcon />}
						aria-controls="panel1a-content"
						id="panel1a-header"
					>
						<Typography>Description</Typography>
						<StatsBadge
							details={props.details}
							formatter={props.formatter}
						/>
					</AccordionSummary>
					<AccordionDetails>
						{snippet?.tags?.length ? (
							<>
								<Typography variant="body1">Tags:</Typography>
								<Typography variant="body2">
									{snippet.tags.map((tag, index) => (
										<Fragment key={index}>
											<YoutubeHashTag tag={tag} /> &nbsp;
										</Fragment>
									))}
								</Typography>
								<hr />
								<br />
							</>
						) : (
							<></>
						)}
						{snippet.description.split("\n").map((line, index) => {
							return (
								<Typography variant="body2" key={index}>
									<ParseDesc text={line} variant={"body2"} />
								</Typography>
							);
						})}
					</AccordionDetails>
				</Accordion>
				<VideoTimeline details={props.details}></VideoTimeline>
			</Box>
		</>
	);
}

export function VideoSummary(props: VideoPlayerProps) {
	const { data, isLoading, error } = AskVideo(props.videoID);
	if (isLoading)
		return (
			<Skeleton height="69px" animation="wave" variant="rectangular" />
		);
	if (data?.details)
		return (
			<PureVideoSummary
				details={data.details.items[0]}
				formatter={props.formatter}
			/>
		);
	return (
		<Snackbar
			open={true}
			autoHideDuration={null}
			anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
		>
			<Alert severity="error" color="error" title="Error">
				{data?.failed || String(error)}
			</Alert>
		</Snackbar>
	);
}

export default class VideoEmbedded extends Component<VideoPlayerProps> {
	render(): ReactNode {
		return (
			<>
				<Box>
					<Stack
						sx={{
							minWidth: "300px",
							height: "400px",
							flexGrow: 1,
							backdropFilter: "blur(20px)",
						}}
						alignItems="center"
						justifyContent="center"
					>
						<EmbeddedVideo videoID={this.props.videoID} />
					</Stack>
					<VideoSummary
						videoID={this.props.videoID}
						formatter={this.props.formatter}
					/>
				</Box>
			</>
		);
	}
}
