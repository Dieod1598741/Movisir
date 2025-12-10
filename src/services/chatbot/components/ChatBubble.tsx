// [용도] 챗봇 말풍선 컴포넌트 - 봇/사용자 메시지 표시
// [사용법] <ChatBubble type="bot" content="메시지" quickReplies={['버튼1', '버튼2']} onQuickReply={handleClick} />
// [수정 가이드]
//   - 말풍선 색상: 28, 30번 줄 bg-white/bg-blue-600 변경
//   - 말풍선 모양: 27, 29번 줄 rounded-tl-none/rounded-tr-none (꼬리 위치)
//   - Quick Reply 버튼: QuickReplyButtons 컴포넌트 import 후 사용
//   - 애니메이션: 22번 줄 animate-fadeIn (duration 조정 가능)

import React from 'react';
import QuickReplyButtons from './QuickReplyButtons';

interface ChatBubbleProps {
    type: 'bot' | 'user'; // 메시지 타입 (봇 또는 사용자)
    content: string | React.ReactNode; // 메시지 내용 (텍스트 또는 JSX)
    quickReplies?: string[]; // Quick Reply 버튼 배열 (선택사항)
    onQuickReply?: (reply: string) => void; // Quick Reply 클릭 핸들러
}

export default function ChatBubble({ type, content, quickReplies, onQuickReply }: ChatBubbleProps) {
    const isBot = type === 'bot';

    return (
        <div
            /* [디자인] 메시지 컨테이너 */
            /* flex: 가로 배치 */
            /* justify-start/end: 봇은 왼쪽, 사용자는 오른쪽 정렬 */
            /* mb-4: 하단 여백 16px (메시지 간 간격) */
            /* animate-fadeIn: 페이드인 애니메이션 (아래 CSS 정의) */
            className={`flex w-full mb-4 ${isBot ? 'justify-start' : 'justify-end'} animate-fadeIn`}
        >
            <div className="max-w-[85%]">
                {/* 메시지 말풍선 */}
                <div
                    /* [디자인] 말풍선 스타일 (채팅 UI 느낌) */
                    /* rounded-[15px]: 둥근 모서리 (15px) */
                    /* p-3: 내부 여백 12px */
                    /* border-2: 2px 테두리 */
                    /* min-h-[1.75em]: 최소 높이 */
                    /* shadow-sm: 살짝 그림자 효과 */
                    className={`
                        rounded-[15px] p-3 border-2 shadow-sm
                        min-h-[1.75em]
                        ${isBot
                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-900 dark:border-gray-600'
                            : 'bg-blue-100 dark:bg-blue-900/50 text-gray-900 dark:text-white border-gray-900 dark:border-blue-700'
                        }
                    `}
                >
                    {/* 메시지 내용 - 텍스트 또는 JSX */}
                    {typeof content === 'string' ? (
                        <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap font-medium">{content}</p>
                    ) : (
                        content
                    )}
                </div>

                {/* Quick Reply 버튼들 (봇 메시지에만 표시) */}
                {isBot && quickReplies && quickReplies.length > 0 && onQuickReply && (
                    <QuickReplyButtons
                        replies={quickReplies}
                        onSelect={onQuickReply}
                    />
                )}
            </div>

            {/* [CSS] 페이드인 애니메이션 정의 */}
            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px); /* 아래에서 위로 올라오는 효과 */
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out; /* 0.3초 동안 부드럽게 나타남 */
                }

                /* [수정 예시] 애니메이션 속도 변경
                 * animation: fadeIn 0.5s ease-out; → 더 느리게
                 * animation: fadeIn 0.2s ease-out; → 더 빠르게
                 */
            `}</style>
        </div>
    );
}
