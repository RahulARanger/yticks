import { type Comment } from './Comments'
import { type AskForLanguage } from './askForNLP'

export interface CommentSharedProps {
  videoID: string
}

export interface CommentProps extends CommentSharedProps {
  formatter: Intl.NumberFormat
  className?: string
  sortingOption?: string
}

export interface RequestForMoreDetails {
  details: Comment
  results: AskForLanguage | undefined
}


export type sendComment = (
  // eslint-disable-next-line no-unused-vars
  comment: Comment,
  // eslint-disable-next-line no-unused-vars
  replyCount: number,
  // eslint-disable-next-line no-unused-vars
  replies?: Comment[]
) => void

export const commentSortingOptions = ['Sort by Relevance', 'Sort by Date', 'Most Likes', 'More Replies', 'Recently Updated']
