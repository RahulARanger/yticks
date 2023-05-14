export interface thumbNail {
    [key: string]: {
        url: string;
        width: number;
        height: number;
    };
}

interface localizations {
    [key: string]: {
        title: string;
        description: string;
    };
}

export interface VideoDetails {
    kind: "youtube#video";
    etag: string;
    id: string;
    snippet: {
        publishedAt: string;
        channelId: string;
        title: string;
        description: string;
        thumbnails: thumbNail;
        channelTitle: string;
        tags: Array<string>;
        categoryId: string;
        liveBroadcastContent: string;
        defaultLanguage?: string;
        localized: {
            title: string;
            description: string;
        };
        defaultAudioLanguage?: string;
    };
    contentDetails: {
        duration: string;
        dimension: string;
        definition: string;
        caption: string;
        licensedContent: boolean;
        regionRestriction?: {
            allowed: Array<string>;
            blocked: Array<string>;
        };
        contentRating: {
            acbRating?: string;
            agcomRating?: string;
            anatelRating?: string;
            bbfcRating?: string;
            bfvcRating?: string;
            bmukkRating?: string;
            catvRating?: string;
            catvfrRating?: string;
            cbfcRating?: string;
            cccRating?: string;
            cceRating?: string;
            chfilmRating?: string;
            chvrsRating?: string;
            cicfRating?: string;
            cnaRating?: string;
            cncRating?: string;
            csaRating?: string;
            cscfRating?: string;
            czfilmRating?: string;
            djctqRating?: string;
            djctqRatingReasons?: Array<string>;
            ecbmctRating?: string;
            eefilmRating?: string;
            egfilmRating?: string;
            eirinRating?: string;
            fcbmRating?: string;
            fcoRating?: string;
            fmocRating?: string;
            fpbRating?: string;
            fpbRatingReasons?: Array<string>;
            fskRating?: string;
            grfilmRating?: string;
            icaaRating?: string;
            ifcoRating?: string;
            ilfilmRating?: string;
            incaaRating?: string;
            kfcbRating?: string;
            kijkwijzerRating?: string;
            kmrbRating?: string;
            lsfRating?: string;
            mccaaRating?: string;
            mccypRating?: string;
            mcstRating?: string;
            mdaRating?: string;
            medietilsynetRating?: string;
            mekuRating?: string;
            mibacRating?: string;
            mocRating?: string;
            moctwRating?: string;
            mpaaRating?: string;
            mpaatRating?: string;
            mtrcbRating?: string;
            nbcRating?: string;
            nbcplRating?: string;
            nfrcRating?: string;
            nfvcbRating?: string;
            nkclvRating?: string;
            oflcRating?: string;
            pefilmRating?: string;
            rcnofRating?: string;
            resorteviolenciaRating?: string;
            rtcRating?: string;
            rteRating?: string;
            russiaRating?: string;
            skfilmRating?: string;
            smaisRating?: string;
            smsaRating?: string;
            tvpgRating?: string;
            ytRating?: string;
        };
        projection: string;
        hasCustomThumbnail?: boolean;
    };
    status: {
        uploadStatus?: string;
        failureReason?: string;
        rejectionReason?: string;
        privacyStatus: string;
        publishAt?: string;
        license: string;
        embeddable: boolean;
        publicStatsViewable: boolean;
        madeForKids: boolean;
        selfDeclaredMadeForKids?: boolean;
    };
    statistics: {
        viewCount: string;
        likeCount: string;
        dislikeCount?: 0;
        favoriteCount: string;
        commentCount: string;
    };
    player: {
        embedHtml: string;
        embedHeight: string;
        embedWidth: string;
    };
    topicDetails: {
        topicIds?: Array<string>;
        relevantTopicIds?: Array<string>;
        topicCategories: Array<string>;
    };
    recordingDetails: {
        recordingDate?: string;
    };
    fileDetails: {
        fileName: string;
        fileSize: number;
        fileType: string;
        container: string;
        videoStreams: [
            {
                widthPixels: number;
                heightPixels: number;
                frameRateFps: number;
                aspectRatio: number;
                codec: string;
                bitrateBps: number;
                rotation: string;
                vendor: string;
            }
        ];
        audioStreams: [
            {
                channelCount: number;
                codec: string;
                bitrateBps: number;
                vendor: string;
            }
        ];
        durationMs: number;
        bitrateBps: number;
        creationTime: string;
    };
    processingDetails: {
        processingStatus: string;
        processingProgress: {
            partsTotal: number;
            partsProcessed: number;
            timeLeftMs: number;
        };
        processingFailureReason: string;
        fileDetailsAvailability: string;
        processingIssuesAvailability: string;
        tagSuggestionsAvailability: string;
        editorSuggestionsAvailability: string;
        thumbnailsAvailability: string;
    };
    suggestions: {
        processingErrors: Array<string>;
        processingWarnings: Array<string>;
        processingHints: Array<string>;
        tagSuggestions: [
            {
                tag: string;
                categoryRestricts: Array<string>;
            }
        ];
        editorSuggestions: Array<string>;
    };
    liveStreamingDetails?: {
        actualStartTime: string;
        actualEndTime: string;
        scheduledStartTime: string;
        scheduledEndTime?: string;
        concurrentViewers?: number;
        activeLiveChatId?: string;
    };
    localizations: localizations;
}

export interface VideoListDetails {
    kind: "youtube#videoListResponse";
    etag: string;
    nextPageToken: string;
    prevPageToken: string;
    pageInfo: {
        totalResults: number;
        resultsPerPage: number;
    };
    items: Array<VideoDetails>;
}
