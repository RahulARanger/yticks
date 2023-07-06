interface OnlyUs {
  passCode: string
}

export interface AskForSentimentForVideoComments {
  positive: number
  negative: number
  neutral: number
}

export interface DetailsNeeded extends OnlyUs {
  comments: string[]
}

export interface LanguageResult {
  label: string
  score: number
}

export type AskForLanguage = LanguageResult[]
