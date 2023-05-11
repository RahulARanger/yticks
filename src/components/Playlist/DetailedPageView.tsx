import { Component } from "react";
import Stack from "@mui/material/Stack";
import CommentArea from "@/components/Video/commentListArea";
import {
    PlayListDetailedViewProps,
    PlayListDetailedViewState,
} from "../types/playlist";
import VideoEmbedded, {
    VideoPlayerSharedProps,
} from "@/components/Video/youtubeVideoPlayer";
import VideoStyle from "@/styles/video.module.css";

export default class DetailedPageView extends Component<
    PlayListDetailedViewProps,
    PlayListDetailedViewState
> {
    formatter: Intl.NumberFormat = Intl.NumberFormat("en", {
        notation: "compact",
    });

    state: PlayListDetailedViewState = {
        videoIDs: [],
        index: 0,
    };

    render() {
        const videoID = this.state.videoIDs[this.state.index] || "";
        return (
            <>
                <Stack
                    direction="row"
                    pl="2%"
                    py="2%"
                    pr="10px"
                    columnGap={1}
                    rowGap={1}
                    flexWrap={"wrap"}
                    className={VideoStyle.detailedView}
                    justifyContent={"stretch"}
                    alignItems={"stretch"}
                >
                    <VideoEmbedded
                        videoID={videoID}
                        formatter={this.formatter}
                        className={VideoStyle.embeddedVideo}
                    />
                    <CommentArea
                        videoID={videoID}
                        formatter={this.formatter}
                        className={VideoStyle.commentBox}
                    />
                </Stack>
            </>
        );
    }
}
