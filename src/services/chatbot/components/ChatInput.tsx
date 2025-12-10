// [용도] 사용자 텍스트 입력 컴포넌트
// [사용법] <ChatInput onSend={handleSendMessage} disabled={isBotTyping} placeholder="메시지를 입력하세요..." />
// [수정 가이드]
//   - placeholder 문구: 27번 줄에서 수정
//   - 버튼 색상: 37번 줄 bg-blue-600 → 원하는 색상으로 변경
//   - 입력창 높이: 26번 줄 py-3 → py-2 (작게) 또는 py-4 (크게)
//   - 아이콘 변경: 38번 줄 ↑ 이모지 변경 가능

import { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
    onSend: (message: string) => void; // 메시지 전송 시 호출될 함수
    disabled?: boolean; // 입력 비활성화 (봇이 응답 중일 때)
    placeholder?: string; // 입력창 placeholder 텍스트
}

export default function ChatInput({ onSend, disabled = false, placeholder = "메시지를 입력하세요..." }: ChatInputProps) {
    // [상태] 현재 입력 중인 텍스트
    const [inputValue, setInputValue] = useState('');

    // [함수] 메시지 전송 처리
    // - 빈 메시지는 전송하지 않음
    // - 전송 후 입력창 초기화
    const handleSend = () => {
        const trimmed = inputValue.trim();
        if (trimmed && !disabled) {
            onSend(trimmed);
            setInputValue(''); // 입력창 초기화
        }
    };

    // [함수] Enter 키 입력 시 전송
    // - Shift + Enter는 줄바꿈 (현재는 single-line이지만 확장 가능)
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div
            /* [디자인] 입력창 컨테이너 */
            /* bg-white: 흰색 배경 (라이트 모드) */
            /* dark:bg-gray-800: 다크모드에서 어두운 배경 */
            /* border-t: 상단 테두리로 구분선 효과 */
            /* p-4: 내부 여백 16px */
            /* shadow-lg: 그림자 효과 (입력창 강조) */
            className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 shadow-lg"
        >
            <div
                /* [디자인] 입력창 + 버튼 컨테이너 */
                /* flex: 가로 배치 */
                /* gap-2: 입력창과 버튼 사이 간격 8px */
                className="flex gap-2 items-center"
            >
                {/* 텍스트 입력 필드 */}
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                    placeholder={placeholder}
                    /* [디자인] 입력창 스타일 */
                    /* flex-1: 남은 공간 모두 차지 */
                    /* px-4 py-3: 좌우 16px, 위아래 12px 여백 */
                    /* border rounded-xl: 둥근 테두리 */
                    /* focus:ring-2: 포커스 시 파란색 링 효과 */
                    /* disabled:opacity-50: 비활성화 시 투명도 50% */
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl 
                     bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     disabled:opacity-50 disabled:cursor-not-allowed
                     placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />

                {/* 전송 버튼 */}
                <button
                    onClick={handleSend}
                    disabled={disabled || !inputValue.trim()}
                    /* [디자인] 전송 버튼 스타일 */
                    /* p-3: 버튼 내부 여백 (클릭 영역 확대) */
                    /* bg-blue-600: 파란색 배경 */
                    /* hover:bg-blue-700: 마우스 올리면 더 진한 파란색 */
                    /* disabled:opacity-50: 비활성화 시 투명도 50% */
                    /* transition-all: 모든 변화에 애니메이션 */
                    className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200 hover:scale-105 active:scale-95
                     shadow-md hover:shadow-lg"
                    aria-label="메시지 전송"
                >
                    {/* 전송 아이콘 - lucide-react Send 아이콘 사용 */}
                    <Send size={20} />
                </button>
            </div>

            {/* 힌트 텍스트 (선택 사항) */}
            {!disabled && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center">
                    Enter 키로 전송 | 버튼을 사용하면 더 빠르게 선택할 수 있어요
                </p>
            )}
        </div>
    );
}
