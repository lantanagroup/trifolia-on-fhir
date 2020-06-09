export interface SearchImplementationGuideResponse{
  data,
  published?: boolean
}

export interface SearchImplementationGuideResponseContainer{
  responses: SearchImplementationGuideResponse[],
  total?: number
}
