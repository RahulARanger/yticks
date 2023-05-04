import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { hashTag } from "./helper/urls";

interface DescProps {
    text: string;
    variant?:
        | "button"
        | "caption"
        | "h1"
        | "h2"
        | "h3"
        | "h4"
        | "h5"
        | "h6"
        | "inherit"
        | "subtitle1"
        | "subtitle2"
        | "body1"
        | "body2"
        | "overline"
        | undefined;
}

export function YoutubeHashTag(props: { tag: string }) {
    return <Link href={hashTag(props.tag)}>{props.tag}&nbsp;</Link>;
}

export default function ParseDesc(props: DescProps) {
    if (!props.text) return <br />;
    const style = {
        whiteSpace: "break-spaces",
        overflowWrap: "break-word",
        display: "inline-block",
    };

    const words = props.text.split(" ");
    const components = words.map(function (word, index) {
        if (word.startsWith("#")) {
            return <YoutubeHashTag tag={word} key={index} />;
        }

        if (word.startsWith("http") || word.startsWith("www")) {
            return (
                <Link key={index} href={word} sx={style}>
                    {word}&nbsp;
                </Link>
            );
        }
        return (
            <span
                key={index}
                style={{
                    display: "inline-block",
                }}
            >
                {word}&nbsp;
            </span>
        );
    });
    return (
        <Typography
            variant={props.variant ?? "body2"}
            component={"span"}
            sx={style}
        >
            {components}
        </Typography>
    );
}
