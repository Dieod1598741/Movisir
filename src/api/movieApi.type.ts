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
    algorithmic: Movie[];  // 알고리즘 기반 추천
    popular: Movie[];      // 인기작
}

// [용도] 백엔드 API 응답 타입
export interface BackendMovieRecommendation {
    movie_id: number;
    title: string;
    runtime: number;
    genres: string[];  // 장르 이름 배열
    poster_url: string;
    vote_average: number;
    overview: string;
}

export interface BackendRecommendResponse {
    recommendations: BackendMovieRecommendation[];
    total: number;
    filters_applied: {
        runtime: number;
        genres: number[];
        include_adult: boolean;
    };
}

// [용도] 장르 매핑: 한글 이름 <-> ID
export interface GenreMapping {
    [key: string]: number;  // 예: "SF" -> 15
}
