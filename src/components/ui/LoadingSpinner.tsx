// [용도] 재사용 가능한 로딩 스피너 컴포넌트
// [사용법] <LoadingSpinner message="커스텀 메시지" submessage="서브 메시지" />
// [특징] 다중 회전 애니메이션, 점 애니메이션, 커스터마이징 가능한 메시지

interface LoadingSpinnerProps {
    message?: string;
    submessage?: string;
}

export default function LoadingSpinner({
    message = "로딩 중...",
    submessage = "잠시만 기다려주세요...",
}: LoadingSpinnerProps) {
    return (
        <div className="text-center py-8 md:py-12 animate-fade-in">
            {/* 다중 회전 스피너 */}
            <div className="relative inline-block mb-5 md:mb-6">
                {/* 외부 회전 원 (회색 베이스) */}
                <div className="animate-spin rounded-full h-14 w-14 md:h-16 md:w-16 border-4 border-gray-300 dark:border-gray-600"></div>

                {/* 중간 회전 원 (역방향) */}
                <div
                    className="absolute top-0 left-0 rounded-full h-14 w-14 md:h-16 md:w-16 border-4 border-transparent border-t-blue-500 border-r-blue-400 dark:border-t-blue-400 dark:border-r-blue-300"
                    style={{ animation: "spin 1s linear infinite reverse" }}
                ></div>

                {/* 내부 회전 원 (빠른 회전) */}
                <div
                    className="absolute top-0 left-0 rounded-full h-14 w-14 md:h-16 md:w-16 border-4 border-transparent border-t-blue-600 dark:border-t-blue-500"
                    style={{ animation: "spin 0.6s linear infinite" }}
                ></div>
            </div>

            {/* 메인 메시지 */}
            <p className="text-base md:text-xl text-gray-900 dark:text-white font-bold mb-1.5 md:mb-2 animate-pulse">
                {message}
            </p>

            {/* 서브 메시지 */}
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 animate-fade-in">
                {submessage}
            </p>

            {/* 점 애니메이션 */}
            <div className="flex justify-center gap-1.5 md:gap-2 mt-3 md:mt-4">
                <div
                    className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-600 dark:bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                ></div>
                <div
                    className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                ></div>
                <div
                    className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-400 dark:bg-blue-300 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                ></div>
            </div>
        </div>
    );
}

// [사용 예시]
// 
// import LoadingSpinner from '@/components/ui/LoadingSpinner';
// 
// // 기본 사용
// <LoadingSpinner />
//
// // 커스텀 메시지
// <LoadingSpinner 
//   message="영화를 불러오는 중..." 
//   submessage="추천 영화를 준비하고 있어요"
// />
//
// // 조건부 렌더링
// {isLoading && <LoadingSpinner message="데이터 로딩 중..." />}
//
// // 모달 내부에서 사용
// <Modal isOpen={isOpen}>
//   {isLoading ? <LoadingSpinner /> : <Content />}
// </Modal>
