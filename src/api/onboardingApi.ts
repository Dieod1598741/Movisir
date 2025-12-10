// [용도] 온보딩 관련 API 함수 정의
// [사용법] import { verifyEmail, fetchOnboardingMovies, submitOnboarding } from "./onboardingApi";

import axiosInstance from "./axiosInstance";
import type {
    VerificationRequest,
    VerificationResponse,
    OnboardingMovie,
    OnboardingCompleteRequest,
    OnboardingCompleteResponse
} from "./onboardingApi.type";

// ------------------------------
// 📧 이메일 인증 코드 확인
// ------------------------------
export const verifyEmail = async (data: VerificationRequest): Promise<VerificationResponse> => {
    try {
        const response = await axiosInstance.post<VerificationResponse>("/auth/signup/confirm", data);

        const { accessToken, refreshToken, user } = response.data;

        // 토큰 저장
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));

        return response.data;
    } catch (error: any) {
        const msg =
            error?.response?.data?.message ||
            "인증 코드 확인 중 오류가 발생했습니다";

        throw new Error(msg);
    }
};

// ------------------------------
// 🎬 온보딩용 영화 목록 가져오기
// ------------------------------
export const fetchOnboardingMovies = async (limit: number = 10): Promise<OnboardingMovie[]> => {
    try {
        const response = await axiosInstance.get<OnboardingMovie[]>(
            `/movies/onboarding?limit=${limit}`
        );

        return response.data;
    } catch (error: any) {
        const msg =
            error?.response?.data?.message ||
            "영화 목록을 가져오는 중 오류가 발생했습니다";

        throw new Error(msg);
    }
};

// ------------------------------
// ✅ 온보딩 완료 데이터 제출
// ------------------------------
export const submitOnboarding = async (
    data: OnboardingCompleteRequest
): Promise<OnboardingCompleteResponse> => {
    try {
        const response = await axiosInstance.post<OnboardingCompleteResponse>(
            "/onboarding/complete",
            data
        );

        return response.data;
    } catch (error: any) {
        const msg =
            error?.response?.data?.message ||
            "온보딩 완료 중 오류가 발생했습니다";

        throw new Error(msg);
    }
};

// ------------------------------
// 🔄 인증 코드 재전송
// ------------------------------
export const resendVerificationCode = async (email: string): Promise<{ message: string }> => {
    try {
        const response = await axiosInstance.post<{ message: string }>(
            "/auth/signup/resend",
            { email }
        );

        return response.data;
    } catch (error: any) {
        const msg =
            error?.response?.data?.message ||
            "인증 코드 재전송 중 오류가 발생했습니다";

        throw new Error(msg);
    }
};
