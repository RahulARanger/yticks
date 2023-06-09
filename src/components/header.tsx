import AppBar from '@mui/material/AppBar'
import React, { Component, type ReactNode } from 'react'
import Toolbar from '@mui/material/Toolbar'
import Drawer from '@mui/material/Drawer'
import {
  SearchBarForPlaylistOfVideos,
  SearchBarForYoutubeVideo
  , type SharedProps
} from '@/components/searchBox'
import Typography from '@mui/material/Typography'
import headerStyles from '@/styles/header.module.css'
import GitHubIcon from '@mui/icons-material/GitHub'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import SettingsIcon from '@mui/icons-material/Settings'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import MenuIcon from '@mui/icons-material/Menu'
import ListItemIcon from '@mui/material/ListItemIcon'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'

interface HeaderProps extends SharedProps {
  textSearched: string
  resetSearch: () => void
  title: string
  onSettingsRequest: () => void
}

interface HeaderStates {
  openDrawer: boolean
}

export abstract class CommonHeader extends Component<
HeaderProps,
HeaderStates
> {
  state: HeaderStates = { openDrawer: false }
  githubURL = 'https://github.com/RahulARanger/yticks'

  toggleDrawer (): void {
    this.setState({ openDrawer: !this.state.openDrawer })
  }

  menuItems (): ReactNode {
    const hide = { display: { xs: 'block', sm: 'none' } }
    return (
      <>
        <Box sx={hide}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={this.toggleDrawer.bind(this)}
            sx={{ ml: '3px' }}
          >
            <MenuIcon />
          </IconButton>
          <Drawer
            anchor="left"
            open={this.state.openDrawer}
            onClose={this.toggleDrawer.bind(this)}
            disableScrollLock={true}
            sx={{
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: '200px'
              },
              ...hide
            }}
          >
            <Typography variant="subtitle1" ml="6px">
              Menu
            </Typography>
            <Divider color="orangered"/>
            <List>
              <ListItemButton href={this.githubURL} target="_blank">
                <ListItemIcon>
                  <GitHubIcon />
                </ListItemIcon>
                <ListItemText>Github</ListItemText>
              </ListItemButton>
              <ListItem>
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText>Settings</ListItemText>
              </ListItem>
            </List>
          </Drawer>
        </Box>
      </>
    )
  }

  iconButtons (): ReactNode {
    return (
      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
        <IconButton
          target="_blank"
          href="https://github.com/RahulARanger/yticks"
        >
          <GitHubIcon />
        </IconButton>
        <IconButton color="primary" onClick={this.props.onSettingsRequest}>
          <SettingsIcon />
        </IconButton>
      </Box>
    )
  }

  onLeft (): ReactNode {
    return (
      <>
        <IconButton sx={{ mr: '2px' }} onClick={this.props.resetSearch}>
          <ArrowBackIcon />
        </IconButton>
        <Typography sx={{ flexGrow: 1 }} variant="h6" component={'div'}>
          {this.props.title}
        </Typography>
      </>
    )
  }

  // eslint-disable-next-line no-unused-vars
  abstract searchBar (showAtTop: boolean): ReactNode

  render (): ReactNode {
    const showAtTop = Boolean(this.props.textSearched)
    return (
      <>
        <AppBar
          className={
            showAtTop ? headerStyles.topAppBar : headerStyles.centerAppBar
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
            {this.searchBar(showAtTop)}
            {this.iconButtons()}
            {this.menuItems()}
          </Toolbar>
        </AppBar>
      </>
    )
  }
}

export default class VideoPlayerHeader extends CommonHeader {
  searchBar (showAtTop: boolean): ReactNode {
    return (
      <SearchBarForYoutubeVideo
        showLabel={!showAtTop}
        size={showAtTop ? 'small' : 'medium'}
        onSearch={this.props.onSearch}
        className={headerStyles.textField}
        atTop={showAtTop}
        requested={this.props.requested}
      />
    )
  }
}

export class VideoPlayListHeader extends CommonHeader {
  searchBar (showAtTop: boolean): ReactNode {
    return (
      <SearchBarForPlaylistOfVideos
        showLabel={!showAtTop}
        size={showAtTop ? 'small' : 'medium'}
        onSearch={this.props.onSearch}
        className={headerStyles.textField}
        atTop={showAtTop}
        requested={this.props.requested}
      />
    )
  }
}
