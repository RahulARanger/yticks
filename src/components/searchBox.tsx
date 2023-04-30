import TextField from "@mui/material/TextField";
import {
    ChangeEvent,
    Component,
    ReactNode,
    KeyboardEvent,
    createRef,
    RefObject
} from "react";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import YoutubeSearchedForIcon from "@mui/icons-material/YoutubeSearchedFor";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box"
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { styled, alpha, SxProps, Theme } from "@mui/material/styles";


type changeEvent = ChangeEvent<HTMLInputElement>;

interface SearchBarState {
    passed?: boolean;
    modalOpened: boolean;
}

export interface SharedProps {
    onSearch: (videoId: string) => void;
    pocket: RefObject<HTMLInputElement>;
}

interface SearchBarProps extends SharedProps {
    showLabel?: boolean;
    size: "medium" | "small";
    className: string;
    atTop: boolean
}

const WithStyleTextField = styled(TextField)(({ theme }) => {
    const transition = "all ease-in-out .5s";
    const referWidth = "max(30%, 300px)"

    return {
        backgroundColor: alpha(theme.palette.common.white, 0.005),
        transition,
        "&:hover": {
            backgroundColor: alpha(theme.palette.common.white, 0.05),
        },
        margin: ".69%",
        maxWidth: referWidth,
        "&:focus-within": {
            maxWidth: `calc(${referWidth} + 69px)`,
        }
    };
});

abstract class SearchBar extends Component<SearchBarProps, SearchBarState> {
    state: SearchBarState = { modalOpened: false };
    pocket: RefObject<HTMLInputElement> = createRef();

    abstract handleRedirect(): undefined;
    abstract textFieldElement(feed?: (event: changeEvent) => boolean, sx?: SxProps<Theme>): ReactNode;
    protected abstract validate(event: changeEvent): boolean

    onEnterPress(event: KeyboardEvent<HTMLInputElement>): undefined {
        if (event.key !== "Enter") return;
        this.handleRedirect();
    }

    toggleModal() {
        this.setState({ modalOpened: !this.state.modalOpened });
    }

    forceModal(forced: boolean) {
        this.setState({ modalOpened: forced })
    }

    searchModal() {
        const hide = { display: { sm: "none", xs: "block" } };
        return (
            <>
                {this.textFieldElement(undefined, { opacity: { sm: 1, xs: 0 } })}
                <Box sx={hide}>
                    <IconButton onClick={this.toggleModal.bind(this)}><YoutubeSearchedForIcon /></IconButton>
                    <Dialog sx={hide} open={this.state.modalOpened} onClose={this.toggleModal.bind(this)} fullWidth maxWidth={"xs"}>
                        <DialogTitle>Search Video</DialogTitle>
                        <DialogContent>
                            You can just copy and paste the url from youtube.
                            <DialogActions>
                                {this.textFieldElement(this.feedValue.bind(this))}
                            </DialogActions>
                        </DialogContent>
                    </Dialog>
                </Box>
            </>
        )
    }

    protected goSearch(): ReactNode {
        return (
            // have span wrapper for the disabled button as tooltip is allowed for enabled components
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
                                <YoutubeSearchedForIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
                </InputAdornment>
            </>
        );
    }
    protected feedValue(event: changeEvent): boolean {
        const url: string = (event.target.value = event.target.value.trim());
        if (this.props.pocket.current) this.props.pocket.current.value = url;
        return true;
    }
}

export class SearchBarForYoutubeVideo extends SearchBar {
    regMatcher = new RegExp(
        /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/
    );

    protected validate(event: changeEvent): boolean {
        const url: string = (event.target.value = event.target.value.trim());
        this.setState({
            passed: this.regMatcher.test(url),
        });
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
        if (this.props.atTop) this.forceModal(false);
        this.props.onSearch(found);
    }

    textFieldElement(feed?: (event: changeEvent) => boolean, sx?: SxProps<Theme>) {
        return <WithStyleTextField
            fullWidth
            size={this.props.size}
            onChange={feed || this.validate.bind(this)}
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
            inputRef={feed ? null : this.props.pocket}
            autoFocus
            className={this.props.className}
            sx={sx}
        />
    }


    render(): React.ReactNode {
        if (!this.props.atTop) return this.textFieldElement();
        return this.searchModal()
    }
}

