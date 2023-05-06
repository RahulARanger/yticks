import { Comment } from "./Comments";
import { AskForLanguage } from "./askForNLP";

export interface CommentSharedProps {
    videoID: string;
}

export interface CommentProps extends CommentSharedProps {
    formatter: Intl.NumberFormat;
    className?: string;
}

export interface RequestForMoreDetails {
    details: Comment;
    results: AskForLanguage | undefined;
}

export type sendComment = (comment: Comment, replies?: Array<Comment>, replyCount?: number) => void;
