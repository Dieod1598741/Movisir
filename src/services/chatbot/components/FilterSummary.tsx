// [용도] 현재 선택된 필터 요약 표시 컴포넌트
// [사용법] <FilterSummary />  (Zustand store에서 자동으로 필터 가져옴)
// [수정 가이드]
//   - 뱃지 색상: 46, 53번 줄 bg-blue-100/text-blue-700 변경
//   - 아이콘 변경: 42, 49번 줄 이모지 교체
//   - 표시 위치: 부모 컴포넌트에서 위치 조정 (현재는 상단 고정)
//   - 표시 형식: 44, 51번 줄 텍스트 포맷 수정

import { useMovieStore } from '../../../store/useMovieStore';

export default function FilterSummary() {
    // [Zustand] 현재 필터 상태 가져오기
    const { filters } = useMovieStore();

    // [조건] 필터가 하나도 선택되지 않았으면 표시하지 않음
    const hasFilters = filters.genres.length > 0 || filters.time !== "00:00";

    if (!hasFilters) return null;

    return (
        <div
            /* [디자인] 필터 요약 컨테이너 */
            /* bg-gradient-to-r: 그라데이션 배경 (파란색 → 보라색) */
            /* p-3: 내부 여백 12px */
            /* border-b: 하단 테두리로 구분선 효과 */
            /* shadow-sm: 살짝 그림자 */
            className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 
                 p-3 border-b border-gray-200 dark:border-gray-600 shadow-sm"
        >
            <div
                /* [디자인] 뱃지들 컨테이너 */
                /* flex flex-wrap: 뱃지들을 가로로 배치, 공간 부족 시 다음 줄로 */
                /* gap-2: 뱃지 사이 간격 8px */
                /* items-center: 세로 중앙 정렬 */
                className="flex flex-wrap gap-2 items-center justify-center"
            >
                {/* 제목 텍스트 */}
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                    현재 필터:
                </span>

                {/* 장르 필터 뱃지 */}
                {filters.genres.length > 0 && (
                    <div
                        /* [디자인] 장르 뱃지 */
                        /* px-3 py-1: 좌우 12px, 위아래 4px 여백 */
                        /* rounded-full: 완전히 둥근 모서리 (알약 모양) */
                        /* bg-blue-100: 연한 파란색 배경 */
                        className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/50 
                       text-blue-700 dark:text-blue-300 text-xs font-medium
                       shadow-sm"
                    >
                        🎬 {filters.genres.join(', ')}
                    </div>
                )}

                {/* 시간 필터 뱃지 */}
                {filters.time !== "00:00" && (
                    <div
                        /* [디자인] 시간 뱃지 */
                        className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/50 
                       text-green-700 dark:text-green-300 text-xs font-medium
                       shadow-sm"
                    >
                        ⏱️ {filters.time} 이내
                    </div>
                )}
            </div>
        </div>
    );
}

// [확장 예시]
// 필터 초기화 버튼을 추가하려면:
// 
// import { X } from 'lucide-react';
// const { resetFilters } = useMovieStore();
// 
// 그리고 뱃지들 뒤에 추가:
// <button 
//   onClick={resetFilters}
//   className="text-xs text-gray-500 hover:text-red-600"
// >
//   <X size={16} />
// </button>
