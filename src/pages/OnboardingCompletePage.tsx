// [용도] 온보딩 완료 및 데이터 제출 페이지
// [사용법] /onboarding/complete 라우트에서 사용

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboardingStore } from "../store/onboardingStore";
import { submitOnboarding, skipOnboarding } from "../api/onboardingApi";
import { getCurrentUser } from "../api/authApi";
import { useAuth } from "../app/providers/AuthContext";

export default function OnboardingCompletePage() {
    const navigate = useNavigate();
    const { loadUserFromStorage } = useAuth();
    const { ottList, likedGenres, preferenceVector, skipped, reset } = useOnboardingStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError("");

        try {
            // 디버깅: localStorage 확인
            console.log("=== 온보딩 완료 디버깅 ===");
            console.log("localStorage user:", localStorage.getItem("user"));
            console.log("localStorage accessToken:", localStorage.getItem("accessToken"));
            console.log("skipped 상태:", skipped);

            // [현재 상태] authApi.ts에서 getCurrentUser가 비동기(async)로 변경되었으므로 await 필수
            const user = await getCurrentUser();
            console.log("getCurrentUser 결과:", user);

            if (!user) {
                throw new Error("사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.");
            }

            let response;

            // skipped 상태에 따라 다른 API 호출
            if (skipped) {
                console.log("온보딩 건너뛰기 API 호출");
                response = await skipOnboarding(user.id);
            } else {
                // 중복 제거: 같은 장르가 여러 번 포함될 수 있으므로 Set으로 중복 제거
                const uniqueLikedGenres = Array.from(new Set(likedGenres));

                console.log("온보딩 데이터 전송:", {
                    userId: user.id,
                    ott: ottList,
                    likedGenres: uniqueLikedGenres,
                    originalCount: likedGenres.length,
                    uniqueCount: uniqueLikedGenres.length,
                    preferenceVector,
                });

                // 1) 백엔드에 온보딩 데이터 전송 (dislikedGenres 제거, 중복 제거된 장르 전송)
                response = await submitOnboarding({
                    userId: user.id,
                    ott: ottList,
                    likedGenres: uniqueLikedGenres,  // 중복 제거된 장르
                    preferenceVector,
                });
            }

            console.log("응답:", response);

            // 2) 최신 유저 정보 확인
            const updatedUser = response.user;

            if (updatedUser) {
                // 3) 프론트 로컬 스토리지 업데이트
                localStorage.setItem("user", JSON.stringify(updatedUser));
                console.log("localStorage 업데이트 완료");

                // ✅ AuthContext의 user 상태도 업데이트하여 메인 페이지에서 로그인 상태 즉시 반영
                await loadUserFromStorage();
            }

            // 4) 온보딩 스토어 초기화
            reset();

            // 5) 메인 페이지로 이동
            navigate("/");

        } catch (err: any) {
            console.error("온보딩 완료 오류:", err);
            setError(err.message || "온보딩 완료 중 오류가 발생했습니다");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700">
                {/* 헤더 */}
                <div className="text-center mb-8">
                    <div className="text-7xl mb-4">🎉</div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        거의 다 왔어요!
                    </h1>
                    <p className="text-gray-300 text-lg">
                        선택하신 정보를 확인하고 완료해주세요
                    </p>
                </div>

                {/* 요약 정보 */}
                <div className="space-y-6 mb-8">
                    {/* OTT 플랫폼 */}
                    <div className="bg-gray-900/50 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                            📺 선택한 OTT 플랫폼
                        </h2>
                        {ottList.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {ottList.map((ott) => (
                                    <span
                                        key={ott}
                                        className="px-4 py-2 bg-blue-600/50 text-white rounded-lg capitalize"
                                    >
                                        {ott}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400">선택한 플랫폼이 없습니다</p>
                        )}
                    </div>

                    {/* 좋아하는 장르 */}
                    <div className="bg-gray-900/50 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                            ❤️ 좋아하는 장르
                        </h2>
                        {likedGenres.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {/* 중복 제거하여 표시 */}
                                {Array.from(new Set(likedGenres)).map((genre) => (
                                    <span
                                        key={genre}
                                        className="px-4 py-2 bg-green-600/50 text-white rounded-lg"
                                    >
                                        {genre}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400">아직 선택한 장르가 없습니다</p>
                        )}
                    </div>
                </div>

                {/* 에러 메시지 */}
                {error && (
                    <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
                        <p className="text-red-300 text-center">{error}</p>
                    </div>
                )}

                {/* 버튼 */}
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate("/onboarding/swipe")}
                        className="flex-1 py-4 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition-colors"
                    >
                        다시 선택하기
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "처리 중..." : "완료하기 🚀"}
                    </button>
                </div>
            </div>
        </div>
    );
}
