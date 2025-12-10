// [용도] 인증 관련 API 함수 정의
// [사용법] import { login, signup, logout, getCurrentUser } from "./authApi";

import axiosInstance from "./axiosInstance";
import type { LoginRequest, LoginResponse, User } from "./authApi.type";
import type { SignupRequest, SignupResponse } from "./authApi.type";

// ------------------------------
// 🔐 로그인
// ------------------------------
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
    try {
        const response = await axiosInstance.post("/auth/login", {
            email: data.email,
            password: data.password,
        });

        const { accessToken, refreshToken, user } = response.data;

        // 토큰 저장
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));

        return {
            user,
            message: "로그인 성공",
        };
    } catch (error: any) {
        const msg =
            error?.response?.data?.message ||
            "로그인 중 오류가 발생했습니다";

        throw new Error(msg);
    }
};

// ------------------------------
// 📝 회원가입
// ------------------------------
export const signup = async (data: SignupRequest): Promise<SignupResponse> => {
    try {
        // 백엔드(server.cjs)에 실제 요청
        const response = await axiosInstance.post("/auth/signup/request", data);

        return {
            user: {
                id: response.data.userId,
                email: data.email,
                name: data.name,
                createdAt: new Date().toISOString(),
                profile: {
                    favoriteGenres: [],
                    ottServices: []
                }
            },
            message: "회원가입 요청 성공",
        };
    } catch (error: any) {
        const msg =
            error?.response?.data?.message ||
            "회원가입 중 오류가 발생했습니다";

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

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
};

// ------------------------------
// 👤 현재 로그인된 사용자 가져오기
// ------------------------------
export const getCurrentUser = async () => {
    try {
        // 1. 저장된 user 객체 확인 (우선순위 높음)
        const userStr = localStorage.getItem("user");
        if (userStr) {
            const user = JSON.parse(userStr);
            if (user && user.id) {
                // Mock 서버인 경우 항상 최신 정보를 가져오기 위해 API 호출 시도
                // (실제 앱에서는 로컬 정보만 써도 되지만, 여기서는 DB 동기화 확인용)
                try {
                    // [변경 필요] 실제 백엔드 API 경로로 변경하세요 (예: /users/me 또는 /auth/me)
                    // 현재는 json-server 구조(users/{id})에 맞춰져 있습니다.
                    const res = await axiosInstance.get(`http://localhost:3001/users/${user.id}`);
                    return res.data;
                } catch (e) {
                    // API 호출 실패 시 로컬 정보라도 반환
                    return user;
                }
            }
        }

        // 2. 과거 방식 호환 (userId만 저장된 경우)
        const userId = localStorage.getItem("userId");
        if (!userId) return null;

        const res = await axiosInstance.get(`http://localhost:3001/users/${userId}`);
        return res.data;
    } catch {
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

// ------------------------------
// 💾 사용자 정보 저장 (로컬 스토리지 업데이트)
// ------------------------------
export const saveUser = (user: Omit<User, 'password'>): void => {
    localStorage.setItem("user", JSON.stringify(user));
};

