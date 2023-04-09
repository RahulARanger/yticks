import AppBar from "@mui/material/AppBar";
import { Component, ReactNode } from "react";
import Toolbar from "@mui/material/Toolbar";
import { SearchBarForYoutubeVideo } from "@/components/searchBox";
import Typography from "@mui/material/Typography";
import headerStyles from "@/styles/header.module.css";
import { SharedProps } from "@/components/searchBox";

interface HeaderProps extends SharedProps {
	textSearched: string;
	title: string;
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
					color="transparent"
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
					</Toolbar>
				</AppBar>
			</>
		);
	}
}
