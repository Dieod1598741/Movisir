import axios from "axios";

const API_BASE_URL =
    process.env.NODE_ENV === "development"
        ? "http://10.0.1.117"  // [변경 필요] 백엔드 도메인 서버로 변경필요
        : "https://api.movisr.com"; // [변경 필요] 실제 배포된 백엔드 서버 주소

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // 쿠키 기반 인증 지원
    headers: {
        "Content-Type": "application/json",
    },
});

// ------------------------------
// Request Interceptor: 자동으로 accessToken 첨부
// ------------------------------
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("accessToken");

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ------------------------------
// Response Interceptor: 401 처리 및 토큰 갱신
// ------------------------------
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 401 에러이고 아직 재시도하지 않은 경우
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // 이미 토큰 갱신 중이면 대기열에 추가
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return axiosInstance(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem("refreshToken");

            if (!refreshToken) {
                // Refresh token이 없으면 로그아웃 처리
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("user");
                window.location.href = "/";
                return Promise.reject(error);
            }

            try {
                // 토큰 갱신 시도
                const response = await axios.post(
                    `${API_BASE_URL}/auth/refresh`,
                    { refreshToken },
                    { withCredentials: true }
                );

                const { accessToken: newAccessToken } = response.data;

                // 새 토큰 저장
                localStorage.setItem("accessToken", newAccessToken);

                // 대기열의 요청들 처리
                processQueue(null, newAccessToken);

                // 원래 요청 재시도
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // 토큰 갱신 실패 시 로그아웃
                processQueue(refreshError, null);
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("user");
                window.location.href = "/";
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // [New] Error Page Redirection
        const status = error.response?.status;
        const currentPath = window.location.pathname;

        if (status === 400 && currentPath !== "/error/400") {
            window.location.href = "/error/400";
            return Promise.reject(error);
        }

        if (status === 423 && currentPath !== "/error/423") {
            window.location.href = "/error/423";
            return Promise.reject(error);
        }

        if (status === 500 && currentPath !== "/error/500") {
            window.location.href = "/error/500";
            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
