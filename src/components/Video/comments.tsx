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
import { CommentThread, ListCommentThreadResponse } from "@/pages/api/data/commentThreads";
import { Typography } from "@mui/material";
import { display } from "@mui/system";

export interface CommentSharedProps {
}

export default class CommentArea extends ListArea<CommentSharedProps> {
	title: string = "Comments";
	maxWidth: string = "500px"

	header() {
		const format = new Intl.NumberFormat();
		return (
			<Stack
				flexDirection={"row"}
				justifyContent={"center"}
				alignContent="center"
			>
				<Tooltip
					title={`Comment Count: ${format.format(
						this.props.commentCount
					)}`}
				>
					<Chip
						label={this.props.commentCount}
						icon={<CommentIcon />}
					/>
				</Tooltip>
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
		if (!this.props.commentThreads) return <>Loading</>
		return this.props.commentThreads.items.map((commentThread) => {
			return this.commentItem(commentThread);
		})
	}
}
