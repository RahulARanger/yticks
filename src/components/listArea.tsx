import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { Component, ReactNode } from "react";
import ListSubheader from "@mui/material/ListSubheader";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { getTypographyUtilityClass } from "@mui/material";

export default abstract class ListArea<PROPs> extends Component<PROPs> {
	title: string = "...";
	minWidth: string = "250px";
	maxWidth: string = "500px";

	abstract header(): ReactNode;
	abstract render(): ReactNode;

	footer(): ReactNode {
		return <></>
	}

	renderListItems(items: ReactNode): ReactNode {
		return this.renderList(items)
	};

	renderList(listItems: ReactNode): ReactNode {
		return (
			<Paper elevation={3} sx={{ flexGrow: 1, height: "90vh", minHeight: "300px" }}>
				<List
					sx={{
						border: "1px solid black",
						height: "100%",
						overflowY: "scroll"
					}}
					subheader={
						<ListSubheader>
							<Stack
								flexDirection={"row"}
								justifyContent={"space-between"}
								alignItems={"center"}
							>
								{this.title}
								{this.header()}
							</Stack>
						</ListSubheader>
					}
				>
					{listItems}
					{this.footer()}
				</List>
			</Paper>
		);
	}
}
