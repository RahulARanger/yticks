import Stack from "@mui/material/Stack";
import ListArea from "../listArea";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import CommentIcon from "@mui/icons-material/Comment";
import { ReactNode, Fragment, SyntheticEvent } from "react";
import Typography from "@mui/material/Typography";
import { AskCommentThreads } from "../helper/ask";
import { CommentThread } from "../types/Comments";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Box from "@mui/material/Box";
import CloudIcon from "@mui/icons-material/Cloud";
import ReactEChartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/core";
import { BarChart, BarSeriesOption } from "echarts/charts";
import {
    TooltipComponent,
    DatasetComponent,
    GridComponent,
    TitleComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { CountOfComments } from "./miniComponents";
import CommentListItems from "./commentListItem";
import { CommentProps } from "../types/CommentsUI";

echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    BarChart,
    CanvasRenderer,
]);

interface CommentState {
    tabSelected?: string;
}

function CommentFooter(props: { videoID: string }) {
    const {
        data,
        error: _,
        isLoading,
        size,
        setSize,
    } = AskCommentThreads(props.videoID);
    const details = data?.at(-1)?.details;

    const notReady =
        isLoading || (size > 0 && typeof data?.at(size - 1) === "undefined");

    if (details?.nextPageToken) {
        return (
            <ListItemButton
                sx={{ textAlign: "center" }}
                data-token={details.nextPageToken}
                onClick={() => {
                    setSize(size + 1);
                }}
                disabled={notReady}
            >
                <Typography color="orangered" align="center" m="0 auto">
                    {notReady ? "Loading..." : "Show More"}
                </Typography>
            </ListItemButton>
        );
    }

    return <></>;
}

export default class CommentArea extends ListArea<CommentProps, CommentState> {
    title: string = "Comments";
    state: CommentState = {};

    header() {
        return (
            <Stack
                flexDirection={"row"}
                justifyContent={"center"}
                alignContent="center"
            >
                <CountOfComments
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
                    <Typography data-id={publishedDate} variant="caption">
                        {publishedDate}
                    </Typography>
                </Stack>
            </>
        );
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

    footer(): ReactNode {
        return <CommentFooter videoID={this.props.videoID} />;
    }

    render(): ReactNode {
        const valueForComments = "comment-box";
        const valueForWordCloud = "word-cloud";
        const selected = this.state.tabSelected ?? valueForComments;

        return (
            <Box className={this.props.className}>
                <TabContext value={selected}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <TabList
                            aria-label="Tabs for the comments seen for the Youtube video"
                            onChange={(_: SyntheticEvent, newValue: string) => {
                                // this.setState({ tabSelected: newValue })
                            }}
                        >
                            <Tab
                                icon={<CommentIcon />}
                                value={valueForComments}
                            />
                            <Tab
                                icon={<CloudIcon />}
                                value={valueForWordCloud}
                                disabled
                                title="Work in Progress"
                            />
                        </TabList>
                    </Box>
                    <TabPanel
                        value={valueForComments}
                        sx={{ padding: "0px", paddingTop: "10px" }}
                    >
                        {this.renderList(
                            <CommentListItems
                                formatter={this.props.formatter}
                                videoID={this.props.videoID}
                            />
                        )}
                    </TabPanel>
                    <TabPanel value={valueForWordCloud}>In Progress</TabPanel>
                </TabContext>
            </Box>
        );
    }
}