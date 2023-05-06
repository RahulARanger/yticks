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
import { useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import { sendComment } from "../types/CommentsUI";
import { formatDateTime } from "../helper/simpilify";

interface CommentItemProps {
    comment: Comment;
    formatter: Intl.NumberFormat;
    getReplies?: sendComment;
    replies?: Array<Comment>;
    replyCount: number;
}

function CommentItemFooter(props: CommentItemProps) {
    // note secondary text is p tag, so ensure there's no big tags like div, p inside it

    const topLevelComment = props.comment;
    const isEdited =
        topLevelComment.snippet.publishedAt !==
        topLevelComment.snippet.updatedAt;

    const edit = isEdited ? (
        <Tooltip title={formatDateTime(topLevelComment.snippet.updatedAt)}>
            <Typography variant={"caption"} fontSize={"small"} component="span">
                {dayjs(topLevelComment.snippet.updatedAt).fromNow()}
                <EditIcon fontSize={"inherit"} sx={{ ml: "3px", mb: "-1px" }} />
            </Typography>
        </Tooltip>
    ) : (
        <></>
    );

    const showMore = props.replies ? (
        <Button
            size="small"
            onClick={() => {
                props.getReplies &&
                    props.getReplies(props.comment, props.replyCount, props.replies);
            }}
        >{`Replies ${props.formatter.format(props.replyCount || 0)}`}</Button>
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
    const topLevelComment = props.comment;
    const [text, setText] = useState(topLevelComment.snippet.textOriginal);
    const [showMore, setShowMore] = useState<boolean>(false);

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
                                alert(event.currentTarget.textContent);
                                setText(
                                    event.currentTarget.textContent || text
                                );
                            }}
                        >
                            {
                                text.length < 100 ? text : (
                                    <>
                                        {showMore ? text : text.slice(0, 100)}
                                        <Button variant="text" onClick={() => setShowMore(!showMore)}><Typography variant="caption">{`Show ${showMore ? "Less" : "More"}`}</Typography></Button>
                                    </>
                                )
                            }
                        </Typography>
                        <CommentItemFooter
                            comment={props.comment}
                            formatter={props.formatter}
                            getReplies={props.getReplies}
                            replies={props.replies}
                            replyCount={props.replyCount}
                        />
                    </>
                }
            />
        </ListItem >
    );
}
