import React, { type ReactNode, useState } from 'react'
import Typography from '@mui/material/Typography'
import Accordion, { AccordionDetails, AccordionSummary } from '../Accordion'
import ReactECharts from 'echarts-for-react'
import { AskVideo, AskWorldMap, AskWorldPopulation } from '../helper/ask'
import CenterThings from '../centerThings'
import { ECElementEvent, registerMap} from 'echarts'

import type {
  TitleComponentOption,
  TooltipComponentOption,
  ToolboxComponentOption
} from 'echarts/components'
import type {
  // The series option types are defined with the SeriesOption suffix
  // PieSeriesOption,
  MapSeriesOption
} from 'echarts/charts'
import type {
  ComposeOption
} from 'echarts/core'
import { Button } from '@mui/material'
// import { CommentThread } from '../types/Comments'

const loadingOption = {
  text: 'Please wait, Loading',
  color: 'rgba(256, 105, 0, 0.69)',
  textColor: 'white',
  maskColor: 'grey',
  zlevel: 0
}

type composed = ComposeOption<
  MapSeriesOption |
  TitleComponentOption |
  TooltipComponentOption |
  ToolboxComponentOption
  >

function ComparedToWorld (props: { isLoading: boolean, viewCount: number }): ReactNode {
  const { data, error, isLoading: isMapLoading } = AskWorldMap('world')
  const [chartOptions, setChartOption] =  useState<undefined | {selected?: string, center?: number[], zoom?: number}>();
  const { data: population, error: errorForPopulation, isLoading: fetchingPopulation } = AskWorldPopulation(chartOptions?.selected)
  
  
  if (data && population?.details?.count) {
    registerMap('world', data)
  } else {
    if (isMapLoading || props.isLoading || fetchingPopulation) { return <ReactECharts loadingOption={loadingOption} showLoading={true} option={{}}></ReactECharts> }
    const errorFound = error ?? errorForPopulation ?? (
      <>
      <Typography variant="subtitle2">
        {`Sorry couldn't fetch the population for the country: ${chartOptions?.selected ?? "Unknown Country"}, Please report this issue or request it in`}
        &nbsp;<a href="https://rapidapi.com/evikza/api/get-population" target="_blank">here.</a>
      </Typography>
      <br/>
      <Button variant="outlined" onClick={() => {setChartOption({...chartOptions, selected: undefined})}}>
        Reset
      </Button>
      </>
    )
    return (
      <>
      <Typography>
        {errorFound}
    </Typography>
    </>
    )
  }

  const selectedMap: Record<string, boolean>  = {};
  if(chartOptions?.selected){
    selectedMap[chartOptions.selected] = true
  }

  const country = chartOptions?.selected;
  const getTitle = () => {
    const percent = (props.viewCount / Number(population.details?.count) * 1e2)
    return `${percent <= 1e2 ? percent.toPrecision(2) : (percent / 1e2).toPrecision(2) + "k"}% of ${country ? `${country}'s` : 'world\'s'} population`
  }

  // palette: https://colorhunt.co/palette/404258474e6850577a6b728e
  // https://colorhunt.co/palette/0b244719376d576cbca5d7e8
  // https://colorhunt.co/palette/1a374d4068826998abb1d0e0
  const backgroundColor = '#6998AB'
  const landColor = "#406882"
  const textColor = '#114E60'

  const options: composed = {
    title: {
      text: getTitle(),
      subtext: country ? undefined : 'Select a country',
      left: 'center',
      top: 'top',
      textStyle: { color: textColor },
      subtextStyle: { fontSize: 13, color: '#4E3620', fontStyle: "italic" }
    },
    tooltip: {
      backgroundColor: "#404258", textStyle: {color: "#fff"},
    },
    backgroundColor,
    series: [
      {
        selectedMap,
        zoom: chartOptions?.zoom ?? 1,
        center: chartOptions?.center,
        name: 'World',
        type: 'map',
        map: 'world',
        roam: true,
        itemStyle: {
          areaColor: landColor
        },
        select: {
          itemStyle: {
            areaColor: '#30475E',
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            shadowBlur: 3
          },
          label: {
            color: "lightgreen",
            fontWeight: 'bold',
            fontSize: 12,
          }
        },
        emphasis: {
          itemStyle: {
            areaColor: '#1A374D',
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            shadowBlur: 6
          },
          label: {
            fontWeight: 'bold',
            fontSize: 12,
            color: "#E16428"
          }
        }
      }
    ]
  }

    function handleCountrySelection (
        event: ECElementEvent,
        eChartInstance: {getOption: () => {series: [{center: number[], zoom: number}]}}
    ): void {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const selected = data?.features[event.fromActionPayload.dataIndexInside].properties.name;
      if(!population?.details?.count || !selected) return;
      const series = eChartInstance.getOption().series.at(0);
      
      setChartOption(
        {
          selected: selected === chartOptions?.selected ? undefined : selected,
          center: series?.center,
          zoom: series?.zoom
        }
      )
    }

  return <ReactECharts
        theme={'vintage'}
        showLoading={props.isLoading || isMapLoading || fetchingPopulation}
        loadingOption={loadingOption}
        option={options}
        onEvents={{
          selectchanged: handleCountrySelection
        }}
        />
}

// function EmojisFound(props: {commentThreads: CommentThread[]}): ReactNode{
//   props.commentThreads.flatMap(thread => {
//     const text = thread.snippet.topLevelComment.snippet.textDisplay
//     return text
//   })
//   return <></>;
// }

export default function VideoDetailedGraphsComponent (props: { videoID: string }): ReactNode {
  const { data, error, isLoading } = AskVideo(props.videoID)
  // const {data: threads, error: errorsFromThreads, isLoading: fetchingComments} = AskCommentThreads(props.videoID)
  const [expand, setExpand] = useState<false | string>(false)

  if (!isLoading && (data?.details === undefined || error)) {
    return <CenterThings>{`Failed to fetch the details: ${error ?? 'empty values :('}`}</CenterThings>
  }

  const _ids = [
    'world-wide',
    // 'emojis-found'
  ]

  const videoDetails = data?.details?.items[0]
  const summary = [
    <Typography key={_ids[0]}>View Count</Typography>,
    <Typography key={_ids[1]}>User&#39;s Contribution</Typography>
  ]

  // const commentThreads = threads?.at(0);

  const details = [
    <ComparedToWorld key={_ids[0]} isLoading={isLoading} viewCount={Number(videoDetails?.statistics.viewCount)}/>,
    // <EmojisFound key={_ids[1]} commentThreads={commentThreads?.details?.items ?? []}/>
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
