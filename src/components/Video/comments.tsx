import Stack from "@mui/material/Stack";
import ListArea from "../listArea";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CommentIcon from "@mui/icons-material/Comment";
import { ReactNode, Fragment } from "react";
import Typography from "@mui/material/Typography";
import { askCommentThreads, askVideo } from "../helper/ask";
import { ExpectedVideoDetails } from "@/pages/api/data/videoById";
import { CommentThread } from "../types/Comments";
import { ExpectedCommentThread } from "@/pages/api/data/commentThreads";
import Alert from "@mui/material/Alert";
import { Avatar } from "@mui/material";
import Image from "next/image";

export interface CommentSharedProps {
	videoID: string
}

interface CommentProps extends CommentSharedProps {
	formatter: Intl.NumberFormat
}

export function CommentCount(props: CommentProps) {
	const { data, error } = askVideo<ExpectedVideoDetails>(props.videoID);


	if (data?.details) {
		const format = Intl.NumberFormat();
		const commentCount = Number(data.details.items[0].statistics.commentCount) ?? 0;

		return <Tooltip
			title={`Comment Count: ${format.format(
				commentCount
			)}`}
		>
			<Chip
				label={props.formatter.format(commentCount)}
				icon={<CommentIcon />}
				size="small"
				sx={{ p: "2px" }}
			/>
		</Tooltip>
	}
	return <Tooltip title={data?.failed || error}><span>--</span></Tooltip>
}

function NameComponent(props: { authorName: string }) {
	return <Typography variant="subtitle2">{props.authorName}</Typography>
}

function CommentAvatorComponent(props: { pfp: string }) {
	return <Avatar src={props.pfp} />
}

export function CommentItem(props: { comment: CommentThread }) {
	const topLevelComment = props.comment.snippet.topLevelComment;
	return (
		<ListItem key={props.comment.id}>
			<CommentAvatorComponent pfp={topLevelComment.snippet.authorProfileImageUrl} />
			<ListItemText sx={{ ml: "10px" }} primary={<NameComponent authorName={topLevelComment.snippet.authorDisplayName} />} secondary={topLevelComment.snippet.textOriginal}></ListItemText>
		</ListItem>
	)
}


export function CommentListItems(props: CommentProps) {
	const { data, error, isLoading } = askCommentThreads<ExpectedCommentThread>(props.videoID);

	if (data?.details) {
		if (data.details?.items?.length) return data.details.items.map((comment) => <CommentItem comment={comment} key={comment.id} />)
		else return <span key={0}>No Comments Found</span>
	}

	return <Stack justifyContent={"center"} alignItems="center" sx={{ height: "100%" }} key={0}>
		{isLoading ? <span>Loading...</span> : <Alert title="Error" severity="error" color="error">{data?.failed || error}</Alert>}
	</Stack>
}


export default class CommentArea extends ListArea<CommentProps> {
	title: string = "Comments";
	maxWidth: string = "500px"

	header() {
		return (
			<Stack
				flexDirection={"row"}
				justifyContent={"center"}
				alignContent="center"
			>
				<CommentCount formatter={this.props.formatter} videoID={this.props.videoID} />
			</Stack>
		);
	}

	commentName(name: string, publishedDate: string) {
		return (
			<>
				<Stack flexDirection={"row"} justifyContent={"space-between"} alignItems={"baseline"}>
					<Typography>
						{name}
					</Typography>
					<Typography data-id={publishedDate} className="formatME" variant="caption">
						{publishedDate}
					</Typography>
				</Stack>
			</>
		)
	}

	componentDidMount(): void {
		document.querySelectorAll(".formatME").forEach(function (element) {
			console.log(element)
		})
	}

	commentItem(comment: CommentThread) {
		const topLevelComment = comment.snippet.topLevelComment;
		return (
			<Fragment key={comment.id}>
				<ListItem>
					<Stack flexDirection={"row"} sx={{ width: "100%" }}>
						<ListItemText primary={this.commentName(topLevelComment.snippet.authorDisplayName, topLevelComment.snippet.publishedAt)} secondary={topLevelComment.snippet.textOriginal}></ListItemText>
					</Stack>

				</ListItem>
			</Fragment>
		)
	}

	renderListItems(): ReactNode {
		return <CommentListItems formatter={this.props.formatter} videoID={this.props.videoID} />
	}
}
