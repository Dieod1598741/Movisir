// [용도] 영화 관련 API 타입 정의
// [사용법] import { Movie, WatchHistory, Recommendation } from "./movieApi.type";

export interface Movie {
    id: number;
    title: string;
    genres: string[];
    year?: number;
    rating?: number;
    popularity?: number;
    poster: string;
    description: string;
    popular: boolean;
    watched?: boolean;
}

export interface WatchHistory {
    id: number;
    userId: number;
    movieId: number;
    watchedAt: string;
    rating: number;
}

export interface WatchHistoryWithMovie extends WatchHistory {
    movie: Movie;
}

export interface Recommendation {
    id: number;
    userId: number;
    movieId: number;
    recommendedAt: string;
    reason: string;
}

export interface RecommendationWithMovie extends Recommendation {
    movie: Movie;
}

export interface UserStats {
    totalWatched: number;
    averageRating: number;
    favoriteGenre: string;
    watchedByGenre: { [genre: string]: number };
}

export interface MovieRecommendationResult {
    algorithmic: Movie[];  // 알고리즘 기반 추천 3개
    popular: Movie[];      // 인기작 3개
}
