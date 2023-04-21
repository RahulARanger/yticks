import {
	Component,
	ReactNode,
	RefObject,
	SyntheticEvent,
	useState,
	useRef,
	createRef,
} from "react";
import VideoEmbedded, {
	VideoPlayerSharedProps,
} from "@/components/Video/youtubeVideoPlayer";
import RelatedVideoArea from "@/components/Video/relatedVideos";
import CommentArea from "@/components/Video/comments";
import VideoStyle from "@/styles/video.module.css";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import useSWRImmutable from "swr/immutable";
import {
	ExpectedVideoDetails,
	VideoListDetails,
} from "@/pages/api/data/videoById";
import { askButRead } from "@/pages/helper/generalRequest";
import { ExpectedRelatedVideoDetails } from "@/pages/api/data/relatedVideos";

export type responseType = VideoListDetails | any;

export interface FromMainPageWhichAreProps {
	suggest: RefObject<HTMLInputElement>;
}

export interface FromMainPageWhichAreState {
	videoID: string;
}

interface metaDetails
	extends FromMainPageWhichAreProps,
		FromMainPageWhichAreState {
	redirectTo: (
		status: boolean,
		isError: string,
		results: VideoListDetails | undefined
	) => void;
}

function AskDetailsForVideo(meta: metaDetails) {
	const [isOpen, setOpen] = useState(true);
	const savedVideoID = useRef("");

	let [width, height] = ["730", "400"];

	const fetchThings = savedVideoID.current !== meta.videoID;

	const {
		data: video,
		error: fetchVideoError,
		isLoading: fetchingVideo,
	} = useSWRImmutable("/api/data/videoById", (url) =>
		askButRead<ExpectedVideoDetails>(url, {
			maxWidth: width,
			maxHeight: height,
			videoID: meta.videoID,
		})
	);

	const {
		data: relatedVideos,
		error: fetchRelatedVideoError,
		isLoading: fetchingRelatedVideos,
	} = useSWRImmutable("/api/data/relatedVideos", (url) =>
		askButRead<ExpectedRelatedVideoDetails>(url, {
			videoID: meta.videoID,
		})
	);

	const isLoading = fetchingVideo || fetchingRelatedVideos;
	const error = fetchVideoError || fetchRelatedVideoError;

	const videoList: VideoListDetails | undefined =
		video?.details && typeof video?.details !== "string"
			? video?.details
			: undefined;

	let title: string = "";

	if (videoList) title = videoList.items[0].snippet.title;
	if (videoList && fetchThings) {
		meta.redirectTo(fetchingVideo, fetchVideoError, videoList);
		savedVideoID.current = meta.videoID;
	}

	function handleClose(_: SyntheticEvent | Event, reason?: string) {
		if (reason === "clickaway") return;
		setOpen(false);
	}

	function focusSearchBar() {
		meta.suggest.current?.focus();
	}

	const mode = isLoading ? "info" : error ? "error" : "success";
	const hideDuration = isLoading ? null : error ? null : 6e3;
	const message = isLoading ? (
		<>
			Searching for the Video: ${meta.videoID}
			<LinearProgress />
		</>
	) : !error ? (
		`Fetched the details of the video: ${title}`
	) : (
		error?.message ??
		`Failed to fetch the required details, Please refer to this error: ${error}`
	);

	const insideComps = isLoading ? null : title ? (
		<Button onClick={handleClose}>Close</Button>
	) : (
		<Button onClick={focusSearchBar}>Try again</Button>
	);

	return (
		<>
			<Snackbar
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
				open={isOpen}
				onClose={handleClose}
				autoHideDuration={hideDuration}
			>
				<Alert
					onClose={handleClose}
					severity={mode}
					action={insideComps}
					color={mode}
					elevation={1}
				>
					{message}
				</Alert>
			</Snackbar>
		</>
	);
}

export interface DetailedPageViewRelatedProps
	extends FromMainPageWhichAreProps,
		FromMainPageWhichAreState {}

interface VideoSummaryState extends VideoPlayerSharedProps {}

export default class DetailedPageView extends Component<
	DetailedPageViewRelatedProps,
	VideoSummaryState
> {
	embeddedVideoFrame: RefObject<HTMLDivElement> = createRef();
	state: VideoSummaryState = {
		title: "...",
		channelID: "",
		channelName: "",
		viewCount: 0,
		commentCount: 0,
		likeCount: 0,
		frame: "",
		description: "",
		tags: [],
		childFriendly: true,
	};

	searchedDetails(
		_: boolean, // status
		__: string, // error
		data: VideoListDetails | undefined
	): void {
		if (!data) {
			return;
		}
		const video = data.items[0];
		this.setState({
			title: video.snippet.title,
			channelID: video.snippet.channelId,
			channelName: video.snippet.channelTitle,
			viewCount: Number(video.statistics.viewCount),
			likeCount: Number(video.statistics.likeCount),
			frame: video.player.embedHtml,
			description: video.snippet.description,
			tags: video.snippet.tags || [],
			childFriendly: video.status.madeForKids,
			commentCount: Number(video.statistics.commentCount),
		});
	}

	render(): ReactNode {
		return (
			<>
				<AskDetailsForVideo
					videoID={this.props.videoID}
					redirectTo={this.searchedDetails.bind(this)}
					suggest={this.props.suggest}
				/>
				<Stack
					direction="row"
					px="2%"
					py="2%"
					spacing={2}
					flexWrap={"wrap"}
					className={VideoStyle.detailedView}
					justifyContent={"stretch"}
					alignItems={"stretch"}
				>
					<Stack
						direction="column"
						sx={{ flexGrow: 0.69, maxWidth: "730px" }}
						justifyContent={"stretch"}
						alignItems={"stretch"}
						spacing={1}
					>
						<VideoEmbedded
							title={this.state.title}
							channelName={this.state.channelName}
							channelID={this.state.channelID}
							likeCount={this.state.likeCount}
							viewCount={this.state.viewCount}
							commentCount={this.state.commentCount}
							frame={this.state.frame}
							description={this.state.description}
							tags={this.state.tags}
							childFriendly={this.state.childFriendly}
						/>
						<CommentArea commentCount={this.state.commentCount} />
					</Stack>
					<RelatedVideoArea />
				</Stack>
			</>
		);
	}
}
