/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { RecommendationsResponse } from "../types/Build";

const BASE_URL = process.env.NEXT_PUBLIC_ALGORITHM_PYTHON


export const fetchRecommendations = async (userVector: number[]): Promise<RecommendationsResponse> => {
    try {
      const response = await axios.post<RecommendationsResponse>(`${BASE_URL}/api/generate_recom`, {
        user_vector: userVector,
      });
  
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error ?? 'Failed to fetch recommendations');
    }
  };