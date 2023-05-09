export interface PlaylistItem {}

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
