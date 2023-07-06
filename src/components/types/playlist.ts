import { type ExpectedDetails, type errorResponse } from './response'

export interface PlaylistItem {
  kind: 'youtube#playlistItem'
  etag: string
  id: string
  snippet: {
    publishedAt: string
    channelId: string
    title: string
    description: string
    thumbnails: Record<
    string,
    {
      url: string
      width: number
      height: number
    }
    >
    channelTitle: string
    videoOwnerChannelTitle: string
    videoOwnerChannelId: string
    playlistId: string
    position: number
    resourceId: {
      kind: string
      videoId: string
    }
  }
  contentDetails: {
    videoId: string
    startAt: string
    endAt: string
    note: string
    videoPublishedAt: string
  }
  status: {
    privacyStatus: string
  }
}

export interface PlayListResponse extends errorResponse {
  kind: 'youtube#playlistItemListResponse'
  etag: string
  nextPageToken: string
  prevPageToken: string
  pageInfo: {
    totalResults: number
    resultsPerPage: number
  }
  items: Playlist[]
}

export interface Playlist {
  kind: 'youtube#playlist'
  etag: string
  id: string
  snippet: {
    publishedAt: string
    channelId: string
    title: string
    description: string
    thumbnails: Record<
    string,
    {
      url: string
      width: number
      height: number
    }
    >
    channelTitle: string
    defaultLanguage: string
    localized: {
      title: string
      description: string
    }
  }
  status: {
    privacyStatus: string
  }
  contentDetails: {
    itemCount: number
  }
  localizations: Record<
  string,
  {
    title: string
    description: string
  }
  >
}

export interface PlayListItemResponse extends errorResponse {
  kind: 'youtube#playlistItemListResponse'
  etag: string
  nextPageToken: string
  prevPageToken: string
  pageInfo: {
    totalResults: number
    resultsPerPage: number
  }
  items: PlaylistItem[]
}
export interface CommonPropsForPlayListItems {
  listID: string
}
export interface CommonPropsForPlayList extends CommonPropsForPlayListItems {
  videoID: string
}

export interface PlayListDetailedViewProps extends CommonPropsForPlayList {}
export interface PlayListViewState extends CommonPropsForPlayList {}
export interface PlayListDetailedViewState {
  videoIDs: string[]
  index: number
}

export type ExpectedPlaylist = ExpectedDetails<PlayListResponse>
export type ExpectedPlaylistItems = ExpectedDetails<PlayListItemResponse>
