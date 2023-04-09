import {
	Component,
	ReactNode,
	RefObject,
	SyntheticEvent,
	useState,
	useRef,
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

export type responseType = VideoListDetails | any;

export interface FromMainPageWhichAreProps {
	suggest: RefObject<HTMLInputElement>;
}

export interface FromMainPageWhichAreState {
	videoID: string;
}

async function askThem(videoID: string): Promise<ExpectedVideoDetails> {
	return fetch(`/api/data/videoById?videoID=${videoID}`).then(
		async (response): Promise<responseType> => {
			let resp: responseType;
			if (!response.ok) {
				try {
					resp = await response.json();
				} catch (error) {
					throw new Error(
						"Failed to request our server, please let me know if this happens, I will try to bring back the server as soon as possible."
					);
				}
				if (resp.failed) throw new Error(resp.details);
				throw new Error(
					"Unknow Error, please note the steps and let me know"
				);
			}
			return response.json();
		}
	);
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

	const fetchThings = savedVideoID.current !== meta.videoID;

	const { data, error, isLoading } = useSWRImmutable(meta.videoID, askThem);
	const videoList: VideoListDetails | undefined =
		data?.details && typeof data?.details !== "string"
			? data?.details
			: undefined;

	if (videoList && fetchThings) {
		setOpen(true);
		meta.redirectTo(isLoading, error, videoList);
		savedVideoID.current = meta.videoID;
	}

	function focusSearchBar() {
		meta.suggest.current?.focus();
	}

	function closeToast(_: SyntheticEvent | Event, reason?: string) {
		if (reason === "clickaway") return;
		setOpen(false);
	}

	const content = isLoading
		? `Searching for the Video: ${meta.videoID}`
		: !videoList
		? error?.message ?? "Failed to search for the requested video"
		: `Completed the search, Video Name: ${videoList?.items[0]?.snippet?.title}`;

	const insideComps = isLoading ? (
		<LinearProgress color="secondary" />
	) : error ? (
		<Button onClick={focusSearchBar}>Try again</Button>
	) : (
		<Button onClick={closeToast}>Close</Button>
	);

	const mode = isLoading ? "info" : !videoList ? "error" : "success";

	return (
		<>
			<Snackbar
				autoHideDuration={videoList ? 6e3 : undefined}
				open={isOpen}
				onClose={closeToast}
			>
				<Alert
					severity={mode}
					color={mode}
					elevation={1}
					action={insideComps}
				>
					{content}
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
	state: VideoSummaryState = {
		title: "...",
		channelID: "",
		channelName: "",
		viewCount: 0,
		commentCount: 0,
		likeCount: 0,
	};

	searchedDetails(
		status: boolean,
		error: string,
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
			viewCount: video.statistics.viewCount,
			likeCount: video.statistics.likeCount,
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
				>
					<Stack
						direction="column"
						sx={{ flexGrow: 1.69 }}
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
						/>
						<CommentArea />
					</Stack>
					<RelatedVideoArea />
				</Stack>
			</>
		);
	}
}
