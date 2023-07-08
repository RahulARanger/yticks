import { type ExpectedDetails } from './response'

export default interface PopulationResponse {
  count: number
  readable_format: string
}

export type ExpectedPopulation = ExpectedDetails<PopulationResponse>
