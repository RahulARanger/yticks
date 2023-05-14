import { Component } from "react";
import ListArea from "../listArea";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import { CommonPropsForPlayListItems } from "../types/playlist";
import Drawer from "@mui/material/Drawer";
import { AskPlayList, AskPlayListItems } from "../helper/ask";
import Skeleton from "@mui/material/Skeleton";
import Fab from "@mui/material/Fab";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import Paper from "@mui/material/Paper";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Image from "next/image";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import { Typography } from "@mui/material";
import { extractThumbnail, truncateText } from "../helper/simpilify";

function PlayListVideoItems(props: CommonPropsForPlayListItems) {
    const { data, error, isLoading } = AskPlayListItems(props.listID);
    const items = data?.details?.items;
    if (!items || error) return <></>;
    if (isLoading) return <Skeleton height={50} />;

    return (
        <>
            {items.map(function (item, index) {
                const snippet = item.snippet;
                const selected = item.snippet.thumbnails.high;

                return (
                    <ListItemButton key={item.id}>
                        <Stack
                            flexDirection="row"
                            alignItems="center"
                            justifyContent={"space-between"}
                            columnGap={"10px"}
                        >
                            <ListItemText
                                primary={
                                    <Typography variant="subtitle2">
                                        {index + 1}
                                    </Typography>
                                }
                            />
                            <ListItemAvatar sx={{ mr: "10px" }}>
                                <Image
                                    src={selected.url}
                                    alt="thumbnail"
                                    width={"69"}
                                    height={"50"}
                                />
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Tooltip title={snippet.title}>
                                        <Typography>
                                            {truncateText(snippet.title, 69)}
                                        </Typography>
                                    </Tooltip>
                                }
                                secondary={snippet.videoOwnerChannelTitle}
                            />
                        </Stack>
                    </ListItemButton>
                );
            })}
        </>
    );
}

function PlayListSummary(props: CommonPropsForPlayListItems) {
    const { data } = AskPlayList(props.listID);
    const playlistDetails = data?.details?.items[0];
    if (!playlistDetails)
        return (
            <Typography fontStyle={"italic"} variant="subtitle1" p="6px">
                No Details Found about Playlist
            </Typography>
        );
    return (
        <Stack
            p="6px"
            alignItems="center"
            columnGap="6px"
            justifyContent={"space-between"}
            flexDirection={"row"}
        >
            <Image
                alt="Playlist thumbnail"
                src={extractThumbnail(playlistDetails.snippet.thumbnails).url}
                width={"69"}
                height={"50"}
            />
            <Typography p="6px" variant={"h6"}>
                {playlistDetails.snippet.title}
            </Typography>
        </Stack>
    );
}

class VideoItems extends ListArea<CommonPropsForPlayListItems, {}> {
    title = "";
    header() {
        return <></>;
    }
    render() {
        return super.renderList(
            <PlayListVideoItems listID={this.props.listID} />
        );
    }
}

interface PlaylistItemsState {
    opened: boolean;
}

export default class PlayListItems extends Component<
    CommonPropsForPlayListItems,
    PlaylistItemsState
> {
    state: PlaylistItemsState = { opened: true };

    openDrawer() {
        this.setState({ opened: true });
    }
    closeDrawer() {
        this.setState({ opened: false });
    }

    render() {
        return (
            <>
                <Drawer
                    open={this.state.opened}
                    onClose={this.closeDrawer.bind(this)}
                    PaperProps={{ elevation: 3 }}
                >
                    <PlayListSummary listID={this.props.listID} />
                    <VideoItems listID={this.props.listID} />
                </Drawer>

                <Fab
                    variant="circular"
                    size="medium"
                    color="primary"
                    aria-label="Toggle Playlist Items"
                    sx={{ position: "fixed", bottom: "10px", right: "10px" }}
                    onClick={this.openDrawer.bind(this)}
                >
                    <PlaylistPlayIcon />
                </Fab>
            </>
        );
    }
}
