// [용도] Step 2 - Genre Filter Component
// [사용법] <GenreFilterStep onBack={() => goBack()} onRecommend={() => apply()} />

import { ChevronLeft, Sparkles } from 'lucide-react';
import { useMovieStore } from '../../../store/useMovieStore';

interface GenreFilterStepProps {
    onBack: () => void;
    onRecommend: () => void;
}

const GENRES = ["모험", "애니메이션", "청소년", "코미디", "판타지", "로맨스", "드라마", "액션", "범죄", "스릴러", "호러", "미스터리", "SF", "가족", "다큐멘터리", "전쟁", "뮤지컬", "서부", "기타"];

export default function GenreFilterStep({ onBack, onRecommend }: GenreFilterStepProps) {
    const { filters, toggleGenre } = useMovieStore();
    const hasGenresSelected = filters.genres.length > 0;

    return (
        <div className="space-y-4 sm:space-y-6 animate-slide-in-right">
            {/* Title */}
            <div className="text-center px-2">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mb-3 sm:mb-4">
                    <Sparkles className="text-white" size={24} />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-1.5 sm:mb-2">
                    어떤 장르를 좋아하시나요?
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    좋아하는 장르를 모두 선택해주세요 (복수 선택 가능)
                </p>
            </div>

            {/* Selected Count */}
            <div className="text-center bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 mx-2 sm:mx-0">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">선택된 장르</p>
                <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
                    {filters.genres.length}개
                </div>
                {filters.genres.length > 0 && (
                    <div className="mt-2 flex flex-wrap justify-center gap-1.5 sm:gap-2">
                        {filters.genres.map(genre => (
                            <span key={genre} className="text-xs px-2 py-0.5 sm:py-1 bg-white dark:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300">
                                {genre}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Genre Grid */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 px-2 sm:px-0">
                {GENRES.map(genre => {
                    const isSelected = filters.genres.includes(genre);
                    return (
                        <button
                            key={genre}
                            onClick={() => toggleGenre(genre)}
                            className={`
                                px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 transform
                                ${isSelected
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-105'
                                }
                            `}
                        >
                            {genre}
                        </button>
                    );
                })}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-2 sm:gap-3">
                {/* Back Button */}
                <button
                    onClick={onBack}
                    className="flex-1 py-3 sm:py-3.5 md:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base md:text-lg flex items-center justify-center gap-1.5 sm:gap-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
                >
                    <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
                    이전
                </button>

                {/* Recommend Button */}
                <button
                    onClick={onRecommend}
                    disabled={!hasGenresSelected}
                    className={`
                        flex-[2] py-3 sm:py-3.5 md:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base md:text-lg flex items-center justify-center gap-1.5 sm:gap-2
                        transition-all duration-300 transform
                        ${hasGenresSelected
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        }
                    `}
                >
                    <Sparkles size={16} className="sm:w-5 sm:h-5" />
                    영화 추천받기
                </button>
            </div>
        </div>
    );
}
