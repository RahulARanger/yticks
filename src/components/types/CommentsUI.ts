import { type Comment } from './Comments'
import { type AskForLanguage } from './askForNLP'

export interface CommentSharedProps {
  videoID: string
}

export interface CommentProps extends CommentSharedProps {
  formatter: Intl.NumberFormat
  className?: string
}

export interface RequestForMoreDetails {
  details: Comment
  results: AskForLanguage | undefined
}

export type sendComment = (
  comment: Comment,
  replyCount: number,
  replies?: Comment[]
) => void
