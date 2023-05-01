import AppBar from "@mui/material/AppBar";
import { Component, ReactNode } from "react";
import Toolbar from "@mui/material/Toolbar";
import Drawer from "@mui/material/Drawer";
import { SearchBarForYoutubeVideo } from "@/components/searchBox";
import Typography from "@mui/material/Typography";
import headerStyles from "@/styles/header.module.css";
import { SharedProps } from "@/components/searchBox";
import GitHubIcon from "@mui/icons-material/GitHub";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";
import List from "@mui/material/List";
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import MenuIcon from '@mui/icons-material/Menu';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

interface HeaderProps extends SharedProps {
    textSearched: string;
    title: string;
    onSettingsRequest: () => void;
}

interface HeaderStates {
    openDrawer: boolean
}

export default class Header extends Component<HeaderProps, HeaderStates> {
    state: HeaderStates = { openDrawer: false }

    githubURL = "https://github.com/RahulARanger/yticks"

    toggleDrawer() {
        this.setState({ openDrawer: !this.state.openDrawer })
    }

    menuItems() {
        const hide = { display: { xs: "block", sm: "none" } }
        return (
            <>
                <Box sx={hide}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={this.toggleDrawer.bind(this)}
                        sx={{ ml: "3px" }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Drawer anchor="left" open={this.state.openDrawer} onClose={this.toggleDrawer.bind(this)} sx={{
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: "200px" }, ...hide
                    }}>
                        <Typography variant="subtitle1" ml="2px">Menu</Typography>
                        <List>
                            <ListItemButton href={this.githubURL} target="_blank">
                                <ListItemIcon><GitHubIcon /></ListItemIcon>
                                <ListItemText>Github</ListItemText>
                            </ListItemButton>
                            <ListItem>
                                <ListItemIcon><SettingsIcon /></ListItemIcon>
                                <ListItemText>Settings</ListItemText>
                            </ListItem>
                        </List>
                    </Drawer>
                </Box>
            </>
        )
    }

    iconButtons() {
        return (
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}><IconButton
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
                </IconButton></Box>
        )
    }

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
                    component="nav"
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
                            atTop={showAtTop}
                            requested={this.props.requested}
                        />

                        {this.iconButtons()}
                        {this.menuItems()}

                    </Toolbar>
                </AppBar>
            </>
        );
    }
}
