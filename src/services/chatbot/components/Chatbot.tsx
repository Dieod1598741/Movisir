// ============================================================
// [용도] 챗봇 메인 컴포넌트 - 버튼과 패널 통합
// [사용법] <Chatbot isOpen={state} setIsOpen={setState} />
// ============================================================
// [스타일 수정 가이드]
//
// 1. 챗봇 열림 시 버튼 위치 이동
//    - -translate-x-[410px]: 왼쪽으로 410px 이동 (패널 옆으로)
//    - translate-y-[-80px]: 위로 80px 이동
//    - 패널 크기 변경 시 이 값도 조정 필요
//
// 2. 챗봇 닫힘 시 버튼 위치
//    - translate-y-20: 아래로 80px (기본 위치)
//
// 3. 애니메이션 속도
//    - duration-500: 0.5초 (더 빠르게: 300, 더 느리게: 700)
//    - ease-out: 끝으로 갈수록 느려지는 효과
//
// 4. 레이어 순서 (z-index)
//    - z-30: 버튼이 패널보다 위에 표시 (패널은 z-20)
// ============================================================

import ChatbotButton from "./ChatbotButton";
import ChatbotPanel from "./ChatbotPanel";
import type { ChatbotProps } from "./chatbot.types";
import { useAuth } from '../../../app/providers/AuthContext';

export default function Chatbot({ isOpen = false, setIsOpen, onLoginRequired }: ChatbotProps & { onLoginRequired?: () => void }) {
  const { isAuthenticated } = useAuth();
  const isDark = document.documentElement.classList.contains("dark");

  // 챗봇 열기 시도 (로그인 체크)
  const handleOpenChatbot = () => {
    if (!isAuthenticated) {
      // 비로그인 시 로그인 모달 표시
      onLoginRequired?.();
    } else {
      // 로그인 상태면 챗봇 열기
      setIsOpen?.(true);
    }
  };

  return (
    <div className="w-full flex flex-col items-center mt-16 select-none relative">

      {/* 챗봇 버튼 - 열림/닫힘에 따라 위치 변경 */}
      <div
        className={`
          z-floating
          transition-all duration-500 ease-out transform
          ${isOpen
            ? "-translate-x-[410px] translate-y-[-80px] opacity-100"
            : "translate-y-20"}`}
      >
        <ChatbotButton
          isDark={isDark}
          onClick={handleOpenChatbot}
        />
      </div>

      {/* 패널 */}
      <ChatbotPanel
        isOpen={isOpen}
        onClose={() => setIsOpen?.(false)}
      />
    </div>
  );
}
