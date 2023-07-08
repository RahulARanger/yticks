import React, { type ReactNode, useState } from 'react'
import Typography from '@mui/material/Typography'
import Accordion, { AccordionDetails, AccordionSummary } from '../Accordion'
import ReactECharts from 'echarts-for-react'
import { AskVideo, AskWorldMap, AskWorldPopulation } from '../helper/ask'
import CenterThings from '../centerThings'
import { registerMap } from 'echarts'

import type {
  TitleComponentOption,
  TooltipComponentOption,
  ToolboxComponentOption
} from 'echarts/components'
import type {
  // The series option types are defined with the SeriesOption suffix
  FunnelSeriesOption,
  MapSeriesOption
} from 'echarts/charts'
import type {
  ComposeOption
} from 'echarts/core'

const loadingOption = {
  text: 'Please wait, Loading',
  color: 'rgba(256, 105, 0, 0.69)',
  textColor: 'white',
  maskColor: 'grey',
  zlevel: 0
}

function ComparedToWorld (props: { isLoading: boolean, viewCount: number }): ReactNode {
  const { data, error, isLoading: isMapLoading } = AskWorldMap('world')
  const { data: population, error: errorForPopulation, isLoading: fetchingPopulation } = AskWorldPopulation()
  const [country] = useState<undefined | string>()

  if (data && population?.details) {
    registerMap('world', data)
  } else {
    if (isMapLoading || props.isLoading || fetchingPopulation) { return <ReactECharts loadingOption={loadingOption} showLoading={true} option={{}}></ReactECharts> }
    return <CenterThings>{error ?? errorForPopulation}</CenterThings>
  }

  const options: ComposeOption<
  MapSeriesOption |
  TitleComponentOption |
  TooltipComponentOption |
  ToolboxComponentOption
  > = {
    title: {
      text: `${(props.viewCount / population.details.count * 1e2).toPrecision(2)}% of ${country ? `${country}'s` : 'world\'s'} population `,
      //   subtext: country ? `selected: ${country}` : 'Select a country',
      left: 'center',
      top: 'top',
      textStyle: { color: 'black    ' },
      subtextStyle: { fontSize: 13, color: 'black' }
    },
    backgroundColor: '#ADD8E6',
    series: [
      {
        name: 'World',
        type: 'map',
        map: 'world',
        roam: true,
        itemStyle: {
          areaColor: 'turquoise'
        },
        select: {
          itemStyle: {
            areaColor: 'lightgreen'
          },
          label: {
            color: 'black'
          }
        },
        emphasis: {
          itemStyle: {
            areaColor: 'white',
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            shadowBlur: 6
          },
          label: {
            color: 'orangered',
            fontWeight: 'bold',
            fontSize: 12
          }
        }
      }
    ]
  }

  //   function handleCountrySelection (event: ECElementEvent): void {
  //     setCountry(data?.features[event.fromActionPayload.dataIndexInside].properties.name)
  //   }

  return <ReactECharts
        theme={'vintage'}
        showLoading={props.isLoading || isMapLoading || fetchingPopulation}
        loadingOption={loadingOption}
        option={options}
        // TODO: Complete the Selection of the Country
        // onEvents={{
        //   selectchanged: handleCountrySelection
        // }}
        />
}

function userContribution (isLoading: boolean, countOfComments: number, likeCount: number): ReactNode {
  const options: ComposeOption<
  FunnelSeriesOption |
  TitleComponentOption |
  TooltipComponentOption
  > = {
    title: {
      text: 'User\'s Contribution',
      subtext: 'Likes & no. of comments',
      textStyle: {
        color: 'white'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c}%'
    },
    toolbox: {
      feature: {
        dataView: { readOnly: false },
        restore: {},
        saveAsImage: {}
      }
    },
    legend: {
      show: false
    },
    series: [
      {
        name: 'Funnel',
        type: 'funnel',
        left: '10%',
        top: 60,
        width: '80%',
        minSize: '0%',
        maxSize: '100%',
        sort: 'descending',
        gap: 2,
        label: {
          show: true,
          position: 'inside'
        },
        emphasis: {
          label: {
            fontSize: 20
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 1
          }
        },
        data: [
          { value: 1e2 * countOfComments / likeCount, name: 'Comments' },
          { value: 1e2, name: 'Likes' }
        ]
      }
    ]
  }

  return <ReactECharts theme={'vintage'} option={options} showLoading={isLoading} loadingOption={loadingOption}></ReactECharts>
}

export default function VideoDetailedGraphsComponent (props: { videoID: string }): ReactNode {
  const { data, error, isLoading } = AskVideo(props.videoID)
  const [expand, setExpand] = useState<false | string>(false)

  if (!isLoading && (data?.details === undefined || error)) {
    return <CenterThings>{`Failed to fetch the details: ${error ?? 'empty values :('}`}</CenterThings>
  }

  const _ids = [
    'world-wide',
    'engagement-types'
  ]

  const videoDetails = data?.details?.items[0]
  const summary = [
    <Typography key={_ids[0]}>View Count</Typography>,
    <Typography key={_ids[1]}>User&#39;s Contribution</Typography>
  ]

  const details = [
    <ComparedToWorld key={_ids[0]} isLoading={isLoading} viewCount={Number(videoDetails?.statistics.viewCount)}/>,
    userContribution(
      isLoading,
      Number(videoDetails?.statistics.commentCount),
      Number(videoDetails?.statistics.likeCount)
    )
  ]

  return (
    <>
        {_ids.map((_id, index) => {
          return <Accordion key={_id} expanded={expand === _ids[index]} onChange={() => { setExpand(expand !== _ids[index] ? _ids[index] : false) }}>
            <AccordionSummary>
                {summary[index]}
            </AccordionSummary>
            <AccordionDetails>
                {details[index]}
            </AccordionDetails>
        </Accordion>
        })}
     </>
  )
}
