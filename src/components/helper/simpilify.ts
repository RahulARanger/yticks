import dayjs from 'dayjs'
import { type thumbNail } from '../types/Video'

export function extractNeeded (originalText: string): string {
  const text = originalText.replace(/[^a-zA-Z\s]/g, '') // we do not need symbols, punctuations for detecting the language
  return text.slice(0, 100) // first 100 words only...
}

export function formatDateTime (dateTime: string): string {
  return dayjs(dateTime).format('MMMM D, YYYY h:mm A')
}

export function truncateText (text: string, limit: number): string {
  const length = text.length
  return length <= limit ? text : text.slice(0, limit - 10) + '...'
}

export function extractThumbnail (thumbnail: thumbNail): { url: string, width: number, height: number } {
  if (thumbnail.maxres) return thumbnail.maxres
  if (thumbnail.high) return thumbnail.high
  if (thumbnail.standard) return thumbnail.standard
  if (thumbnail.medium) return thumbnail.medium
  return thumbnail.default
}
