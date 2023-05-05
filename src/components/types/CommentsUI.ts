import { AskForLanguage } from "./askForNLP";

export interface CommentSharedProps {
    videoID: string;
}

export interface CommentProps extends CommentSharedProps {
    formatter: Intl.NumberFormat;
    className?: string;
}

export interface RequestForMoreDetails {
    requestFor: string;
    response: AskForLanguage;
}
