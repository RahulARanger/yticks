import { askRapidAPI, letThemKnow, sendError } from '@/components/helper/generalRequest'
import type PopulationResponse from '@/components/types/populationResponse'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET (request: NextRequest): Promise<NextResponse> {
  const { countryRequested } = Object.fromEntries(
    new URL(request.url).searchParams.entries()
  )

  try {
    const resp = await askRapidAPI<PopulationResponse>(
      countryRequested ? `https://get-population.p.rapidapi.com/population/country?country=${countryRequested}` : 'https://get-population.p.rapidapi.com/population'
    )
    return NextResponse.json({ failed: false, details: resp })
  } catch (error) {
    return letThemKnow(
      sendError(
        error,
        'Failed to fetch the world\'s population'
      )
    )
  }
}
