// [용도] Quick Reply 버튼 컴포넌트 (메신저 스타일 빠른 응답)
// [사용법] <QuickReplyButtons replies={['액션', 'SF', '드라마']} onSelect={handleQuickReply} />
// [수정 가이드]
//   - 버튼 색상: 36번 줄 bg-blue-50/border-blue-300 변경
//   - 버튼 크기: 36번 줄 px-4 py-2 값 조정
//   - 레이아웃: 28번 줄 flex-wrap (여러 줄) → flex-nowrap (한 줄) + overflow-x-auto
//   - 아이콘 추가: replies 배열에 { label, icon } 형태로 확장 가능

interface QuickReplyButtonsProps {
    replies: string[]; // 버튼으로 표시할 텍스트 배열
    onSelect: (reply: string) => void; // 버튼 클릭 시 호출될 함수
    disabled?: boolean; // 버튼 비활성화 (봇이 응답 중일 때)
}

export default function QuickReplyButtons({ replies, onSelect, disabled = false }: QuickReplyButtonsProps) {
    // 빈 배열이면 아무것도 렌더링하지 않음
    if (!replies || replies.length === 0) return null;

    return (
        <div
            /* [디자인] Quick Reply 버튼 컨테이너 */
            /* mt-2: 상단 여백 8px (메시지와 간격) */
            /* flex flex-wrap: 버튼들을 가로로 배치, 공간 부족 시 다음 줄로 */
            /* gap-2: 버튼 사이 간격 8px */
            className="mt-2 flex flex-wrap gap-2"
        >
            {replies.map((reply, index) => (
                <button
                    key={`${reply}-${index}`} // 고유 키 (같은 텍스트가 여러 개일 수 있음)
                    onClick={() => !disabled && onSelect(reply)}
                    disabled={disabled}
                    /* [디자인] 개별 버튼 스타일 (메신저 스타일) */
                    /* px-4 py-2: 좌우 16px, 위아래 8px 여백 */
                    /* border-2: 테두리 두께 2px */
                    /* rounded-full: 완전히 둥근 모서리 (알약 모양) */
                    /* bg-blue-50: 연한 파란색 배경 */
                    /* border-blue-300: 파란색 테두리 */
                    /* hover:bg-blue-100: 마우스 올리면 배경색 진하게 */
                    /* hover:scale-105: 마우스 올리면 살짝 확대 */
                    /* active:scale-95: 클릭 시 살짝 축소 (클릭 피드백) */
                    /* transition-all: 모든 변화에 애니메이션 */
                    className="px-4 py-2 border-2 border-blue-300 dark:border-blue-500 rounded-full
                     bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300
                     hover:bg-blue-100 dark:hover:bg-blue-800/50 hover:border-blue-400
                     font-medium text-sm
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200 hover:scale-105 active:scale-95
                     shadow-sm hover:shadow-md"
                >
                    {reply}
                </button>
            ))}
        </div>
    );
}

// [확장 예시]
// 아이콘 포함 버튼을 원하면 다음과 같이 수정:
// 
// interface QuickReply {
//   label: string;
//   icon?: React.ReactNode;
// }
// 
// replies: QuickReply[]로 변경 후 렌더링 시:
// {reply.icon && <span className="mr-1">{reply.icon}</span>}
// {reply.label}
