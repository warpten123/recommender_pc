export interface BuildSpecs {
  case: string;
  cooling: string;
  cpu: string;
  gpu: string;
  motherboard: string;
  psu: string;
  ram: string;
  storage: string;
}

export interface BuildRecommendation {
  build_index: string;
  build_price: number;
  build_specs: BuildSpecs;
  similarity: number;
}

export interface RecommendationsResponse {
  recommendations: {
    result: BuildRecommendation[];
  };
}
