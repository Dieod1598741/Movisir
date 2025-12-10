// [용도] 채팅 메시지 목록 컴포넌트 - 모든 메시지를 스크롤 가능한 영역에 표시
// [사용법] <ChatMessageList messages={messages} isTyping={isBotTyping} onQuickReply={handleQuickReply} />
// [수정 가이드]
//   - 스크롤 영역 배경색: 39번 줄 bg-gray-100/dark:bg-gray-900
//   - 메시지 간격: 44번 줄 space-y-2 → space-y-4 (간격 크게)
//   - 자동 스크롤 동작: 22번 줄 behavior: 'smooth' → 'instant' (즉시 이동)

import React, { useEffect, useRef } from 'react';
import ChatBubble from './ChatBubble';
import TypingIndicator from './TypingIndicator';

// [타입] 메시지 인터페이스
export interface Message {
    id: string; // 고유 ID
    type: 'bot' | 'user'; // 메시지 타입
    content: string | React.ReactNode; // 메시지 내용
    quickReplies?: string[]; // Quick Reply 버튼 배열 (선택사항)
}

interface ChatMessageListProps {
    messages: Message[]; // 표시할 메시지 배열
    isTyping?: boolean; // 봇이 타이핑 중인지 여부
    onQuickReply?: (reply: string) => void; // Quick Reply 클릭 핸들러
}

export default function ChatMessageList({ messages, isTyping = false, onQuickReply }: ChatMessageListProps) {
    // [Ref] 스크롤을 위한 하단 요소 참조
    const bottomRef = useRef<HTMLDivElement>(null);

    // [Effect] 새 메시지 or 타이핑 상태 변경 시 자동 스크롤
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    return (
        <div
            /* [디자인] 메시지 목록 컨테이너 */
            /* h-full: 전체 높이 */
            /* overflow-y-auto: 세로 스크롤 가능 */
            /* bg-gray-100: 연한 회색 배경 (라이트 모드) */
            /* dark:bg-gray-900: 다크모드에서 어두운 배경 */
            className="h-full overflow-y-auto bg-gray-100 dark:bg-gray-900"
        >
            <div
                /* [디자인] 메시지들 내부 컨테이너 */
                /* p-4: 내부 여백 16px */
                /* space-y-2: 메시지 사이 간격 8px */
                className="p-4 space-y-2"
            >
                {/* 모든 메시지 렌더링 */}
                {messages.map((msg) => (
                    <ChatBubble
                        key={msg.id}
                        type={msg.type}
                        content={msg.content}
                        quickReplies={msg.quickReplies} // Quick Reply 버튼 전달
                        onQuickReply={onQuickReply} // Quick Reply 핸들러 전달
                    />
                ))}

                {/* 타이핑 인디케이터 (봇이 응답 준비 중일 때만 표시) */}
                {isTyping && <TypingIndicator />}

                {/* 자동 스크롤을 위한 하단 요소 */}
                <div ref={bottomRef} />
            </div>
        </div>
    );
}

// [확장 예시]
// 날짜별 그룹핑을 원하면:
// 1. messages를 날짜별로 그룹화
// 2. 각 그룹마다 날짜 헤더 추가
// 
// const groupedMessages = groupByDate(messages);
// {Object.entries(groupedMessages).map(([date, msgs]) => (
//   <div key={date}>
//     <div className="text-center text-xs text-gray-500">{date}</div>
//     {msgs.map(msg => <ChatBubble ... />)}
//   </div>
// ))}
