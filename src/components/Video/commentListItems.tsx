import { RequestForMoreDetails } from "../types/CommentsUI";
import { CommentProps } from "../types/CommentsUI";
import { AskCommentThreads } from "../helper/ask";
import { CommentThread } from "../types/Comments";
import { useRef, useState } from "react";
import CommentItem from "./commentItem";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { Typography } from "@mui/material";
import { AskForLanguage } from "../types/askForNLP";

function EmotionalPieChart(props: { details: AskForLanguage }) { }


function ShowEmotionalDetails(props: {
    comment: RequestForMoreDetails | undefined;
    opened: boolean;
    closeModal: () => void;
}) {
    const comment = props.comment?.details;
    const results = props.comment?.results;

    return (
        <Dialog
            open={props.opened}
            title="Analysis on the Comment"
            onClose={props.closeModal}
            maxWidth="md"
        >
            <DialogTitle>
                <Stack
                    justifyContent={"space-between"}
                    direction="row"
                    alignItems={"center"}
                >
                    <Typography>Requested Details for the Comment</Typography>
                    <IconButton onClick={props.closeModal}>
                        <CloseIcon />
                    </IconButton>
                </Stack>
            </DialogTitle>
            <DialogContent>
                <DialogContentText></DialogContentText>
            </DialogContent>
        </Dialog>
    );
}


function ShowMoreReplies(props: { thread?: CommentThread, opened: boolean, closeModal: () => void }) {
    return (
        <Dialog
            open={props.opened}
            title="Replies"
            onClose={props.closeModal}
            maxWidth="md"
        >
            <DialogTitle>
                <Stack
                    justifyContent={"space-between"}
                    direction="row"
                    alignItems={"center"}
                >
                    <Typography>Requested Details for the Comment</Typography>
                    <IconButton onClick={props.closeModal}>
                        <CloseIcon />
                    </IconButton>
                </Stack>
            </DialogTitle>
            <DialogContent>
                <DialogContentText></DialogContentText>
            </DialogContent>
        </Dialog>
    );
}

export default function CommentListItems(props: CommentProps) {
    const { data, error, isLoading } = AskCommentThreads(props.videoID);
    const [isOpened, setOpened] = useState<boolean>(false);
    const selectedComment = useRef<undefined | CommentThread>();

    const closeModal = () => setOpened(false);
    function getReplies(thread: CommentThread) {
        selectedComment.current = thread;
    }

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
                                getReplies={getReplies}
                            />
                        );
                    })}
                    <ShowMoreReplies opened={isOpened} closeModal={closeModal} thread={selectedComment.current} />
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
