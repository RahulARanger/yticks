import { Comment, CommentThread } from "../types/Comments";
import CommentStyles from "@/styles/comments.module.css";
import { CommentAvatarComponent, NameComponent } from "./miniComponents";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { LikeComponent } from "./miniComponents";
import EditIcon from "@mui/icons-material/Edit";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";
import { AskLangResults } from "../helper/ask";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import LanguageIcon from "@mui/icons-material/Language";
import Tooltip from "@mui/material/Tooltip";
import { sendDetailsFetched } from "../types/CommentsUI";
import { formatDateTime } from "../helper/simpilify";

interface CommentItemProps {
    comment: CommentThread;
    formatter: Intl.NumberFormat;
    getReplies: sendDetailsFetched;
}

function FetchMoreInfo(props: {
    comment: Comment;
    plotChart: sendDetailsFetched;
}) {
    const [requestedForLang, setRequestedForLang] = useState(false);

    const text = props.comment.snippet.textOriginal;
    const comment_id = props.comment.id;
    const {
        data: langResults,
        error,
        isLoading,
    } = AskLangResults(text, comment_id, requestedForLang);
    const passed = langResults?.details && langResults.details[0].label;

    let title;
    let comp = <></>;

    if (!requestedForLang || isLoading || error) {
        title = error ? String(error) : "Ask";
        comp = (
            <IconButton
                color="primary"
                disabled={isLoading || Boolean(error)}
                onClick={async function () {
                    setRequestedForLang(true);
                }}
            >
                <AutoFixHighIcon />
            </IconButton>
        );
    } else if (langResults?.details) {
        title = "Language";
        comp = (
            <IconButton
                color="info"
            >
                <LanguageIcon />
            </IconButton>
        );
    }

    return (
        <>
            <Tooltip title={title}>
                <span>{comp}</span>
            </Tooltip>
        </>
    );
}

function CommentItemFooter(props: CommentItemProps) {
    // note secondary text is p tag, so ensure there's no big tags like div, p inside it

    const details = props.comment;
    const topLevelComment = details.snippet.topLevelComment;
    const isEdited =
        topLevelComment.snippet.publishedAt !==
        topLevelComment.snippet.updatedAt;

    const edit = isEdited ? (
        <Tooltip title={formatDateTime(topLevelComment.snippet.updatedAt)}>
            <Typography variant={"caption"} fontSize={"small"} component="span">
                {dayjs(topLevelComment.snippet.updatedAt).fromNow()}
                <EditIcon fontSize={"inherit"} sx={{ ml: "3px", mb: "-1px" }} />
            </Typography >
        </Tooltip>
    ) : (
        <></>
    );

    const showMore = details.replies?.comments?.length ? (
        <Button size="small" onClick={() => {
            props.getReplies(props.comment)
        }}>{`Replies ${props.formatter.format(
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
                {/* <FetchMoreInfo
                    comment={topLevelComment}
                    plotChart={props.plotChart}
                /> */}
            </Stack>
        </>
    );
}

export default function CommentItem(props: CommentItemProps) {
    const topLevelComment = props.comment.snippet.topLevelComment;
    const [text, setText] = useState(topLevelComment.snippet.textOriginal);

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
                        creationDate={topLevelComment.snippet.publishedAt}
                    />
                }
                secondary={
                    <>
                        <Typography
                            variant="body2"
                            component={"span"}
                            onInput={(event) => {
                                alert(event.currentTarget.textContent)
                                setText(event.currentTarget.textContent || text)
                            }}
                        >
                            {text}
                        </Typography>
                        <CommentItemFooter
                            comment={props.comment}
                            formatter={props.formatter}
                            getReplies={props.getReplies}
                        />
                    </>
                }
            />
        </ListItem>
    );
}
