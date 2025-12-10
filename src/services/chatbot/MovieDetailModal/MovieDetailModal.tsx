// ============================================================
// [용도] 영화 상세 정보 모달
// [사용법] <MovieDetailModal /> (Zustand store에서 detailMovie 감지)
// ============================================================
// [스타일 수정 가이드]
//
// 1. 레이아웃 (모바일 vs 데스크톱)
//    - flex-col: 모바일에서 세로 배치 (포스터 위, 정보 아래)
//    - md:flex-row: 태블릿 이상에서 가로 배치 (포스터 왼쪽, 정보 오른쪽)
//
// 2. 포스터 크기
//    - w-full md:w-1/3: 모바일 100%, 데스크톱 33%
//    - aspect-[2/3]: 세로형 포스터 비율
//
// 3. 정보 영역
//    - w-full md:w-2/3: 모바일 100%, 데스크톱 67%
//    - p-6: 패딩 24px
//
// 4. 장르 뱃지
//    - px-2 py-1: 패딩 (좌우 8px, 위아래 4px)
//    - bg-gray-100 dark:bg-gray-700: 라이트/다크 배경
//    - rounded-full: 완전히 둥근 모서리
//    - text-xs: 글자 크기 12px
//
// 5. 아이콘 색상
//    - text-yellow-400: 별점 (노란색)
//    - text-blue-500: 시간 (파란색)
//    - text-green-500: 연도 (초록색)
//
// 6. Watch Now 버튼
//    - bg-blue-600: 파란색 배경
//    - hover:bg-blue-700: 호버 시 더 진한 파란색
//    - rounded-lg: 모서리 8px 둥글기
// ============================================================

import Modal from '../../../components/Modal';
import { useMovieStore } from '../../../store/useMovieStore';
import { Clock, Star, Calendar } from 'lucide-react';

export default function MovieDetailModal() {
    const { detailMovie, setDetailMovie } = useMovieStore();

    // TODO: Replace mock API with backend API call
    // useEffect(() => {
    //   if (detailMovie) {
    //     fetchMovieDetails(detailMovie.id);
    //   }
    // }, [detailMovie]);

    return (
        <Modal isOpen={!!detailMovie} onClose={() => setDetailMovie(null)}>
            {detailMovie && (
                <div className="flex flex-col md:flex-row">
                    {/* 포스터 이미지 */}
                    <div className="w-full md:w-1/3 aspect-[2/3] relative">
                        <img
                            src={detailMovie.poster}
                            alt={detailMovie.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* 상세 정보 영역 */}
                    <div className="w-full md:w-2/3 p-6 flex flex-col">
                        {/* 제목 */}
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {detailMovie.title}
                        </h2>

                        {/* 장르 뱃지들 */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {detailMovie.genres.map((genre: string) => (
                                <span key={genre} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                                    {genre}
                                </span>
                            ))}
                        </div>

                        {/* 설명 */}
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6 flex-1">
                            {detailMovie.description}
                        </p>

                        {/* 평점, 시간, 연도 정보 */}
                        <div className="grid grid-cols-3 gap-4 border-t border-gray-100 dark:border-gray-700 pt-4">
                            <div className="flex flex-col items-center">
                                <Star className="text-yellow-400 mb-1" size={20} />
                                <span className="text-xs text-gray-500">Rating</span>
                                <span className="font-bold text-gray-900 dark:text-white">8.5</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <Clock className="text-blue-500 mb-1" size={20} />
                                <span className="text-xs text-gray-500">Duration</span>
                                <span className="font-bold text-gray-900 dark:text-white">148m</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <Calendar className="text-green-500 mb-1" size={20} />
                                <span className="text-xs text-gray-500">Year</span>
                                <span className="font-bold text-gray-900 dark:text-white">2010</span>
                            </div>
                        </div>

                        {/* 시청 버튼 */}
                        <button
                            className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
                            onClick={() => alert('Play movie feature coming soon!')}
                        >
                            Watch Now
                        </button>
                    </div>
                </div>
            )}
        </Modal>
    );
}
