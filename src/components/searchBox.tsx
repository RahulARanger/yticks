import TextField from "@mui/material/TextField";
import {
	ChangeEvent,
	Component,
	ReactNode,
	KeyboardEvent,
	createRef,
	RefObject,
} from "react";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import YoutubeSearchedForIcon from "@mui/icons-material/YoutubeSearchedFor";
import Tooltip from "@mui/material/Tooltip";
import { styled, alpha } from "@mui/material/styles";

interface SearchBarState {
	passed?: boolean;
}

export interface SharedProps {
	onSearch: (videoId: string) => void;
	pocket: RefObject<HTMLInputElement>;
}

interface SearchBarProps extends SharedProps {
	showLabel?: boolean;
	size: "medium" | "small";
	className: string;
}

const WithStyleTextField = styled(TextField)(({ theme }) => {
	const transition = "all ease-in-out .5s";
	return {
		backgroundColor: alpha(theme.palette.common.white, 0.005),
		margin: ".69%",
		maxWidth: "300px",
		transition,
		"&:hover": {
			backgroundColor: alpha(theme.palette.common.white, 0.05),
		},
		"&:focus-within": {
			maxWidth: "400px",
		},
	};
});

abstract class SearchBar extends Component<SearchBarProps, SearchBarState> {
	state: SearchBarState = {};
	pocket: RefObject<HTMLInputElement> = createRef();

	abstract handleRedirect(): undefined;

	protected goSearch(): ReactNode {
		return (
			<>
				<InputAdornment position="end">
					<Tooltip
						title={this.state.passed ? "Search" : "Invalid Input"}
					>
						<span>
							<IconButton
								type="button"
								sx={{ p: "10px" }}
								aria-label="search"
								color="primary"
								size="small"
								disabled={!this.state.passed}
								onClick={this.handleRedirect.bind(this)}
							>
								<YoutubeSearchedForIcon></YoutubeSearchedForIcon>
							</IconButton>
						</span>
					</Tooltip>
				</InputAdornment>
			</>
		);
	}
	protected validate(event: ChangeEvent<HTMLInputElement>): boolean {
		return false;
	}
}

export class SearchBarForYoutubeVideo extends SearchBar {
	regMatcher = new RegExp(
		/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/
	);

	protected validate(event: ChangeEvent<HTMLInputElement>): boolean {
		const url: string = (event.target.value = event.target.value.trim());
		this.setState({ passed: this.regMatcher.test(url) });
		return true;
	}

	handleRedirect(): undefined {
		if (!this.state.passed) return;
		const url: string = this.props.pocket.current?.value ?? "";
		const matches = url.match(this.regMatcher);

		let found = matches?.at(-2) ?? false;
		found = found === "shorts" ? matches?.at(-1)?.slice(1) ?? false : found;

		if (!found) {
			this.state.passed = false;
			return;
		}
		this.props.onSearch(found);
	}

	onEnterPress(event: KeyboardEvent<HTMLInputElement>): undefined {
		if (event.key !== "Enter") return;
		this.handleRedirect();
	}

	render(): React.ReactNode {
		return (
			<WithStyleTextField
				fullWidth
				size={this.props.size}
				onChange={this.validate.bind(this)}
				error={!this.state.passed}
				placeholder="https://www.youtube.com/watch?v=tXKG7p4Fn5E"
				name="yt-url"
				label={
					this.props.showLabel
						? this.state.passed
							? "You can now search"
							: "Paste a valid Youtube URL"
						: ""
				}
				InputLabelProps={{ shrink: true }}
				InputProps={{
					endAdornment: this.goSearch(),
				}}
				onKeyDown={this.onEnterPress.bind(this)}
				inputRef={this.props.pocket}
				autoFocus
				className={this.props.className}
			/>
		);
	}
}
