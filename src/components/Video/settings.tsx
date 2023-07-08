import Drawer from '@mui/material/Drawer'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import React, { Component, type ReactNode } from 'react'
import Radio from '@mui/material/Radio'

export interface VideoSettings {
  searchMode?: string
}

export interface SettingsProps {
  open: boolean
  onClose: () => void
}

export default class Settings extends Component<SettingsProps> {
  safeSearch (): ReactNode {
    return (
      <>
        <FormLabel id="safe-search">Safe Search</FormLabel>
        <RadioGroup
          row
          aria-labelledby="safe-search"
          name="search-by-selection"
        >
          <FormControlLabel value="none" control={<Radio />} label="None" />
          <FormControlLabel
            value="moderate"
            control={<Radio />}
            label="Moderate"
          />
          <FormControlLabel value="strict" control={<Radio />} label="Strict" />
        </RadioGroup>
      </>
    )
  }

  render (): ReactNode {
    return (
      <Drawer
        variant="temporary"
        open={this.props.open}
        onClose={() => { this.props.onClose() }}
        placeholder="Settings"
        ModalProps={{ sx: { p: '4px' } }}
      >
        <FormControl>{this.safeSearch()}</FormControl>
      </Drawer>
    )
  }
}
