export interface PlaylistItem {
    kind: "youtube#playlistItem";
    etag: string;
    id: string;
    snippet: {
        publishedAt: string;
        channelId: string;
        title: string;
        description: string;
        thumbnails: {
            [key: string]: {
                url: string;
                width: number;
                height: number;
            };
        };
        channelTitle: string;
        videoOwnerChannelTitle: string;
        videoOwnerChannelId: string;
        playlistId: string;
        position: number;
        resourceId: {
            kind: string;
            videoId: string;
        };
    };
    contentDetails: {
        videoId: string;
        startAt: string;
        endAt: string;
        note: string;
        videoPublishedAt: string;
    };
    status: {
        privacyStatus: string;
    };
}

export interface Playlist {
    kind: "youtube#playlistItemListResponse";
    etag: string;
    nextPageToken: string;
    prevPageToken: string;
    pageInfo: {
        totalResults: number;
        resultsPerPage: number;
    };
    items: Array<PlaylistItem>;
}

export interface PlayListViewState {
    listID: string;
}

export interface PlayListDetailedViewProps {}

export interface PlayListDetailedViewState {
    videoIDs: Array<string>;
    index: number;
}
