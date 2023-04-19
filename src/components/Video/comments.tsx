import Stack from "@mui/material/Stack";
import ListArea from "../listArea";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import CommentIcon from "@mui/icons-material/Comment";

export interface CommentSharedProps {
	commentCount: number;
}

export default class CommentArea extends ListArea<CommentSharedProps> {
	title: string = "Comments";
	maxWidth: string = "710px";

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
}
