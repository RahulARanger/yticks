import List from '@mui/material/List'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import React, { Component, type ReactNode } from 'react'
import ListSubheader from '@mui/material/ListSubheader'

export default abstract class ListArea<PROPs, STATEs> extends Component<
PROPs,
STATEs
> {
  title = '...'

  abstract header (): ReactNode
  abstract render (): ReactNode

  footer (): ReactNode {
    return <></>
  }

  renderList (listItems: ReactNode): ReactNode {
    return (
      <Paper
        elevation={3}
        sx={{ flexGrow: 1, height: '90vh', minHeight: '300px' }} // let this be constant for now when its reused we should parameterize it
      >
        <List
          sx={{
            border: '1px solid black',
            height: '100%',
            overflowY: 'scroll'
          }}
          subheader={
            this.title
              ? (
              <ListSubheader>
                <Stack
                  flexDirection={'row'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                >
                  {this.title}
                  {this.header()}
                </Stack>
              </ListSubheader>
                )
              : (
              <></>
                )
          }
        >
          {listItems}
          {this.footer()}
        </List>
      </Paper>
    )
  }
}
