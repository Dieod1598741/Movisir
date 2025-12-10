// [용도] 인증 관련 API 타입 정의
// [사용법] import { User, LoginRequest, SignupRequest } from "./authApi.type";

export interface User {
    id: number;
    email: string;
    password: string;
    name: string;
    createdAt: string;
    profile: {
        favoriteGenres: string[];
        ottServices: string[];
    };
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    user: Omit<User, 'password'>;
    message: string;
}

export interface SignupRequest {
    email: string;
    password: string;
    name: string;
    verificationCode?: string; // 이메일 인증 코드 (선택적)
}

export interface SignupResponse {
    user: Omit<User, 'password'>;
    message: string;
}

// 이메일 인증 코드 전송 요청
export interface SendCodeRequest {
    email: string;
}

export interface SendCodeResponse {
    message: string;
    expiresIn: number; // 초 단위 (예: 300 = 5분)
}

// 이메일 인증 코드 확인 요청
export interface VerifyCodeRequest {
    email: string;
    code: string;
}

export interface VerifyCodeResponse {
    valid: boolean;
    message: string;
}
