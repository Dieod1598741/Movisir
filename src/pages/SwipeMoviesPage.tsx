// [용도] 장르 선호도 스와이프 페이지
// [사용법] /onboarding/swipe 라우트에서 사용

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboardingStore } from "../store/onboardingStore";
import { fetchOnboardingMovies } from "../api/onboardingApi";
import type { OnboardingMovie } from "../api/onboardingApi.type";

// NOTE: react-tinder-card는 설치 후 사용 가능
// import TinderCard from "react-tinder-card";
// 임시로 간단한 스와이프 구현을 사용합니다

export default function SwipeMoviesPage() {
    const navigate = useNavigate();
    const { addSwipe, computeVector, setSkipped } = useOnboardingStore();

    const [movies, setMovies] = useState<OnboardingMovie[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);

    // 영화 데이터 로드
    useEffect(() => {
        const loadMovies = async () => {
            try {
                const data = await fetchOnboardingMovies(10);
                setMovies(data);
            } catch (err: any) {
                setError(err.message || "영화를 불러오는 중 오류가 발생했습니다");
            } finally {
                setIsLoading(false);
            }
        };

        loadMovies();
    }, []);

    // 스와이프 처리
    const handleSwipe = (direction: "left" | "right") => {
        if (currentIndex >= movies.length) return;

        const movie = movies[currentIndex];
        const liked = direction === "right";

        // 애니메이션
        setSwipeDirection(direction);

        setTimeout(() => {
            // 각 장르에 대해 addSwipe 호출
            movie.genres.forEach((genre) => {
                addSwipe(genre, liked);
            });

            const nextIndex = currentIndex + 1;

            if (nextIndex >= movies.length) {
                // 모든 카드 완료
                computeVector();
                navigate("/onboarding/complete");
            } else {
                setCurrentIndex(nextIndex);
                setSwipeDirection(null);
            }
        }, 300);
    };

    const handleSkipSurvey = () => {
        setSkipped(true);
        navigate("/onboarding/complete");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
                <div className="text-white text-2xl">로딩 중...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
                <div className="text-center">
                    <p className="text-red-500 text-xl mb-4">{error}</p>
                    <button
                        onClick={() => navigate("/onboarding/ott")}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg"
                    >
                        이전 단계로
                    </button>
                </div>
            </div>
        );
    }

    const currentMovie = movies[currentIndex];
    const progress = ((currentIndex / movies.length) * 100).toFixed(0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex flex-col items-center justify-center p-4">
            {/* 진행도 */}
            <div className="w-full max-w-md mb-8">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-white text-sm font-medium">
                        {currentIndex + 1} / {movies.length}
                    </span>
                    <span className="text-gray-400 text-sm">{progress}% 완료</span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* 안내 텍스트 */}
            <div className="text-center mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    이 영화 어떠세요? 🎬
                </h1>
                <p className="text-gray-300">
                    좌우로 스와이프하여 선호도를 표시해주세요
                </p>
            </div>

            {/* 영화 카드 */}
            <div className="relative w-full max-w-md h-[500px] mb-8">
                {currentMovie && (
                    <div
                        className={`absolute inset-0 bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-700 transition-transform duration-300 ${swipeDirection === "left"
                            ? "-translate-x-[500px] -rotate-12"
                            : swipeDirection === "right"
                                ? "translate-x-[500px] rotate-12"
                                : ""
                            }`}
                    >
                        {/* 포스터 (없으면 그라디언트 배경) */}
                        <div className="h-3/5 bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                            {currentMovie.posterUrl ? (
                                <img
                                    src={currentMovie.posterUrl}
                                    alt={currentMovie.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="text-6xl">🎬</div>
                            )}
                        </div>

                        {/* 영화 정보 */}
                        <div className="p-6 h-2/5 flex flex-col justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    {currentMovie.title}
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {currentMovie.genres.map((genre) => (
                                        <span
                                            key={genre}
                                            className="px-3 py-1 bg-purple-600/50 text-white text-sm rounded-full"
                                        >
                                            {genre}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 스와이프 힌트 오버레이 */}
                        {swipeDirection && (
                            <div
                                className={`absolute inset-0 flex items-center justify-center ${swipeDirection === "right"
                                    ? "bg-green-500/30"
                                    : "bg-red-500/30"
                                    }`}
                            >
                                <div className="text-8xl">
                                    {swipeDirection === "right" ? "👍" : "👎"}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* 버튼 */}
            <div className="flex gap-6">
                <button
                    onClick={() => handleSwipe("left")}
                    className="w-16 h-16 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center text-3xl transition-all shadow-lg hover:scale-110"
                    aria-label="싫어요"
                >
                    👎
                </button>
                <button
                    onClick={() => handleSwipe("right")}
                    className="w-16 h-16 bg-green-600 hover:bg-green-500 rounded-full flex items-center justify-center text-3xl transition-all shadow-lg hover:scale-110"
                    aria-label="좋아요"
                >
                    👍
                </button>
            </div>

            {/* 건너뛰기 버튼 */}
            <div className="mt-8">
                <button
                    onClick={handleSkipSurvey}
                    className="text-gray-500 hover:text-white text-sm font-medium transition-colors px-4 py-2 hover:bg-gray-800 rounded-lg"
                >
                    취향 조사 건너뛰기
                </button>
            </div>
        </div>
    );
}
