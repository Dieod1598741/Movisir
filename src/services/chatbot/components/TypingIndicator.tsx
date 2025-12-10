// [용도] 타이핑 인디케이터 - 봇이 응답 준비 중임을 표시
// [사용법] {isTyping && <TypingIndicator />}
// [수정 가이드]
//   - 점 개수: 34-36번 줄 div 추가/제거
//   - 애니메이션 속도: 57번 줄 animation-duration 값 조정 (현재 1.4s)
//   - 점 크기: 41번 줄 w-2 h-2 → w-3 h-3 (크게) 또는 w-1.5 h-1.5 (작게)
//   - 말풍선 색상: 22번 줄 bg-white/bg-gray-800 변경

export default function TypingIndicator() {
    return (
        <div
            /* [디자인] 타이핑 인디케이터 컨테이너 (봇 메시지 위치에 표시) */
            /* justify-start: 왼쪽 정렬 (봇 메시지 위치) */
            className="flex w-full mb-4 justify-start"
        >
            <div
                /* [디자인] 타이핑 말풍선 */
                /* rounded-2xl: 둥근 모서리 */
                /* rounded-tl-none: 왼쪽 위 모서리는 각지게 (말풍선 꼬리 효과) */
                /* px-5 py-3: 여백 (점들이 들어갈 공간) */
                /* bg-white: 흰색 배경 (라이트 모드) */
                /* dark:bg-gray-800: 다크모드에서 어두운 배경 */
                className="max-w-[85%] rounded-2xl rounded-tl-none px-5 py-3 shadow-sm
                   bg-white dark:bg-gray-800"
            >
                <div
                    /* [디자인] 점 3개 컨테이너 */
                    /* flex gap-1: 점들을 가로로 배치, 간격 4px */
                    /* items-center: 세로 중앙 정렬 */
                    className="flex gap-1 items-center"
                >
                    {/* 점 1 - 애니메이션 지연 0ms */}
                    <div className="typing-dot" style={{ animationDelay: '0ms' }}></div>
                    {/* 점 2 - 애니메이션 지연 200ms */}
                    <div className="typing-dot" style={{ animationDelay: '200ms' }}></div>
                    {/* 점 3 - 애니메이션 지연 400ms */}
                    <div className="typing-dot" style={{ animationDelay: '400ms' }}></div>
                </div>
            </div>

            {/* [CSS] 타이핑 애니메이션 정의 */}
            <style>{`
        .typing-dot {
          /* 점 기본 스타일 */
          width: 8px;
          height: 8px;
          border-radius: 50%; /* 원형 */
          background-color: #60a5fa; /* 파란색 (tailwind blue-400) */
          animation: typing-bounce 1.4s infinite ease-in-out;
        }

        /* 다크모드에서 점 색상 변경 */
        :is(.dark .typing-dot) {
          background-color: #93c5fd; /* 연한 파란색 (tailwind blue-300) */
        }

        /* 타이핑 바운스 애니메이션 */
        @keyframes typing-bounce {
          0%, 60%, 100% {
            transform: translateY(0); /* 원래 위치 */
            opacity: 0.7;
          }
          30% {
            transform: translateY(-10px); /* 위로 10px 이동 */
            opacity: 1;
          }
        }

        /* [수정 예시] 
         * 애니메이션을 페이드인아웃으로 변경하려면:
         * 
         * @keyframes typing-fade {
         *   0%, 100% { opacity: 0.3; }
         *   50% { opacity: 1; }
         * }
         * 
         * 그리고 위 animation 속성을 변경:
         * animation: typing-fade 1.4s infinite ease-in-out;
         */
      `}</style>
        </div>
    );
}
