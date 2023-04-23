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

export default function ParseDesc(props: DescProps) {
	if (!props.text) return <br />;
	const words = props.text.split(" ");
	const components = words.map(function (word, index) {
		if (word.startsWith("#")) {
			return (
				<Link key={index} href={hashTag(word)}>
					{word.slice(1)}&nbsp;
				</Link>
			);
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
		<Typography variant={props.variant ?? "body2"}>{components}</Typography>
	);
}
