'use client'

import TextField from '@mui/material/TextField'
import React, { type ChangeEvent, Component, type ReactNode, type KeyboardEvent } from 'react'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import YoutubeSearchedForIcon from '@mui/icons-material/YoutubeSearchedFor'
import Tooltip from '@mui/material/Tooltip'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { styled, alpha, type SxProps, type Theme } from '@mui/material/styles'
import { encodeID } from './helper/ask'

type changeEvent = ChangeEvent<HTMLInputElement>

interface SearchBarState {
  passed?: boolean
  modalOpened: boolean
  url: string
  disabled: boolean
}

export interface SharedProps {
  // eslint-disable-next-line no-unused-vars
  onSearch: (videoId: string) => void
  requested: string
}

interface SearchBarProps extends SharedProps {
  showLabel?: boolean
  size: 'medium' | 'small'
  className: string
  atTop: boolean
}

const WithStyleTextField = styled(TextField)(({ theme }) => {
  const transition = 'all ease-in-out .5s'
  const referWidth = 'max(30%, 300px)'

  return {
    backgroundColor: alpha(theme.palette.common.white, 0.005),
    transition,
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.05)
    },
    margin: '.69%',
    maxWidth: referWidth,
    '&:focus-within': {
      maxWidth: `calc(${referWidth} + 69px)`
    }
  }
})

abstract class SearchBar extends Component<SearchBarProps, SearchBarState> {
  abstract regMatcher: RegExp
  abstract dummyURL: string
  abstract name: string

  constructor (props: SearchBarProps) {
    super(props)
    this.state = {
      disabled: Boolean(this.props.requested),
      modalOpened: false,
      url: ''
    }
  }

  protected validate (event: changeEvent): boolean {
    const url: string = (event.target.value = event.target.value.trim())
    this.setState({ passed: this.regMatcher.test(url), url })
    return true
  }

  // eslint-disable-next-line no-unused-vars
  abstract _handleRedirect (url: string): string | false // return the id (result of the url)

  handleRedirect (): void {
    if (!this.state.passed) return
    const found = this._handleRedirect(this.state.url)

    if (!found) { this.setState({ passed: false }); return }
    if (this.props.atTop) this.forceModal(false)

    this.props.onSearch(found)
  }

  onEnterPress (event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key !== 'Enter') return
    this.handleRedirect()
  }

  toggleModal (): void {
    this.setState({ modalOpened: !this.state.modalOpened })
  }

  forceModal (forced: boolean): void {
    this.setState({ modalOpened: forced })
  }

  searchModal (): ReactNode {
    const hide = { display: { sm: 'none', xs: 'block' } }
    return (
      <>
        {this.textFieldElement({
          display: { xs: 'none', sm: 'block' }
        })}
        <Box sx={hide}>
          <IconButton onClick={this.toggleModal.bind(this)}>
            <YoutubeSearchedForIcon />
          </IconButton>
          <Dialog
            sx={hide}
            open={this.state.modalOpened}
            onClose={this.toggleModal.bind(this)}
            fullWidth
            maxWidth={'xs'}
            disableScrollLock={true}
          >
            <DialogTitle>Search Video</DialogTitle>
            <DialogContent>
              You can just copy and paste the url from youtube.
              <DialogActions>{this.textFieldElement()}</DialogActions>
            </DialogContent>
          </Dialog>
        </Box>
      </>
    )
  }

  protected goSearch (): ReactNode {
    return (
      // have span wrapper for the disabled button as tooltip is allowed for enabled components
      <>
        <InputAdornment position="end">
          <Tooltip title={this.state.passed ? 'Search' : 'Invalid Input'}>
            <span>
              <IconButton
                type="button"
                sx={{ p: '10px' }}
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
    )
  }

  textFieldElement (sx?: SxProps<Theme>): ReactNode {
    return (
      <WithStyleTextField
        fullWidth
        size={this.props.size}
        onChange={this.validate.bind(this)}
        error={!this.state.passed}
        placeholder={this.dummyURL}
        name={this.name}
        label={
          this.props.showLabel
            ? this.state.disabled
              ? 'Loading...'
              : this.state.passed
                ? 'You can now search'
                : 'Paste a valid Youtube URL'
            : ''
        }
        InputLabelProps={{ shrink: true }}
        InputProps={{
          endAdornment: this.goSearch()
        }}
        onKeyDown={this.onEnterPress.bind(this)}
        autoFocus
        className={this.props.className}
        sx={sx}
        value={this.state.url}
        disabled={this.state.disabled}
      />
    )
  }

  componentDidMount (): void {
    if (this.props.atTop) return

    if (!this.state.url && this.props.requested) {
      this.setState({ disabled: true })
      let toRequest

      if (!this.props.requested.startsWith('https')) toRequest = this.props.requested
      // in case of the searchParams has "id"
      else toRequest = this._handleRedirect(this.props.requested) // extracting id in case of "q" param

      if (!toRequest) { alert(`${this.props.requested} is not proper URL, please check once`) } else this.props.onSearch(toRequest) // in case of the searchParams has "q"

      this.setState((prevState) => ({ disabled: !prevState.disabled }))
    }
  }

  render (): React.ReactNode {
    if (!this.props.atTop) return this.textFieldElement()
    return this.searchModal()
  }
}

export class SearchBarForYoutubeVideo extends SearchBar {
  regMatcher = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/

  name = 'yt-url'
  dummyURL = 'https://www.youtube.com/watch?v=tXKG7p4Fn5E'

  _handleRedirect (url: string): string | false {
    const matches = url.match(this.regMatcher)

    const found = matches?.at(-2) ?? false
    return found === 'shorts' ? matches?.at(-1)?.slice(1) ?? false : found
  }
}

export class SearchBarForPlaylistOfVideos extends SearchBar {
  regMatcher =
    /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/|youtu\.be\/).*?[?&]v=([^&]+).*[?&]list=([^&]+)/

  dummyURL =
    'https://www.youtube.com/watch?v=7FDRQifEMUQ&list=RDxtfXl7TZTac&index=12'

  name = 'yt-playlist'

  _handleRedirect (url: string): string | false {
    const matches = url.match(this.regMatcher)
    const videoID = matches?.at(1) ?? false
    const listID = matches?.at(2) ?? false
    return videoID && listID ? encodeID(videoID, listID) : false
  }
}
