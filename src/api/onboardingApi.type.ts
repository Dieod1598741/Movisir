// [용도] 온보딩 관련 API 타입 정의
// [사용법] import { VerificationRequest, OnboardingMovie } from "./onboardingApi.type";

// ------------------------------
// 이메일 인증 관련 타입
// ------------------------------
export interface VerificationRequest {
    email: string;
    code: string;
}

export interface VerificationResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        id: number;
        email: string;
        name: string;
    };
    message: string;
}

// ------------------------------
// 온보딩 영화 카드 타입
// ------------------------------
export interface OnboardingMovie {
    id: number;
    title: string;
    genres: string[];
    posterUrl?: string;
    popularity: number;
}

// ------------------------------
// 온보딩 완료 요청/응답 타입
// ------------------------------
export interface OnboardingCompleteRequest {
    userId: number;
    ott: string[];
    likedGenres: string[];
    dislikedGenres: string[];
    preferenceVector: number[];
}

import type { User } from './authApi.type';

export interface OnboardingCompleteResponse {
    onboarding_completed: boolean;
    message: string;
    user: User;
}
