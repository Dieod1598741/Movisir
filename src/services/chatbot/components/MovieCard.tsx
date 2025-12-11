// ============================================================
// [용도] 영화 카드 컴포넌트 (포스터, 제목, 장르 표시)
// [사용법] <MovieCard movie={movieData} onClick={handleClick} />
// ============================================================
// [스타일 수정 가이드]
//
// 1. 카드 전체 크기/모양
//    - rounded-lg: 모서리 8px 둥글기 (rounded-xl: 12px)
//    - shadow-md: 중간 그림자 (shadow-lg: 더 강하게)
//    - hover:scale-105: 호버 시 5% 확대 (값 조절로 효과 강도 변경)
//
// 2. 포스터 비율
//    - aspect-[2/3]: 세로형 포스터 (가로:세로 = 2:3)
//    - aspect-[3/4]: 정사각형에 가깝게 / aspect-square: 정사각형
//
// 3. 호버 오버레이
//    - bg-black/0 → group-hover:bg-black/20: 호버 시 20% 어두워짐
//    - group-hover:bg-black/40: 더 어둡게
//
// 4. "Watched" 뱃지
//    - bg-green-500/90: 초록색 90% 불투명
//    - 위치: top-2 left-2 (상단 왼쪽 8px)
//    - 색상 변경: bg-blue-500, bg-purple-500 등
//
// 5. 제목 영역
//    - p-2: 패딩 8px (p-3: 12px, p-4: 16px)
//    - bg-white / dark:bg-gray-800: 라이트/다크 모드 배경
//
// 6. 텍스트 크기
//    - text-sm: 제목 14px
//    - text-xs: 장르 12px
//    - truncate: 긴 텍스트 말줄임표 처리
// ============================================================

import { Eye, RefreshCw } from 'lucide-react';
import type { Movie } from '../../../api/movieApi.type';
import { useState } from 'react';


interface MovieCardProps {
    movie: Movie;
    onClick: () => void;
    onReRecommend?: () => void;     // 재추천받기 콜백 (영화 제거 및 교체)
    onAddToWatched?: () => void;    // 봤어요 리스트 추가 콜백
    showReRecommend?: boolean;      // 재추천받기 버튼 표시 여부
}

export default function MovieCard({ movie, onClick, onReRecommend, onAddToWatched, showReRecommend = false }: MovieCardProps) {
    const [isRemoving, setIsRemoving] = useState(false);
    const [isWatched, setIsWatched] = useState(movie.watched || false);  // 로컬 watched 상태

    // 재추천받기 버튼 클릭 (포스터 사라짐)
    const handleReRecommend = (e: React.MouseEvent) => {
        e.stopPropagation();  // 카드 클릭 이벤트 방지

        if (onReRecommend) {
            setIsRemoving(true);
            // 애니메이션 종료 후 실제 제거
            setTimeout(() => {
                onReRecommend();
            }, 300);
        }
    };

    // 봤어요 버튼 클릭 (포스터 안 사라짐)
    const handleAddToWatched = (e: React.MouseEvent) => {
        e.stopPropagation();  // 카드 클릭 이벤트 방지

        if (onAddToWatched && !isWatched) {  // 이미 봤어요 표시된 경우 중복 클릭 방지
            setIsWatched(true);  // 즉시 UI 업데이트
            onAddToWatched();
        }
    };

    return (
        <div
            // 카드 컨테이너: group으로 묶어 자식 요소에 hover 효과 전파
            className={`relative group cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 ${isRemoving ? 'animate-slide-down-fade' : ''
                }`}
            onClick={onClick}
        >
            {/* 포스터 이미지 */}
            <div className="aspect-[2/3] w-full relative">
                <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                />
                {/* 호버 시 어두운 오버레이 */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

                {/* 시청 완료 배지 */}
                {isWatched && (
                    <div className="absolute top-2 left-2 bg-green-500/90 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-sm backdrop-blur-sm">
                        <Eye size={12} />
                        <span>Watched</span>
                    </div>
                )}

                {/* 봤어요 버튼 (우측 상단) - 시청 기록 추가만, 포스터 안 사라짐 */}
                {showReRecommend && onAddToWatched && (
                    <button
                        onClick={handleAddToWatched}
                        className={`absolute top-2 right-2 p-2 rounded-full shadow-md transition-all duration-300 backdrop-blur-sm ${isWatched
                                ? 'bg-gray-400/90 text-white cursor-default'  // 이미 봤어요 표시: 회색
                                : 'bg-green-500/90 text-white hover:bg-green-600 hover:scale-110'  // 아직 안 봄: 초록색
                            }`}
                        title={isWatched ? '이미 봤어요 리스트에 추가됨' : '봤어요 리스트에 추가'}
                        disabled={isWatched}
                    >
                        <Eye size={16} />
                    </button>
                )}
            </div>

            {/* 제목 및 장르 */}
            <div className="p-2 bg-white dark:bg-gray-800">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {movie.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {movie.genres.join(", ")}
                </p>

                {/* 재추천받기 버튼 - 포스터 사라짐 및 새 영화로 교체 */}
                {showReRecommend && onReRecommend && (
                    <button
                        onClick={handleReRecommend}
                        className="w-full mt-2 py-1.5 px-3 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-md flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                        <RefreshCw size={12} />
                        재추천받기
                    </button>
                )}
            </div>
        </div>
    );
}
