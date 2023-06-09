import { commentSortingOptions, type CommentProps } from '../types/CommentsUI'
import { AskCommentThreads } from '../helper/ask'
import { type Comment, type CommentThread } from '../types/Comments'
import React, { type ReactNode, useRef, useState } from 'react'
import CommentItem from './commentItem'
import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import List from '@mui/material/List'
import DialogTitle from '@mui/material/DialogTitle'
import CloseIcon from '@mui/icons-material/Close'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import { Typography } from '@mui/material'
import ListSubHeader from '@mui/material/ListSubheader'
import { CountOfComments } from './miniComponents'

interface selectedCommentDetails {
  main: Comment
  replies?: Comment[]
  replyCount: number
}

function ShowMoreReplies (props: {
  details?: selectedCommentDetails
  opened: boolean
  closeModal: () => void
  formatter: Intl.NumberFormat
}): ReactNode {
  const comments = props.details?.replies ?? []

  return (
    <Dialog
      open={props.opened}
      title="Replies"
      onClose={props.closeModal}
      sx={{ maxwidth: '500px' }}
      PaperProps={{
        elevation: 1
      }}
      disableScrollLock={true}
    >
      <DialogTitle sx={{ p: 1.5 }}>
        <Stack
          justifyContent={'space-between'}
          direction="row"
          alignItems={'center'}
        >
          {props.details?.main
            ? (
            <Paper elevation={5} sx={{ width: '100%' }}>
              <CommentItem
                comment={props.details.main}
                formatter={props.formatter}
                key={`_M_${props.details.main.id}`}
                replyCount={0}
              />
            </Paper>
              )
            : (
            <></>
              )}
          &nbsp;
          <IconButton onClick={props.closeModal}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ p: 1.5 }}>
        <Paper elevation={4}>
          <List
            subheader={
              <ListSubHeader sx={{ p: '9px' }}>
                <Stack justifyContent={'space-between'} direction="row">
                  <Typography>Replies</Typography>
                  <CountOfComments
                    formatter={props.formatter}
                    count={Number(props.details?.replyCount)}
                  />
                </Stack>
              </ListSubHeader>
            }
          >
            {comments.map((comment: Comment) => {
              return (
                <CommentItem
                  comment={comment}
                  key={comment.id}
                  formatter={props.formatter}
                  replyCount={0}
                />
              )
            })}
          </List>
        </Paper>
      </DialogContent>
    </Dialog>
  )
}

export default function CommentListItems (props: CommentProps): ReactNode {
  const { data, error, isLoading } = AskCommentThreads(props.videoID)
  const [isOpened, setOpened] = useState<boolean>(false)
  const selectedComment = useRef<undefined | selectedCommentDetails>()

  const closeModal = (): void => {
    setOpened(false)
  }
  function getReplies (
    comment: Comment,
    replyCount: number,
    replies?: Comment[]
  ): void {
    selectedComment.current = { main: comment, replies, replyCount }
    setOpened(true)
  }

  if (data?.length && data.at(-1)?.details) {
    const expectedThreads = data.flatMap((commentThread) =>
      commentThread.details ? commentThread.details.items : []
    ).sort((firstComment, secondComment) => {
      switch (props.sortingOption) {
        case commentSortingOptions[0]: return 0
        case commentSortingOptions[1]: return firstComment.snippet.topLevelComment.snippet.publishedAt > secondComment.snippet.topLevelComment.snippet.publishedAt ? -1 : 1
        case commentSortingOptions[2]: return firstComment.snippet.topLevelComment.snippet.likeCount > secondComment.snippet.topLevelComment.snippet.likeCount ? -1 : 1
        case commentSortingOptions[3]: return firstComment.snippet.totalReplyCount > secondComment.snippet.totalReplyCount ? -1 : 1
        case commentSortingOptions[4]: return firstComment.snippet.topLevelComment.snippet.publishedAt > secondComment.snippet.topLevelComment.snippet.publishedAt ? -1 : 1
        default: return 0
      }
    })

    if (expectedThreads.length) {
      return (
        <>
          {expectedThreads.map((commentThread: CommentThread) => {
            return (
              <CommentItem
                comment={commentThread.snippet.topLevelComment}
                key={commentThread.id}
                formatter={props.formatter}
                getReplies={getReplies}
                replies={commentThread.replies?.comments}
                replyCount={commentThread.snippet.totalReplyCount}
              />
            )
          })}
          <ShowMoreReplies
            opened={isOpened}
            closeModal={closeModal}
            details={selectedComment.current}
            formatter={props.formatter}
          />
        </>
      )
    } else {
      return <span key={0}>No Comments Found</span>
    }
  }

  return (
    <Stack
      justifyContent={'center'}
      alignItems="center"
      sx={{ height: '100%' }}
      key={0}
    >
      {isLoading
        ? (
        <span>Loading...</span>
          )
        : (
        <Alert title="Error" severity="error" color="error">
          <div
            dangerouslySetInnerHTML={{
              __html:
                data?.at(-1)?.failed ??
                (String(error) || 'Failed to fetch the required comments')
            }}
          ></div>
        </Alert>
          )}
    </Stack>
  )
}
