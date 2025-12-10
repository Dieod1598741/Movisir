// [용도] 애플리케이션의 모든 라우팅 정의
// [사용법] App.tsx에서 <AppRoutes />로 사용

import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from '../components/ProtectedRoute';

// Pages
import MainPage from '../pages/MainPage';
import MyPage from '../pages/MyPage';
import ChatbotPage from '../pages/ChatbotPage';
import Error400Page from '../pages/Error400Page';
import Error423Page from '../pages/Error423Page';
import Error500Page from '../pages/Error500Page';
import OTTSelectionPage from '../pages/OTTSelectionPage';
import SwipeMoviesPage from '../pages/SwipeMoviesPage';
import OnboardingCompletePage from '../pages/OnboardingCompletePage';



export default function AppRoutes() {
    return (
        <Routes>
            {/* 메인 레이아웃을 사용하는 라우트들 */}
            <Route element={<MainLayout />}>
                {/* URL: / - 메인 페이지 */}
                <Route path="/" element={<MainPage />} />

                {/* 보호된 라우트 - 로그인 필요 */}
                <Route element={<ProtectedRoute />}>
                    {/* URL: /mypage - 마이페이지 (모달 스타일) */}
                    <Route path="/mypage" element={<MyPage />} />
                </Route>
            </Route>
            {/* URL: /chatbot - 챗봇 추천 페이지 */}
            <Route path="/chatbot" element={<ChatbotPage />} />

            {/* Onboarding Flow */}
            <Route path="/onboarding/ott" element={<OTTSelectionPage />} />
            <Route path="/onboarding/swipe" element={<SwipeMoviesPage />} />
            <Route path="/onboarding/complete" element={<OnboardingCompletePage />} />

            {/* Signup Flow */}


            {/* Error pages */}
            <Route path="/error/400" element={<Error400Page />} />
            <Route path="/error/423" element={<Error423Page />} />
            <Route path="/error/500" element={<Error500Page />} />
        </Routes>
    );
}
