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

export type responseType = VideoListDetails | any;

export interface FromMainPageWhichAreProps {
	suggest: RefObject<HTMLInputElement>;
}

export interface FromMainPageWhichAreState {
	videoID: string;
}

async function askThem(
	videoID: string,
	maxWidth: number,
	maxHeight: number,
	setOpen: (open: boolean) => void
): Promise<ExpectedVideoDetails> {
	setOpen(true); // open notification

	return fetch(
		`/api/data/videoById?videoID=${videoID}&maxWidth=${maxWidth}&maxHeight=${maxHeight}`
	).then(async (response): Promise<responseType> => {
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
	});
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

	let [width, height] = [1200, 400];

	const fetchThings = savedVideoID.current !== meta.videoID;

	const { data, error, isLoading } = useSWRImmutable(meta.videoID, (url) =>
		askThem(url, width, height, setOpen)
	);
	const videoList: VideoListDetails | undefined =
		data?.details && typeof data?.details !== "string"
			? data?.details
			: undefined;

	let title: string = "";

	if (videoList) title = videoList.items[0].snippet.title;
	if (videoList && fetchThings) {
		meta.redirectTo(isLoading, error, videoList);
		savedVideoID.current = meta.videoID;
	}

	function handleClose(_: SyntheticEvent | Event, reason?: string) {
		if (reason === "clickaway") return;
		setOpen(false);
	}

	function focusSearchBar() {
		meta.suggest.current?.focus();
	}

	const mode = isLoading ? "info" : title ? "success" : "error";
	const hideDuration = isLoading ? null : title ? 6e3 : null;
	const message = isLoading ? (
		<>
			Searching for the Video: ${meta.videoID}
			<LinearProgress />
		</>
	) : title ? (
		`Fetched the details of the video: ${title}`
	) : (
		`Failed to fetch the required details, Please refer to this error: ${
			error?.message ?? error
		}`
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
			viewCount: video.statistics.viewCount,
			likeCount: video.statistics.likeCount,
			frame: video.player.embedHtml,
			description: video.snippet.description,
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
						sx={{ flexGrow: 0.69 }}
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
						/>
						<CommentArea />
					</Stack>
					<RelatedVideoArea />
				</Stack>
			</>
		);
	}
}
