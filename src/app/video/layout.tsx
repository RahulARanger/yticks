import React, { type ReactNode } from 'react'
import Script from 'next/script'

export default function PyodideLayer ({ children }: { children: ReactNode }): ReactNode {
  return (
    <>
      {<Script src="https://www.youtube.com/iframe_api"></Script>}
        {<Script src="https://cdnjs.cloudflare.com/ajax/libs/echarts/5.4.2/theme/vintage.min.js"></Script>}
      {children}
    </>
  )
}
