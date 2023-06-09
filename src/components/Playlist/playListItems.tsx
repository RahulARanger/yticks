import React, { Component } from 'react'
import ListArea from '../listArea'
import ListItemText from '@mui/material/ListItemText'
import ListItemButton from '@mui/material/ListItemButton'
import { type CommonPropsForPlayListItems } from '../types/playlist'
import Drawer from '@mui/material/Drawer'
import { AskPlayList, AskPlayListItems } from '../helper/ask'
import Skeleton from '@mui/material/Skeleton'
import Fab from '@mui/material/Fab'
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay'
import Avatar from '@mui/material/Avatar'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Image from 'next/image'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import { Typography } from '@mui/material'
import { extractThumbnail, truncateText } from '../helper/simpilify'
import { type ReactNode } from 'react'

function PlayListVideoItems (props: CommonPropsForPlayListItems): ReactNode {
  const { data, error, isLoading } = AskPlayListItems(props.listID)
  const items = data?.details?.items
  if (!items || error) return <></>
  if (isLoading) return <Skeleton height={250} width={400} />

  return (
    <>
      {items.map(function (item, index) {
        const snippet = item.snippet
        const selected = item.snippet.thumbnails.high

        return (
          <ListItemButton key={item.id}>
            <Stack
              flexDirection="row"
              alignItems="center"
              justifyContent={'space-between'}
              columnGap={'10px'}
            >
              <ListItemText
                primary={
                  <Typography variant="subtitle2">{index + 1}</Typography>
                }
              />
              <ListItemAvatar sx={{ mr: '10px' }}>
                <Image
                  src={selected.url}
                  alt="thumbnail"
                  width={'69'}
                  height={'50'}
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Tooltip title={snippet.title}>
                    <Typography>{truncateText(snippet.title, 69)}</Typography>
                  </Tooltip>
                }
                secondary={snippet.videoOwnerChannelTitle}
              />
            </Stack>
          </ListItemButton>
        )
      })}
    </>
  )
}

function PlayListSummary (props: CommonPropsForPlayListItems): ReactNode {
  const { data, isLoading } = AskPlayList(props.listID)
  const playlistDetails = data?.details?.items[0]

  if (isLoading) return <Skeleton height={50} variant="rounded" />

  if (!playlistDetails) {
    return (
      <Tooltip title="No Details Found, Assuming it to Mix">
        <Typography p="6px" variant={'h6'}>
          Mix
        </Typography>
      </Tooltip>
    )
  }
  return (
    <Stack
      p="6px"
      alignItems="center"
      columnGap="6px"
      justifyContent={'space-between'}
      flexDirection={'row'}
    >
      <Avatar>
        <Image
          alt="Playlist thumbnail"
          src={extractThumbnail(playlistDetails.snippet.thumbnails).url}
          width={'69'}
          height={'50'}
        />
      </Avatar>
      <Typography p="6px" variant={'h6'}>
        {playlistDetails.snippet.title}
      </Typography>
    </Stack>
  )
}

class VideoItems extends ListArea<CommonPropsForPlayListItems, unknown> {
  title = ''
  header (): ReactNode {
    return <></>
  }

  render (): ReactNode {
    return super.renderList(<PlayListVideoItems listID={this.props.listID} />)
  }
}

interface PlaylistItemsState {
  opened: boolean
}

export default class PlayListItems extends Component<
CommonPropsForPlayListItems,
PlaylistItemsState
> {
  state: PlaylistItemsState = { opened: true }

  openDrawer (): void {
    this.setState({ opened: true })
  }

  closeDrawer (): void {
    this.setState({ opened: false })
  }

  render (): ReactNode {
    return (
      <>
        <Drawer
          open={this.state.opened}
          onClose={this.closeDrawer.bind(this)}
          PaperProps={{ elevation: 3 }}
        >
          <PlayListSummary listID={this.props.listID} />
          <VideoItems listID={this.props.listID} />
        </Drawer>

        <Fab
          variant="circular"
          size="medium"
          color="primary"
          aria-label="Toggle Playlist Items"
          sx={{ position: 'fixed', bottom: '10px', right: '10px' }}
          onClick={this.openDrawer.bind(this)}
        >
          <PlaylistPlayIcon />
        </Fab>
      </>
    )
  }
}
