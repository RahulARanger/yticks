interface OnlyUs {
    passCode: string
}

export interface AskForSentimentForVideoComments {
    positive: number, negative: number, neutral: number
}

export interface DetailsNeeded extends OnlyUs {
    comments: Array<string>
}


