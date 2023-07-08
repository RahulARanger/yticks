import { NextResponse } from 'next/server'
import { type ExpectedDetails } from '../types/response'

type askArgs = Record<string, string>

export function urlWithArgs (url: string, args: askArgs): string {
  const patchedURL = new URLSearchParams()

  for (const key of Object.keys(args)) {
    patchedURL.set(key, args[key])
  }
  return url + '?' + decodeURIComponent(patchedURL.toString())
}

export default async function ask (
  url: string,
  args: askArgs
): Promise<Response> {
  if (!process.env.API_KEY) throw new Error('Missing API Key')
  return await fetch(urlWithArgs(url, { key: process.env.API_KEY, ...args }))
}

export async function requestFromUser (
  url: string,
  args: askArgs
): Promise<Response> {
  return await fetch(urlWithArgs(url, args))
}

async function ensure (url: string, response: Response): Promise<void> {
  if (response.ok) return

  let resp
  try {
    resp = await response.json()
  } catch (error) {
    throw new Error(
      `Failed to request url: ${url} because, ${response.statusText}`
    )
  }
  if (resp?.failed) throw new Error(resp?.failed)
  throw new Error(
    `Unknown Error, please note the steps and let me know || ${response.statusText} - ${url}`
  )
}

export async function askButRead<ExpectedResponse> (
  url: string
): Promise<ExpectedResponse> {
  return await fetch(url).then(async function (response) {
    await ensure(url, response)
    return await response.json()
  })
}

export function letThemKnow (
  error: string
): NextResponse<ExpectedDetails<undefined>> {
  return NextResponse.json(
    { failed: error, details: undefined },
    { status: 502 }
  )
}

export function sendError (actualError: unknown, fallbackError: string): string {
  const safeError = String(actualError).replace(
    process.env.API_KEY ?? '_KEY_',
    '_KEY_'
  )
  return safeError ?? fallbackError
}

export async function askRapidAPI<ExpectedResponse> (url: string): Promise<ExpectedResponse> {
  const headers = {
    'X-RapidAPI-Key': process.env.RAPID_API_KEY ?? '',
    'X-RapidAPI-Host': 'get-population.p.rapidapi.com'
  }

  return await fetch(url, { headers }).then(async function (response) {
    await ensure(url, response)
    return await response.json()
  })
}
