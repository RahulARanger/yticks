import { Component, ReactNode, RefObject, createRef } from "react";
import VideoEmbedded, {
    VideoPlayerSharedProps,
} from "@/components/Video/youtubeVideoPlayer";
import CommentArea from "@/components/Video/commentListArea";
import VideoStyle from "@/styles/video.module.css";
import Stack from "@mui/material/Stack";
import { CommentSharedProps } from "../types/CommentsUI";
export interface FromMainPageWhichAreState {
    videoID: string;
}

export interface DetailedPageViewRelatedProps
    extends FromMainPageWhichAreState {}

interface VideoSummaryState
    extends VideoPlayerSharedProps,
        CommentSharedProps {}

export default class DetailedPageView extends Component<
    DetailedPageViewRelatedProps,
    VideoSummaryState
> {
    embeddedVideoFrame: RefObject<HTMLDivElement> = createRef();
    formatter: Intl.NumberFormat = Intl.NumberFormat("en", {
        notation: "compact",
    });
    state: VideoSummaryState = {
        videoID: "",
    };

    render(): ReactNode {
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
                        videoID={this.props.videoID}
                        formatter={this.formatter}
                        className={VideoStyle.embeddedVideo}
                    />
                    <CommentArea
                        videoID={this.props.videoID}
                        formatter={this.formatter}
                        className={VideoStyle.commentBox}
                    />
                </Stack>
            </>
        );
    }
}
