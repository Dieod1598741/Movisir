// [용도] 온보딩 완료 및 데이터 제출 페이지
// [사용법] /onboarding/complete 라우트에서 사용

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboardingStore } from "../store/onboardingStore";
import { submitOnboarding } from "../api/onboardingApi";
import { getCurrentUser } from "../api/authApi";

export default function OnboardingCompletePage() {
    const navigate = useNavigate();
    const { ottList, likedGenres, dislikedGenres, preferenceVector, reset } = useOnboardingStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError("");

        try {
            // [현재 상태] authApi.ts에서 getCurrentUser가 비동기(async)로 변경되었으므로 await 필수
            const user = await getCurrentUser();

            if (!user) {
                throw new Error("사용자 정보를 찾을 수 없습니다");
            }

            // 1) 백엔드에 온보딩 데이터 전송 (db.json 업데이트)
            const response = await submitOnboarding({
                userId: user.id,
                ott: ottList,
                likedGenres,
                dislikedGenres,
                preferenceVector,
            });

            // -----------------------------------------------------------
            // [백엔드 연동 가이드]
            // 실제 운영 서버에서는 응답으로 최신 유저 정보를 받아와서
            // 로컬 스토리지의 유저 정보를 갱신해야 합니다.
            // 아래 코드는 현재 Mock Server(server.cjs) 기준입니다.
            // -----------------------------------------------------------

            // 2) 최신 유저 정보 확인 (Mock 서버에서 user 객체를 반환하도록 수정됨)
            const updatedUser = response.user; // server.cjs 수정으로 user 필드 추가됨

            if (updatedUser) {
                // 3) 프론트 로컬 스토리지 업데이트
                // (실제 백엔드: 응답받은 최신 유저 정보로 덮어쓰기)
                localStorage.setItem("user", JSON.stringify(updatedUser));

                // 필요하다면 userId도 갱신 (보통은 변하지 않음)
                // localStorage.setItem("userId", updatedUser.id); 
            }

            // 4) 온보딩 스토어 초기화
            reset();

            // 5) 메인 페이지로 이동
            navigate("/"); // '/main' 대신 '/' 루트 경로 사용 권장 (라우터 설정에 따라 다름)

        } catch (err: any) {
            console.error(err);
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
                                {likedGenres.map((genre) => (
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

                    {/* 싫어하는 장르 */}
                    <div className="bg-gray-900/50 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                            💔 싫어하는 장르
                        </h2>
                        {dislikedGenres.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {dislikedGenres.map((genre) => (
                                    <span
                                        key={genre}
                                        className="px-4 py-2 bg-red-600/50 text-white rounded-lg"
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
