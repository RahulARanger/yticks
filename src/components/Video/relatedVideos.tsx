import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { ReactNode, Fragment } from "react";
import ListSubheader from "@mui/material/ListSubheader";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import ListArea from "../listArea";
import {
	RelatedVideo,
	RelatedVideoDetails,
} from "@/pages/api/data/relatedVideos";
import CenterThings from "../centerThings";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import videoBoxStyles from "@/styles/videoBox.module.css";
import Image from 'next/image'

export interface RelatedVideoProps {
	relatedVideos: RelatedVideoDetails | false;
}

export function truncateString(str: string, maxLength: number): ReactNode {
	if (str.length <= maxLength)
		return str;
	return <Tooltip title={str}><Typography>{str.slice(0, maxLength) + "..."}</Typography></Tooltip>;
}


export default class RelatedVideoArea extends ListArea<RelatedVideoProps> {
	title: string = "Related Videos";
	maxWidth: string = "450px";

	renderEmptyState(text?: string): ReactNode {
		return (
			<>
				<CenterThings>
					{text ?? "No Related Videos found yet..."}
				</CenterThings>
			</>
		);
	}

	renderRelatedVideo(videoItem: RelatedVideo): ReactNode {
		const thumbnail_keys = videoItem.snippet.thumbnails;
		let thumbnail;

		switch (true) {
			case "maxres" in thumbnail_keys: {
				thumbnail = thumbnail_keys["maxres"]
				break;
			}
			case "high" in thumbnail_keys: {
				thumbnail = thumbnail_keys["high"]
				break;
			}
			case "medium" in thumbnail_keys: {
				thumbnail = thumbnail_keys["medium"]
				break;
			}
			default: {
				thumbnail = thumbnail_keys["default"]
				break;
			}
		}

		return (
			<Fragment key={videoItem.id.videoId}>
				<ListItem className={videoBoxStyles.videoItem}>
					<Stack flexDirection="row" flexWrap={'nowrap'} columnGap={"6px"}>
						<ListItemAvatar>
							<Image
								alt="thumbnail"
								src={thumbnail.url}
								width={168}
								height={94}
								quality={90}
								style={{ objectFit: "cover" }}
							/>
						</ListItemAvatar>
						<Box flexDirection="column" flexWrap={"nowrap"} rowGap={"3px"}>
							<ListItemText primary={truncateString(videoItem.snippet.title, 30)} secondary={videoItem.snippet.description.slice(0, 40) + "..."} title={videoItem.snippet.description} />
						</Box>
					</Stack>
				</ListItem>
			</Fragment>
		);
	}

	renderListItems(): ReactNode {
		if (!this.props.relatedVideos)
			return this.renderEmptyState("Loading Related Videos...");
		if (!this.props.relatedVideos.items.length)
			return <Skeleton></Skeleton>
		return (
			<>
				{this.props.relatedVideos.items.map((item) => {
					return this.renderRelatedVideo(item);
				})}
			</>
		);
	}

	header() {
		return <></>;
	}
}
