// [용도] 영화 관련 API 함수 정의
// [사용법] import { getMovies, getRecommendations, addWatchHistory } from "./movieApi";

import axiosInstance from "./axiosInstance";
import type {
    Movie,
    WatchHistory,
    WatchHistoryWithMovie,
    Recommendation,
    RecommendationWithMovie,
    UserStats,
    MovieRecommendationResult,
    BackendRecommendResponse,
    BackendMovieRecommendation,
    GenreMapping
} from "./movieApi.type";

// [상수] 장르 이름 ↔ 장르 ID 매핑 (백엔드 dummy_movies.json 기준)
// 백엔드의 장르 ID와 정확히 일치해야 함
const GENRE_NAME_TO_ID: GenreMapping = {
    "액션": 1,
    "모험": 2,
    "애니메이션": 3,
    "코미디": 4,
    "범죄": 5,
    "다큐멘터리": 6,
    "드라마": 7,
    "가족": 8,
    "판타지": 9,
    "역사": 10,
    "공포": 11,
    "음악": 12,
    "미스터리": 13,
    "로맨스": 14,
    "SF": 15,
    "스릴러": 16,
    "전쟁": 17,
    "서부": 18
};

// 전체 영화 목록 조회
export const getMovies = async (): Promise<Movie[]> => {
    const response = await axiosInstance.get("/movies");

    // 백엔드 응답을 프론트엔드 Movie 타입으로 변환
    return response.data.map((movie: any) => ({
        id: movie.movie_id,
        title: movie.title,
        genres: movie.genres,
        year: movie.release_date ? new Date(movie.release_date).getFullYear() : undefined,
        rating: movie.vote_average,
        popularity: movie.popularity,
        poster: movie.poster_url,
        description: movie.overview,
        popular: false,
        watched: false
    }));
};

// 특정 영화 조회
export const getMovie = async (movieId: number): Promise<Movie> => {
    const response = await axiosInstance.get(`/movies/${movieId}`);
    const movie = response.data;

    // 백엔드 응답을 프론트엔드 Movie 타입으로 변환
    return {
        id: movie.movie_id,
        title: movie.title,
        genres: movie.genres,
        year: movie.release_date ? new Date(movie.release_date).getFullYear() : undefined,
        rating: movie.vote_average,
        popularity: movie.popularity,
        poster: movie.poster_url,
        description: movie.overview,
        popular: false,
        watched: false
    };
};
// [용도] 백엔드 API를 통한 영화 추천
// [사용법] const result = await postRecommendations({ time: "02:30", genres: ["SF", "드라마"], userId: 1, excludeAdult: true });
export const postRecommendations = async (filters: {
    time: string;      // "HH:MM" 형식
    genres: string[];  // 장르 이름 배열 ["SF", "드라마"]
    userId: number;
    excludeAdult?: boolean;  // 성인 콘텐츠 제외 여부 (기본값: false)
}): Promise<MovieRecommendationResult> => {
    try {
        // 1. 시간 변환: "02:30" -> 150분
        const [hours, minutes] = filters.time.split(':').map(Number);
        const runtime = hours * 60 + minutes;

        // 2. 장르 변환: ["SF", "드라마"] -> [15, 7]
        const genreIds = filters.genres
            .map(genreName => GENRE_NAME_TO_ID[genreName])
            .filter(id => id !== undefined);  // 매핑되지 않은 장르 제외

        // 3. 백엔드 API 호출
        const response = await axiosInstance.post<BackendRecommendResponse>("/chatbot/recommend", {
            runtime,
            genres: genreIds,
            include_adult: !filters.excludeAdult  // excludeAdult의 반대로 전달
        });

        // 4. 백엔드 응답을 프론트엔드 Movie 타입으로 변환
        const backendMovies = response.data.recommendations;

        // Movie 타입으로 변환하는 헬퍼 함수
        const convertToMovie = (backendMovie: BackendMovieRecommendation): Movie => ({
            id: backendMovie.movie_id,
            title: backendMovie.title,
            genres: backendMovie.genres,
            rating: backendMovie.vote_average,
            poster: backendMovie.poster_url,
            description: backendMovie.overview,
            popular: false,  // 백엔드에서 구분하지 않으므로 기본값
            watched: false   // 시청 여부는 별도로 관리
        })

        // 5. algorithmic과 popular로 분리
        // 백엔드가 vote_average 기준으로 정렬해서 주므로:
        // - 상위 3개: algorithmic (필터 기반 추천)
        // - 그 다음 3개: popular (인기 영화)
        const allMovies = backendMovies.map(convertToMovie);

        console.log('전체 추천 영화 개수:', allMovies.length);

        return {
            algorithmic: allMovies.slice(0, 3),  // 상위 3개
            popular: allMovies.slice(3, 6)       // 다음 3개
        };
    } catch (error) {
        console.error("영화 추천 API 호출 중 오류:", error);
        throw new Error("영화 추천을 가져오는 중 오류가 발생했습니다");
    }
};
// 사용자별 영화 추천 (알고리즘 기반 3개 + 인기작 3개)
export const getRecommendations = async (userId: number): Promise<MovieRecommendationResult> => {
    try {
        // 전체 영화 목록 가져오기
        const allMovies = await getMovies();

        // [변경 필요] 실제 백엔드에서는 보통 /users/{id}/watch-history 형태나,
        // 토큰에서 userId를 추출하여 /watch-history (내 기록) 형태로 제공하는 경우가 많습니다.
        const watchHistoryResponse = await axiosInstance.get<WatchHistory[]>(`/watchHistory?userId=${userId}`);
        const watchHistory = watchHistoryResponse.data;
        const watchedMovieIds = watchHistory.map(h => h.movieId);

        // 사용자 프로필 가져오기
        const userResponse = await axiosInstance.get(`/users/${userId}`);
        const user = userResponse.data;
        const favoriteGenres = user.profile?.favoriteGenres || [];

        // [변경 필요 - 백엔드 이관 권장]
        // 실제 프로덕션에서는 전체 영화 목록을 클라이언트로 가져와서 필터링하는 것이 비효율적입니다.
        // 백엔드에서 추천 영화를 계산하여 반환하는 API(예: GET /movies/recommendations)를 사용하는 것이 좋습니다.

        // 아직 보지 않은 영화들
        const unwatchedMovies = allMovies.filter(m => !watchedMovieIds.includes(m.id));

        // 알고리즘 기반 추천: 선호 장르 기반으로 추천
        let algorithmicRecommendations: Movie[] = [];

        if (favoriteGenres.length > 0) {
            // 선호 장르의 영화 중 평점이 높은 순으로 정렬
            algorithmicRecommendations = unwatchedMovies
                .filter(m => favoriteGenres.some((g: string) => m.genres.includes(g)))
                .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                .slice(0, 3);
        }

        // 선호 장르 영화가 3개 미만이면 평점 높은 영화로 채우기
        if (algorithmicRecommendations.length < 3) {
            const remaining = unwatchedMovies
                .filter(m => !algorithmicRecommendations.includes(m))
                .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                .slice(0, 3 - algorithmicRecommendations.length);

            algorithmicRecommendations = [...algorithmicRecommendations, ...remaining];
        }

        // 인기작 추천: 인기도가 높은 순으로 정렬 (이미 추천된 영화 제외)
        const popularRecommendations = unwatchedMovies
            .filter(m => !algorithmicRecommendations.includes(m))
            .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
            .slice(0, 3);

        // [변경 필요] 백엔드 이관 강력 권장
        // 현재는 프론트엔드에서 모든 영화와 시청 기록을 가져와서 필터링하고 있습니다.
        // 실제 운영 환경에서는 데이터 양이 많아지면 성능 문제가 발생합니다.
        // 백엔드에서 추천 결과를 계산해서 반환하는 API(예: GET /movies/recommendations)를 만들어 호출하세요.
        // 
        // 예시 코드:
        // const response = await axiosInstance.get("/movies/recommendations");
        // return response.data;

        return {
            algorithmic: algorithmicRecommendations,
            popular: popularRecommendations
        };
    } catch (error) {
        console.error("영화 추천 중 오류:", error);
        throw new Error("영화 추천을 가져오는 중 오류가 발생했습니다");
    }
};

// 추천 기록 추가
export const addRecommendation = async (
    userId: number,
    movieId: number,
    reason: string
): Promise<Recommendation> => {
    const newRecommendation = {
        userId,
        movieId,
        recommendedAt: new Date().toISOString(),
        reason
    };

    const response = await axiosInstance.post<Recommendation>("/recommendations", newRecommendation);
    return response.data;
};

// 사용자별 시청 기록 조회 (영화 정보 포함)
export const getWatchHistory = async (userId: number): Promise<WatchHistoryWithMovie[]> => {
    try {
        const response = await axiosInstance.get<WatchHistory[]>(`/watchHistory?userId=${userId}`);
        const watchHistory = response.data;

        // 각 시청 기록에 영화 정보 추가
        const historyWithMovies = await Promise.all(
            watchHistory.map(async (history) => {
                const movie = await getMovie(history.movieId);
                return {
                    ...history,
                    movie
                };
            })
        );

        // 최신순으로 정렬
        return historyWithMovies.sort((a, b) =>
            new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime()
        );
    } catch (error) {
        console.error("시청 기록 조회 중 오류:", error);
        throw new Error("시청 기록을 가져오는 중 오류가 발생했습니다");
    }
};

// 시청 기록 추가
export const addWatchHistory = async (
    userId: number,
    movieId: number,
    rating: number
): Promise<WatchHistory> => {
    const newHistory = {
        userId,
        movieId,
        watchedAt: new Date().toISOString(),
        rating
    };

    const response = await axiosInstance.post<WatchHistory>("/watchHistory", newHistory);
    return response.data;
};

// 사용자 통계 조회
export const getUserStats = async (userId: number): Promise<UserStats> => {
    try {
        const watchHistory = await getWatchHistory(userId);

        if (watchHistory.length === 0) {
            return {
                totalWatched: 0,
                averageRating: 0,
                favoriteGenre: "없음",
                watchedByGenre: {}
            };
        }

        // 총 시청 횟수
        const totalWatched = watchHistory.length;

        // 평균 평점
        const averageRating = watchHistory.reduce((sum, h) => sum + h.rating, 0) / totalWatched;

        // 장르별 시청 횟수
        const watchedByGenre: { [genre: string]: number } = {};
        watchHistory.forEach(h => {
            const genres = h.movie.genres;
            genres.forEach(genre => {
                watchedByGenre[genre] = (watchedByGenre[genre] || 0) + 1;
            });
        });

        // 가장 많이 본 장르
        const favoriteGenre = Object.entries(watchedByGenre)
            .sort(([, a], [, b]) => b - a)[0]?.[0] || "없음";

        // [변경 필요] 백엔드 이관 권장
        // 통계 계산 로직도 백엔드로 옮기는 것이 좋습니다. (GET /users/stats)
        return {
            totalWatched,
            averageRating: Math.round(averageRating * 10) / 10,
            favoriteGenre,
            watchedByGenre
        };
    } catch (error) {
        console.error("사용자 통계 조회 중 오류:", error);
        throw new Error("사용자 통계를 가져오는 중 오류가 발생했습니다");
    }
};

// 사용자별 추천 기록 조회 (영화 정보 포함)
export const getUserRecommendations = async (userId: number): Promise<RecommendationWithMovie[]> => {
    try {
        const response = await axiosInstance.get<Recommendation[]>(`/recommendations?userId=${userId}`);
        const recommendations = response.data;

        // 각 추천에 영화 정보 추가
        const recommendationsWithMovies = await Promise.all(
            recommendations.map(async (rec) => {
                const movie = await getMovie(rec.movieId);
                return {
                    ...rec,
                    movie
                };
            })
        );

        // 최신순으로 정렬
        return recommendationsWithMovies.sort((a, b) =>
            new Date(b.recommendedAt).getTime() - new Date(a.recommendedAt).getTime()
        );
    } catch (error) {
        console.error("추천 기록 조회 중 오류:", error);
        throw new Error("추천 기록을 가져오는 중 오류가 발생했습니다");
    }
};
