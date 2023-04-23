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
	const words = props.text.split(" ");
	const components = words.map(function (word, index) {
		if (word.startsWith("#")) {
			return <YoutubeHashTag tag={word} key={index} />;
		}

		if (word.startsWith("http") || word.startsWith("www")) {
			return (
				<Link key={index} href={word}>
					{word}&nbsp;
				</Link>
			);
		}
		return <span key={index}>{word + " "}</span>;
	});
	return (
		<Typography
			variant={props.variant ?? "body2"}
			sx={{ wordWrap: "word-break" }}
		>
			{components}
		</Typography>
	);
}
