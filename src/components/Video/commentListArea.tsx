import Stack from '@mui/material/Stack'
import ListArea from '../listArea'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import CommentIcon from '@mui/icons-material/Comment'
import React, { type ReactNode, Fragment, type SyntheticEvent, type MouseEvent } from 'react'
import Typography from '@mui/material/Typography'
import AutoGraphIcon from '@mui/icons-material/AutoGraph'
import { AskCommentThreads } from '../helper/ask'
import { type CommentThread } from '../types/Comments'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Slide from '@mui/material/Slide'
import Box from '@mui/material/Box'
import CloudIcon from '@mui/icons-material/Cloud'
import { CountOfTopLevelComments } from './miniComponents'
import CommentListItems from './commentListItems'
import { commentSortingOptions, type CommentProps } from '../types/CommentsUI'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import SortIcon from '@mui/icons-material/Sort'
import VideoDetailedGraphsComponent from './graphs'

interface CommentState {
  tabSelected?: string
  openMenuForSorting: boolean
  anchorForMenu?: HTMLElement
  selectedOptionForSorting: string
}

function CommentFooter (props: { videoID: string }): ReactNode {
  const {
    data,
    // error: _,
    isLoading,
    size,
    setSize
  } = AskCommentThreads(props.videoID)
  const details = data?.at(-1)?.details

  const notReady =
    isLoading || (size > 0 && typeof data?.at(size - 1) === 'undefined')

  if (details?.nextPageToken) {
    return (
      <ListItemButton
        sx={{ textAlign: 'center' }}
        data-token={details.nextPageToken}
        onClick={() => {
          setSize(size + 1)
        }}
        disabled={notReady}
      >
        <Typography color="orangered" align="center" m="0 auto">
          {notReady ? 'Loading...' : 'Show More'}
        </Typography>
      </ListItemButton>
    )
  }

  return <></>
}

export default class CommentArea extends ListArea<CommentProps, CommentState> {
  title = 'Comments'
  state: CommentState = { openMenuForSorting: false, selectedOptionForSorting: commentSortingOptions[0] }

  header (): ReactNode {
    const toggleMenu = (e: MouseEvent<HTMLElement>): void => {
      this.setState({ openMenuForSorting: !this.state.openMenuForSorting })
      if (!this.state.anchorForMenu) this.state.anchorForMenu = e.currentTarget
    }

    return (
      <>
      <Stack
        flexDirection={'row'}
        columnGap={2}
        justifyContent="stretch"
        alignItems="center"
      >
        <IconButton onClick={toggleMenu}><SortIcon/> </IconButton>
        <CountOfTopLevelComments
          formatter={this.props.formatter}
          videoID={this.props.videoID}
        />
      </Stack>
      <Menu open={this.state.openMenuForSorting} onClick={toggleMenu} anchorEl={this.state.anchorForMenu} disableScrollLock={true}>
      <div>
        <>
          {
          commentSortingOptions.map((option) => {
            return <MenuItem key={option} selected={option === this.state.selectedOptionForSorting} onClick={() => { this.setState({ selectedOptionForSorting: option }) }} >
              <Typography>{option}</Typography>
            </MenuItem>
          })
          }
      </>
      </div>
    </Menu></>
    )
  }

  commentName (name: string, publishedDate: string): ReactNode {
    return (
      <>
        <Stack
          flexDirection={'row'}
          justifyContent={'space-between'}
          alignItems={'baseline'}
        >
          <Typography>{name}</Typography>
          <Typography data-id={publishedDate} variant="caption">
            {publishedDate}
          </Typography>
        </Stack>
      </>
    )
  }

  commentItem (comment: CommentThread): ReactNode {
    const topLevelComment = comment.snippet.topLevelComment
    return (
      <Fragment key={comment.id}>
        <ListItem>
          <Stack flexDirection={'row'} sx={{ width: '100%' }}>
            <ListItemText
              primary={this.commentName(
                topLevelComment.snippet.authorDisplayName,
                topLevelComment.snippet.publishedAt
              )}
              secondary={topLevelComment.snippet.textOriginal}
            ></ListItemText>
          </Stack>
        </ListItem>
      </Fragment>
    )
  }

  footer (): ReactNode {
    return <CommentFooter videoID={this.props.videoID} />
  }

  renderGraphs (): ReactNode {
    return <Stack display={'flex'} justifyContent={'stretch'}>
      <VideoDetailedGraphsComponent videoID={this.props.videoID}/>
    </Stack>
  }

  render (): ReactNode {
    const valueForComments = 'comment-box'
    const valueForGraphs = 'detailed-graphs'
    const valueForWordCloud = 'word-cloud'
    const selected = this.state.tabSelected ?? valueForComments

    return (
      <Box className={this.props.className}>
        <TabContext value={selected}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList
              aria-label="Tabs for the comments seen for the Youtube video"
              onChange={(_: SyntheticEvent, newValue: string) => {
                this.setState({ tabSelected: newValue })
              }}
            >
              <Tab icon={<CommentIcon />} value={valueForComments} />
              <Tab
                icon={<AutoGraphIcon />}
                value={valueForGraphs}
              />
              <Tab
                icon={<CloudIcon />}
                value={valueForWordCloud}
                disabled
                title="Work in Progress"
              />
            </TabList>
          </Box>
          <Slide in={selected === valueForComments} direction="up" appear={false}>
          <TabPanel
            value={valueForComments}
            sx={{ padding: '0px', paddingTop: '10px' }}
          >
            {this.renderList(
               <CommentListItems
                formatter={this.props.formatter}
                videoID={this.props.videoID}
                sortingOption={this.state.selectedOptionForSorting}
              />
            )}
          </TabPanel>
          </Slide>
          <Slide in={selected === valueForGraphs} direction="up"><TabPanel value={valueForGraphs}>{this.renderGraphs()}</TabPanel></Slide>
          <TabPanel value={valueForWordCloud}>In Progress</TabPanel>
        </TabContext>
      </Box>
    )
  }
}
