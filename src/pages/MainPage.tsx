// ============================================================
// [용도] 메인 페이지 - Chatbot과 실험실 버튼
// [사용법] 라우트: /
// ============================================================
// [스타일 수정 가이드]
//
// 1. 페이지 컨테이너
//    - max-w-screen-xl: 최대 너비 1280px
//    - mx-auto: 가로 중앙 정렬
//    - px-4: 좌우 패딩 16px
//    - py-6: 위아래 패딩 24px
//
// 2. 실험실 버튼 그라데이션
//    - bg-gradient-to-r: 왼쪽 → 오른쪽 그라데이션
//    - from-purple-600 to-pink-600: 보라색 → 핑크색
//    - 다른 색상 조합: from-blue-500 to-cyan-500 (시원한 느낌)
//                      from-orange-500 to-red-500 (따뜻한 느낌)
//
// 3. 버튼 크기
//    - px-8 py-3: 좌우 32px, 위아래 12px
//    - 더 크게: px-10 py-4 / 더 작게: px-6 py-2
//
// 4. 호버 효과
//    - hover:shadow-2xl: 호버 시 그림자 강조
//    - hover:scale-105: 호버 시 5% 확대
//    - group-hover:translate-x-1: 화살표 오른쪽 이동
// ============================================================

import { useState } from 'react';
import Chatbot from '../services/chatbot/components/Chatbot';
import FloatingBubble from "../components/ui/FloatingBubble";
import { useAuth } from '../app/providers/AuthContext';
import LoginModal from '../services/auth/components/LoginModal/LoginModal';

export default function MainPage() {
    const { isAuthenticated } = useAuth();
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);


    // 챗봇 열기 핸들러 (로그인 체크)
    const handleOpenChatbot = () => {
        if (!isAuthenticated) {
            // 비로그인 시 로그인 모달 표시
            setShowLoginModal(true);
        } else {
            // 로그인 상태면 챗봇 열기
            setIsChatbotOpen(true);
        }
    };

    return (
        <div className="max-w-screen-xl mx-auto px-4 py-6">
            <div className='max-w-screen-2xl mx-auto relative'>
                <FloatingBubble
                    className="left-1/2 -translate-x-1/2 bottom-20 font-bold text-blue-400 z-floating cursor-pointer"
                    visible={!isChatbotOpen}
                    float
                    onClick={handleOpenChatbot}
                >
                    당신에게 꼭 맞는 영화를 추천드리겠습니다.
                </FloatingBubble>
                <Chatbot
                    isOpen={isChatbotOpen}
                    setIsOpen={setIsChatbotOpen}
                    onLoginRequired={() => setShowLoginModal(true)}
                />
            </div>

            {/* 로그인 모달 */}
            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onSignupClick={() => {
                    setShowLoginModal(false);
                    // 필요시 회원가입 모달 열기
                }}
            />
        </div>
    );
}
