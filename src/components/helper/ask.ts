import { urlWithArgs, askButRead } from './generalRequest'
import useSWRImmutable from 'swr/immutable'
import useSWRInfinite from 'swr/infinite'
import type { ExpectedVideoDetails } from '../types/Video'
import {
  type ExpectedPlaylist,
  type ExpectedPlaylistItems
} from '@/components/types/playlist'
import { type ExpectedCommentThread } from '../types/Comments'
import { type ExpectedPopulation } from '../types/populationResponse'

const isMock = process.env.NEXT_PUBLIC_IS_DEV ? 'mock' : 'data'

interface SWRResponse<Details> {
  data?: Details
  error?: string
  isLoading: boolean
}

export function AskVideo (
  videoID: string | null,
  width?: string,
  height?: string
): SWRResponse<ExpectedVideoDetails> {
  return useSWRImmutable(
    videoID
      ? urlWithArgs(`/api/${isMock}/videoById`, {
        maxWidth: width ?? '730',
        maxHeight: height ?? '400',
        videoID
      })
      : '',
    async (url: string) => await askButRead<ExpectedVideoDetails>(url)
  )
}

function loadComments (
  videoID: string,
  _: number,
  prevCommentThread?: ExpectedCommentThread
): string {
  const details = prevCommentThread?.details
  const token = details?.nextPageToken
  return urlWithArgs(`/api/${isMock}/commentThreads`, {
    videoID,
    pageToken: token ?? ''
  })
}

interface SWRInfResponse<Details> {
  data: Details[] | undefined
  error?: string
  isLoading: boolean
  size: number
  // eslint-disable-next-line no-unused-vars
  setSize: (page: number) => void
}

export function AskCommentThreads (
  videoID: string
): SWRInfResponse<ExpectedCommentThread> {
  return useSWRInfinite(
    (...args: [index: number, previousPageData?: ExpectedCommentThread ]) => loadComments(videoID, ...args),
    async (url: string) => await askButRead<ExpectedCommentThread>(url),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateFirstPage: false,
      revalidateAll: false
    }
  )
}

export function AskPlayList (
  listID: string | null
): SWRResponse<ExpectedPlaylist> {
  return useSWRImmutable(
    listID
      ? urlWithArgs(`/api/${isMock}/playList`, {
        listID
      })
      : null,
    async (url: string) => await askButRead<ExpectedPlaylist>(url)
  )
}

export function AskPlayListItems (
  listID: string | null
): SWRResponse<ExpectedPlaylistItems> {
  return useSWRImmutable(
    listID
      ? urlWithArgs(`/api/${isMock}/playlistItems`, {
        listID
      })
      : null,
    async (url: string) => await askButRead<ExpectedPlaylistItems>(url)
  )
}

export function encodeID (videoID: string, listID: string): string {
  return `${videoID} ${listID}`
}

export function decodeID (encoded: string): [string, string] {
  console.log(encoded)
  const [videoID, listID] = encoded.split(' ')
  return [videoID, listID]
}

interface countryAsFeature {type: 'Feature', geometry: { type: 'MultiLineString', coordinates: string[], encodeOffsets: number[][] }, properties: { name: string, childNum: number }}
interface mapRespType { type: 'FeatureCollection', features: countryAsFeature[], crs: { type: string, properties: { name: string } } }

export function AskWorldMap (file: string): SWRResponse<mapRespType> {
  return useSWRImmutable(`https://cdn.jsdelivr.net/gh/apache/echarts-www@master/asset/map/json/${file}.json`,
    async (url: string) => await askButRead<mapRespType>(url)
  )
}

export function AskWorldPopulation (): SWRResponse<ExpectedPopulation> {
  return useSWRImmutable(`/api/${isMock}/population`,
    async (url: string) => await askButRead<ExpectedPopulation>(url)
  )
}
