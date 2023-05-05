import { RequestForMoreDetails } from "../types/CommentsUI";
import { CommentProps } from "../types/CommentsUI";
import { AskCommentThreads } from "../helper/ask";
import { CommentThread } from "../types/Comments";
import { useState } from "react";
import CommentItem from "./commentItem";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function CommentListItems(props: CommentProps) {
    const { data, error, isLoading } = AskCommentThreads(props.videoID);
    const [isOpened, setOpened] = useState<boolean>(false);
    // const plot = <></>;

    function plotChart(data: RequestForMoreDetails) {
        setOpened(true);
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
