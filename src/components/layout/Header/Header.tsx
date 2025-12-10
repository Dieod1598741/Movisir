// [용도] 애플리케이션 헤더 컴포넌트
// [사용법] <Header isDark={isDark} handleDarkToggle={toggleDark} resetChatbot={reset} />

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import LoginModal from "../../../services/auth/components/LoginModal/LoginModal";
import SignupModal from "../../../services/auth/components/SignupModal/SignupModal";
import ForgotPasswordModal from "../../../services/auth/components/ForgotPasswordModal/ForgotPasswordModal";
import type { HeaderProps } from "./header.types";
import { useAuth } from "../../../app/providers/AuthContext";

export default function Header({ isDark, handleDarkToggle, resetChatbot }: HeaderProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isHelpOpen, setHelpOpen] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isSignupOpen, setSignupOpen] = useState(false);
  const [isForgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  // AuthContext에서 인증 상태 가져오기
  const { isAuthenticated, logout } = useAuth();

  // URL 파라미터로 비밀번호 찾기 모달 열기
  useEffect(() => {
    if (searchParams.get('forgot-password') === 'true') {
      setForgotPasswordOpen(true);
      // URL에서 파라미터 제거
      searchParams.delete('forgot-password');
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  // 로그아웃 핸들러
  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      logout();
      resetChatbot();
    }
  };

  return (
    <header
      /* [디자인] 헤더 컨테이너 */
      /* w-full: 전체 너비 */
      /* px-5 py-3: 좌우 여백 20px, 위아래 여백 12px */
      /* flex items-center justify-between: 좌우 양쪽 정렬 (로고 왼쪽, 메뉴 오른쪽) */
      /* bg-white: 흰색 배경 (라이트 모드) */
      /* dark:bg-gray-900: 다크모드에서 어두운 배경 */
      /* transition-colors duration-300: 배경색 변화 애니메이션 (0.3초) */
      className="w-full px-4 py-4 sm:px-5 sm:py-3 flex items-center justify-between bg-transparent dark:bg-transparent transition-colors duration-300"
    >
      {/* 로고 */}
      <div
        /* [디자인] 로고 텍스트 */
        /* text-xl: 모바일 (20px) */
        /* sm:text-2xl: 태블릿 이상 (24px) */
        /* text-blue-400: 파란색 텍스트 (브랜드 색상 변경 가능) */
        /* font-bold: 굵은 글씨 */
        /* cursor-pointer: 마우스 커서를 포인터로 변경 (클릭 가능 표시) */
        className="text-xl sm:text-2xl text-blue-400 font-bold cursor-pointer "
        onClick={() => {
          navigate('/'); // URL: 메인 페이지로 이동
          resetChatbot();
        }}
      >
        MOVISIR {/* 로고 텍스트 변경 가능 */}
      </div>

      {/* 메뉴 */}
      <div
        /* [디자인] 메뉴 컨테이너 */
        /* flex items-center: 가로 방향으로 요소 배치하고 세로 중앙 정렬 */
        /* gap-4: 메뉴 아이템 사이 간격 16px (조절 가능) */
        className="flex items-center gap-4"
      >
        {/* 도움말 */}
        <button
          onClick={() => setHelpOpen(true)}
          /* [디자인] 도움말 버튼 */
          /* text-xs: 모바일 작은 글씨 */
          /* sm:text-sm: 태블릿 이상 기본 글씨 */
          /* font-medium: 중간 굵기 */
          /* hover:scale-105: 마우스 올리면 확대 */
          /* text-blue-400: 파란색 텍스트 */
          className="text-l sm:text-sm font-medium hover:scale-105 text-blue-400 transition-transform"
        >
          도움말
        </button>

        {/* 로그인 또는 마이페이지 + 로그아웃 */}
        {!isAuthenticated ? (
          <Button label="로그인" onClick={() => setLoginOpen(true)} />
        ) : (
          <>
            <Button label="마이페이지" onClick={() => navigate('/mypage')} /> {/* URL: /mypage */}
            <button
              onClick={handleLogout}
              /* [디자인] 로그아웃 버튼 */
              /* text-xs: 모바일 작은 글씨 */
              /* sm:text-sm: 태블릿 이상 기본 글씨 */
              /* font-medium: 중간 굵기 */
              /* px-2 py-1: 모바일 여백 */
              /* sm:px-3 sm:py-1.5: 태블릿 이상 여백 */
              /* bg-red-500: 빨간색 배경 (로그아웃 강조) */
              /* hover:bg-red-600: 마우스 올리면 더 진한 빨간색 */
              /* text-white: 흰색 텍스트 */
              /* rounded-lg: 모서리를 둥글게 */
              /* transition-colors: 배경색 변화 애니메이션 */
              /* hover:scale-105: 마우스 올리면 살짝 확대 */
              /* transition-transform: 크기 변화 애니메이션 */
              className="text-l sm:text-sm font-medium px-2 py-1 sm:px-3 sm:py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all hover:scale-105"
            >
              로그아웃
            </button>
          </>
        )}
        {!isAuthenticated ? (
          <Button label="회원가입" onClick={() => setSignupOpen(true)} />
        ) : (
          <>
          </>
        )}

        {/* 다크모드 토글 */}
        <button
          onClick={handleDarkToggle}
          /* [디자인] 다크모드 토글 버튼 */
          /* text-lg: 모바일 크기 */
          /* sm:text-xl: 태블릿 이상 크기 */
          /* p-1.5: 모바일 내부 여백 */
          /* sm:p-2: 태블릿 이상 내부 여백 */
          /* rounded-lg: 모서리를 둥글게 */
          /* hover:animate-spin: 마우스 올리면 회전 애니메이션 */
          className="text-lg sm:text-xl p-1.5 sm:p-2 rounded-lg hover:animate-spin"
        >
          {isDark ? "🌙" : "☀️"} {/* 다크모드: 달, 라이트모드: 해 */}
        </button>
      </div>

      {/* 도움말 모달 */}
      <Modal isOpen={isHelpOpen} onClose={() => setHelpOpen(false)}>
        <h2 className="text-xl font-bold mb-3">도움말</h2>
        <p className="leading-relaxed">
          도움말을 입력하세요.
        </p>
      </Modal>

      {/* 로그인 모달 */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setLoginOpen(false)}
        onSignupClick={() => {
          setLoginOpen(false);
          setSignupOpen(true);
        }}
      />

      {/* 회원가입 모달 */}
      <SignupModal
        isOpen={isSignupOpen}
        onClose={() => setSignupOpen(false)}
      />

      {/* 비밀번호 찾기 모달 */}
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
      />
    </header>
  );
}
