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
import { ReactNode, Fragment, useRef, SyntheticEvent, useState } from "react";
import Typography from "@mui/material/Typography";
import { AskCommentThreads, AskLangResults, AskVideo } from "../helper/ask";
import { CommentThread } from "../types/Comments";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Skeleton from "@mui/material/Skeleton";
import Image from "next/image";
import EditIcon from "@mui/icons-material/Edit";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import CommentStyles from "@/styles/comments.module.css";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
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
import { AskForLanguage, LanguageResult } from "../types/askForNLP";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";

dayjs.extend(relativeTime);

echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    BarChart,
    CanvasRenderer,
]);

export interface CommentSharedProps {
    videoID: string;
}

interface CommentProps extends CommentSharedProps {
    formatter: Intl.NumberFormat;
    className?: string;
}

interface CommentState {
    tabSelected?: string;
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
                component="span"
            >
                <IconButton color="primary" disabled>
                    {icon}
                </IconButton>
                <Typography
                    variant={"subtitle2"}
                    sx={{ mb: "-2px" }}
                    component="span"
                >
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
                <Typography variant="caption" sx={{ fontStyle: "italic" }}>
                    {dayjs(props.date).fromNow()}
                </Typography>
            </Stack>
        </>
    );
}

function langResultsChart(
    results: AskForLanguage | false | string | undefined
) {
    if (!results) return <></>;
    if (typeof results === "string") return;
    return "hi";
}

function CommentItemFooter(props: {
    details: CommentThread;
    formatter: Intl.NumberFormat;
}) {
    // note secondary text is p tag, so ensure there's no big tags like div, p inside it
    const [langPlot, setLangPlot] = useState<
        AskForLanguage | false | undefined
    >(undefined);

    function plotChart(results: AskForLanguage | false) {
        setLangPlot(results);
    }

    const details = props.details;
    const topLevelComment = details.snippet.topLevelComment;
    const isEdited =
        topLevelComment.snippet.publishedAt !==
        topLevelComment.snippet.updatedAt;

    const results = langResultsChart(langPlot);

    const edit = isEdited ? (
        <Typography variant={"caption"} fontSize={"small"} component="span">
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
                flexWrap={"wrap"}
                sx={{ mt: "3px" }}
                component="span"
            >
                <LikeComponent
                    count={props.formatter.format(
                        Number(topLevelComment.snippet.likeCount)
                    )}
                />
                {showMore}
                {edit}
                <FetchMoreInfo
                    comment_id={topLevelComment.id}
                    text={topLevelComment.snippet.textOriginal}
                    sendLangResults={plotChart}
                />
            </Stack>
            {results}
        </>
    );
}

function FetchMoreInfo(props: {
    text: string;
    comment_id: string;
    sendLangResults: (results: AskForLanguage) => void;
}) {
    const results = useRef(null);
    const [requested, setRequested] = useState(false);
    const {
        data: langResults,
        error,
        isLoading,
    } = AskLangResults(props.text, props.comment_id, requested);
    const passed = langResults?.details && langResults.details[0].label;

    passed && props.sendLangResults(langResults);

    return (
        <>
            {!passed ? (
                <IconButton
                    color="primary"
                    disabled={isLoading}
                    onClick={async function () {
                        setRequested(true);
                    }}
                >
                    <AutoFixHighIcon />
                </IconButton>
            ) : (
                <></>
            )}
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
                primary={
                    <NameComponent
                        authorName={topLevelComment.snippet.authorDisplayName}
                        date={topLevelComment.snippet.publishedAt}
                    />
                }
                secondary={
                    <>
                        <Typography variant="body2" component={"span"}>
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
                    <div
                        dangerouslySetInnerHTML={{
                            __html:
                                data?.at(-1)?.failed ||
                                String(error) ||
                                "Failed to fetch the required comments",
                        }}
                    ></div>
                </Alert>
            )}
        </Stack>
    );
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
