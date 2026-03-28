export type Traits = {
  openness: number
  conscientiousness: number
  extraversion: number
  agreeableness: number
  neuroticism: number
}

export type AnalyzeResponse = {
  sentiment: number
  traits: Traits
}

export type TimelinePoint = {
  created_at: string
  sentiment: number
  traits: Traits
}

export type TimelineResponse = {
  items: TimelinePoint[]
}

