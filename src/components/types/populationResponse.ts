import { type ExpectedDetails } from './response'

export default interface PopulationResponse {
  count: number
  readable_format: string
  country?: string
}

export type ExpectedPopulation = ExpectedDetails<PopulationResponse>
