import AppBar from "@mui/material/AppBar";
import { Component, ReactNode } from "react";
import Toolbar from "@mui/material/Toolbar";
import { SearchBarForYoutubeVideo } from "@/components/searchBox";
import Typography from "@mui/material/Typography";
import headerStyles from "@/styles/header.module.css";
import { SharedProps } from "@/components/searchBox";
import GitHubIcon from "@mui/icons-material/GitHub";
import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";

interface HeaderProps extends SharedProps {
	textSearched: string;
	title: string;
	onSettingsRequest: () => void;
}

export default class Header extends Component<HeaderProps, {}> {
	onLeft(): ReactNode {
		return (
			<>
				<Typography sx={{ flexGrow: 1 }} variant="h6" component={"div"}>
					{this.props.title}
				</Typography>
			</>
		);
	}

	render(): ReactNode {
		const showAtTop = Boolean(this.props.textSearched);
		return (
			<>
				<AppBar
					className={
						showAtTop
							? headerStyles.topAppBar
							: headerStyles.centerAppBar
					}
					elevation={showAtTop ? 3 : 0}
				>
					<Toolbar
						variant="dense"
						className={
							showAtTop
								? `${headerStyles.toolbar}`
								: `${headerStyles.toolbar} ${headerStyles.hideThings}`
						}
					>
						{this.onLeft()}
						<SearchBarForYoutubeVideo
							showLabel={!showAtTop}
							size={showAtTop ? "small" : "medium"}
							onSearch={this.props.onSearch}
							className={headerStyles.textField}
							pocket={this.props.pocket}
						/>
						<IconButton
							target="_blank"
							href="https://github.com/RahulARanger/yticks"
						>
							<GitHubIcon />
						</IconButton>
						<IconButton
							color="primary"
							onClick={this.props.onSettingsRequest}
						>
							<SettingsIcon />
						</IconButton>
					</Toolbar>
				</AppBar>
			</>
		);
	}
}
