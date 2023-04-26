import Stack from "@mui/material/Stack";
import ListArea from "../listArea";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import CommentIcon from "@mui/icons-material/Comment";
import { ReactNode, Fragment } from "react";
import Typography from "@mui/material/Typography";
import { AskCommentThreads, AskVideo } from "../helper/ask";
import { CommentThread } from "../types/Comments";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Image from "next/image";
import EditIcon from "@mui/icons-material/Edit";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import CommentStyles from "@/styles/comments.module.css";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export interface CommentSharedProps {
	videoID: string;
}

interface CommentProps extends CommentSharedProps {
	formatter: Intl.NumberFormat;
}

export function CommentCount(props: CommentProps) {
	const { data, error } = AskVideo(props.videoID);

	if (data?.details) {
		const format = Intl.NumberFormat();
		const commentCount =
			Number(data.details.items[0].statistics.commentCount) ?? 0;

		return (
			<Tooltip title={`Comment Count: ${format.format(commentCount)}`}>
				<Chip
					label={props.formatter.format(commentCount)}
					icon={<CommentIcon />}
					size="small"
					sx={{ p: "2px" }}
				/>
			</Tooltip>
		);
	}
	return (
		<Tooltip title={data?.failed || error}>
			<span>--</span>
		</Tooltip>
	);
}

export function LikeComponent(props: { userLiked?: boolean; count: string }) {
	const icon = (
		<ThumbUpIcon
			color={props.userLiked ? "action" : "disabled"}
			fontSize="small"
		/>
	);
	return (
		<>
			<Stack
				direction="row"
				alignItems="center"
				justifyContent="space-between"
				flexWrap={"nowrap"}
			>
				<IconButton color="primary" disabled>
					{icon}
				</IconButton>
				<Typography variant={"subtitle2"} sx={{ mb: "-2px" }}>
					{props.count}
				</Typography>
			</Stack>
		</>
	);
}

function NameComponent(props: { authorName: string; date: string }) {
	return (
		<>
			<Stack
				justifyContent={"space-between"}
				flexDirection={"row"}
				flexWrap={"nowrap"}
			>
				<Typography variant="subtitle2">{props.authorName}</Typography>
				<Typography variant="caption">
					{dayjs(props.date).fromNow()}
				</Typography>
			</Stack>
		</>
	);
}

function CommentItemFooter(props: {
	details: CommentThread;
	formatter: Intl.NumberFormat;
}) {
	const details = props.details;
	const topLevelComment = details.snippet.topLevelComment;
	const isEdited =
		topLevelComment.snippet.publishedAt !==
		topLevelComment.snippet.updatedAt;

	const edit = isEdited ? (
		<Typography variant={"caption"} fontSize={"small"}>
			{dayjs(topLevelComment.snippet.updatedAt).fromNow()}
			<EditIcon fontSize={"inherit"} sx={{ ml: "3px", mb: "-1px" }} />
		</Typography>
	) : (
		<></>
	);

	const showMore = details.replies?.comments?.length ? (
		<Button size="small">{`Replies ${props.formatter.format(
			details.snippet.totalReplyCount
		)}`}</Button>
	) : (
		<></>
	);
	return (
		<>
			<Stack
				flexDirection={"row"}
				justifyContent={"space-between"}
				alignItems="center"
			>
				<LikeComponent
					count={props.formatter.format(
						Number(topLevelComment.snippet.likeCount)
					)}
				/>
				{showMore}
				{edit}
			</Stack>
		</>
	);
}

function CommentAvatarComponent(props: { pfp: string; className: string }) {
	return (
		<ListItemAvatar>
			<Avatar className={props.className}>
				<Image src={props.pfp} fill alt="User Pfp" quality={"100"} />
			</Avatar>
		</ListItemAvatar>
	);
}

export function CommentItem(props: {
	comment: CommentThread;
	formatter: Intl.NumberFormat;
}) {
	const topLevelComment = props.comment.snippet.topLevelComment;

	return (
		<ListItem key={props.comment.id} className={CommentStyles.commentItem}>
			<CommentAvatarComponent
				pfp={topLevelComment.snippet.authorProfileImageUrl}
				className={CommentStyles.commentAvatar}
			/>
			<ListItemText
				sx={{ ml: "10px" }}
				primary={
					<NameComponent
						authorName={topLevelComment.snippet.authorDisplayName}
						date={topLevelComment.snippet.publishedAt}
					/>
				}
				secondary={
					<>
						<Typography>
							{topLevelComment.snippet.textOriginal}
						</Typography>
						<CommentItemFooter
							details={props.comment}
							formatter={props.formatter}
						/>
					</>
				}
			/>
		</ListItem>
	);
}

export function CommentListItems(props: CommentProps) {
	const { data, error, isLoading } = AskCommentThreads(props.videoID);

	if (data?.length && data.at(-1)?.details) {
		const expectedThreads = data.flatMap((commentThread) =>
			commentThread.details ? commentThread.details.items : []
		);
		if (expectedThreads.length)
			return (
				<>
					{expectedThreads.map((commentThread: CommentThread) => {
						return (
							<CommentItem
								comment={commentThread}
								key={commentThread.id}
								formatter={props.formatter}
							/>
						);
					})}
				</>
			);
		else return <span key={0}>No Comments Found</span>;
	}

	return (
		<Stack
			justifyContent={"center"}
			alignItems="center"
			sx={{ height: "100%" }}
			key={0}
		>
			{isLoading ? (
				<span>Loading...</span>
			) : (
				<Alert title="Error" severity="error" color="error">
					{data?.at(-1)?.failed ||
						String(error) ||
						"Failed to fetch the required comments"}
				</Alert>
			)}
		</Stack>
	);
}

function CommentFooter(props: { videoID: string }) {
	const { data, error, isLoading } = AskCommentThreads(props.videoID);

	return (
		<ListItemButton sx={{ textAlign: "center" }}>
			<Typography color="orangered" align="center" m="0 auto">
				Show More
			</Typography>
		</ListItemButton>
	);

	return <></>;
}

export default class CommentArea extends ListArea<CommentProps> {
	title: string = "Comments";
	maxWidth: string = "500px";

	header() {
		return (
			<Stack
				flexDirection={"row"}
				justifyContent={"center"}
				alignContent="center"
			>
				<CommentCount
					formatter={this.props.formatter}
					videoID={this.props.videoID}
				/>
			</Stack>
		);
	}

	commentName(name: string, publishedDate: string) {
		return (
			<>
				<Stack
					flexDirection={"row"}
					justifyContent={"space-between"}
					alignItems={"baseline"}
				>
					<Typography>{name}</Typography>
					<Typography
						data-id={publishedDate}
						className="formatME"
						variant="caption"
					>
						{publishedDate}
					</Typography>
				</Stack>
			</>
		);
	}

	componentDidMount(): void {
		document.querySelectorAll(".formatME").forEach(function (element) {
			console.log(element);
		});
	}

	commentItem(comment: CommentThread) {
		const topLevelComment = comment.snippet.topLevelComment;
		return (
			<Fragment key={comment.id}>
				<ListItem>
					<Stack flexDirection={"row"} sx={{ width: "100%" }}>
						<ListItemText
							primary={this.commentName(
								topLevelComment.snippet.authorDisplayName,
								topLevelComment.snippet.publishedAt
							)}
							secondary={topLevelComment.snippet.textOriginal}
						></ListItemText>
					</Stack>
				</ListItem>
			</Fragment>
		);
	}

	renderListItems(): ReactNode {
		return super.renderListItems(
			<CommentListItems
				formatter={this.props.formatter}
				videoID={this.props.videoID}
			/>
		);
	}

	footer(): ReactNode {
		return <CommentFooter videoID={this.props.videoID} />;
	}

	render(): ReactNode {
		return <>{this.renderListItems()}</>;
	}
}
