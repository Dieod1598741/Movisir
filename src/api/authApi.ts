// [용도] 인증 관련 API 함수 정의
// [사용법] import { login, signup, logout, getCurrentUser } from "./authApi";

import axiosInstance from "./axiosInstance";
import type { LoginRequest, LoginResponse, User } from "./authApi.type";
import type { SignupRequest, SignupResponse } from "./authApi.type";

// ------------------------------
// 🔐 로그인
// ------------------------------
export const login = async (data: LoginRequest, rememberMe: boolean = true): Promise<LoginResponse> => {
    try {
        const response = await axiosInstance.post("/auth/login", {
            email: data.email,
            password: data.password,
        }, {
            skipErrorRedirect: true,
        } as any);

        const { accessToken, refreshToken, user } = response.data;

        // 토큰 저장 (rememberMe에 따라 localStorage 또는 sessionStorage)
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem("accessToken", accessToken);
        storage.setItem("refreshToken", refreshToken);
        storage.setItem("user", JSON.stringify(user));
        // 로그인 방식 저장 (나중에 확인용)
        storage.setItem("rememberMe", rememberMe ? "true" : "false");

        return {
            user,
            message: "로그인 성공",
        };
    } catch (error: any) {
        // 백엔드 에러 응답 구조: { detail: { error: "...", message: "..." } }
        const errorData = error?.response?.data;
        let msg = "로그인 중 오류가 발생했습니다";

        if (errorData) {
            // detail이 객체인 경우 (백엔드 FastAPI 표준)
            if (typeof errorData.detail === 'object' && errorData.detail?.message) {
                msg = errorData.detail.message;
            }
            // detail이 문자열인 경우
            else if (typeof errorData.detail === 'string') {
                msg = errorData.detail;
            }
            // message 필드가 있는 경우
            else if (errorData.message) {
                msg = errorData.message;
            }
        }

        throw new Error(msg);
    }
};

// ------------------------------
// 📝 회원가입
// ------------------------------
export const signup = async (data: SignupRequest): Promise<SignupResponse> => {
    try {
        // 백엔드에 실제 요청
        // skipErrorRedirect: true로 설정하여 400 에러 시 에러 페이지로 리다이렉트되지 않도록 함
        const response = await axiosInstance.post("/auth/signup", data, {
            skipErrorRedirect: true,
        } as any);

        const { user, message } = response.data;

        return {
            user,
            message,
        };
    } catch (error: any) {
        // 에러 메시지 우선순위: detail.message > message > detail (문자열) > 기본 메시지
        let msg = "회원가입 중 오류가 발생했습니다";

        if (error?.response?.data) {
            const errorData = error.response.data;

            // 중복 이메일 에러 처리 (일반적으로 400 에러)
            if (error.response.status === 400) {
                if (typeof errorData.detail === 'string' && errorData.detail.includes('already exists')) {
                    msg = "이미 가입된 이메일입니다.";
                } else if (typeof errorData.detail === 'string' && errorData.detail.includes('이미')) {
                    msg = errorData.detail;
                } else if (errorData.detail?.message) {
                    msg = errorData.detail.message;
                } else if (errorData.message) {
                    msg = errorData.message;
                } else if (typeof errorData.detail === 'string') {
                    msg = errorData.detail;
                }
            } else {
                msg = errorData.detail?.message || errorData.message || msg;
            }
        }

        throw new Error(msg);
    }
};

// ------------------------------
// 🚪 로그아웃
// ------------------------------
export const logout = async (): Promise<void> => {
    try {
        await axiosInstance.post("/auth/logout");
    } catch (error) {
        console.error("로그아웃 중 오류가 발생했습니다:", error);
    }

    // localStorage와 sessionStorage 모두에서 제거
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("rememberMe");

    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("rememberMe");
};

// ------------------------------
// 👤 현재 로그인된 사용자 가져오기
// ------------------------------
export const getCurrentUser = async () => {
    try {
        // 1. localStorage 또는 sessionStorage에서 user 확인
        let userStr = localStorage.getItem("user") || sessionStorage.getItem("user");
        let storage: Storage | null = null;

        if (localStorage.getItem("user")) {
            storage = localStorage;
        } else if (sessionStorage.getItem("user")) {
            storage = sessionStorage;
        }

        if (userStr && storage) {
            try {
                const user = JSON.parse(userStr);
                if (user && user.id) {
                    return user;
                }
            } catch (parseError) {
                console.error("user 파싱 오류:", parseError);
                storage?.removeItem("user");
            }
        }

        // 2. accessToken 확인 (localStorage 또는 sessionStorage)
        const accessToken = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
        if (accessToken) {
            const tokenStorage = localStorage.getItem("accessToken") ? localStorage : sessionStorage;
            try {
                const response = await axiosInstance.get("/auth/me");
                const user = response.data;
                tokenStorage.setItem("user", JSON.stringify(user));
                return user;
            } catch (error) {
                console.error("사용자 정보 가져오기 실패:", error);
            }
        }

        return null;
    } catch (error) {
        console.error("getCurrentUser 오류:", error);
        return null;
    }
};

// ------------------------------
// 🗑️ 회원 탈퇴 (백엔드 API 필요 시 연결)
// ------------------------------
export const deleteUser = async (userId: number): Promise<void> => {
    try {
        await axiosInstance.delete(`/users/${userId}`);
        logout();
    } catch (error) {
        throw new Error("회원 탈퇴 중 오류가 발생했습니다");
    }
};

// ------------------------------
// 📧 이메일 인증 코드 전송
// ------------------------------
export const sendVerificationCode = async (email: string): Promise<{ message: string; expiresIn: number }> => {
    try {
        // [변경 필요] 백엔드 연결 시 아래 주석을 해제하고 Mock 코드를 삭제하세요.
        // const response = await axiosInstance.post("/auth/signup/send-code", { email });
        // return {
        //     message: response.data.message,
        //     expiresIn: response.data.expiresIn,
        // };

        // ----------------------------------------------------------------
        // [삭제 예정] 프론트엔드 전용 Mock 응답 (실제 백엔드 연결 시 삭제)
        console.log(`[Mock] Sending verification code to: ${email}`);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    message: "인증 코드가 이메일로 전송되었습니다",
                    expiresIn: 300, // 5분
                });
            }, 1000);
        });
        // ----------------------------------------------------------------
    } catch (error: any) {
        const msg = error?.response?.data?.message || "인증 코드 전송 중 오류가 발생했습니다";
        throw new Error(msg);
    }
};

// ------------------------------
// ✅ 이메일 인증 코드 확인
// ------------------------------
export const verifyCode = async (email: string, code: string): Promise<{ valid: boolean; message: string }> => {
    try {
        // [변경 필요] 백엔드 연결 시 아래 주석을 해제하고 Mock 코드를 삭제하세요.
        // const response = await axiosInstance.post("/auth/signup/verify-code", { email, code });
        // return {
        //     valid: response.data.valid,
        //     message: response.data.message,
        // };

        // ----------------------------------------------------------------
        // [삭제 예정] 프론트엔드 전용 Mock 응답 (실제 백엔드 연결 시 삭제)
        console.log(`[Mock] Verifying code for: ${email}, code: ${code}`);
        return new Promise((resolve) => {
            setTimeout(() => {
                // Mock: 6자리 숫자 코드면 유효하다고 처리
                const isValid = /^\d{6}$/.test(code);
                resolve({
                    valid: isValid,
                    message: isValid ? "인증이 완료되었습니다" : "잘못된 인증 코드입니다",
                });
            }, 800);
        });
        // ----------------------------------------------------------------
    } catch (error: any) {
        const msg = error?.response?.data?.message || "인증 코드 확인 중 오류가 발생했습니다";
        throw new Error(msg);
    }
};

export const checkEmailDuplicate = async (email: string): Promise<{
    available: boolean;
    message: string;
}> => {
    try {
        const response = await axiosInstance.get(`/auth/check-email?email=${encodeURIComponent(email)}`);
        return {
            available: response.data.available,
            message: response.data.message,
        };
    } catch (error: any) {
        const msg = error?.response?.data?.message || '이메일 중복 확인 중 오류가 발생했습니다';
        throw new Error(msg);
    }
};

// ------------------------------
// 👤 닉네임 중복 확인
// ------------------------------
export const checkNicknameDuplicate = async (nickname: string): Promise<{
    available: boolean;
    message: string;
}> => {
    try {
        const response = await axiosInstance.get(`/auth/check-nickname?nickname=${encodeURIComponent(nickname)}`);
        return {
            available: response.data.available,
            message: response.data.message,
        };
    } catch (error: any) {
        const msg = error?.response?.data?.message || '닉네임 중복 확인 중 오류가 발생했습니다';
        throw new Error(msg);
    }
};

// ------------------------------
// 💾 사용자 정보 저장 (로컬 스토리지 업데이트)
// ------------------------------
export const saveUser = (user: Omit<User, 'password'>, rememberMe: boolean = true): void => {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("user", JSON.stringify(user));
    storage.setItem("rememberMe", rememberMe ? "true" : "false");
};

