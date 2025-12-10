// [용도] OTT 플랫폼 선택 페이지
// [사용법] /onboarding/ott 라우트에서 사용

import { useNavigate } from "react-router-dom";
import { useOnboardingStore } from "../store/onboardingStore";

const OTT_PLATFORMS = [
    { id: "netflix", name: "Netflix", color: "from-red-600 to-red-700", emoji: "🎬" },
    { id: "disney", name: "Disney+", color: "from-blue-600 to-blue-700", emoji: "✨" },
    { id: "prime", name: "Prime Video", color: "from-cyan-600 to-cyan-700", emoji: "📺" },
    { id: "wavve", name: "Wavve", color: "from-yellow-600 to-yellow-700", emoji: "🌊" },
    { id: "tving", name: "TVING", color: "from-pink-600 to-pink-700", emoji: "💫" },
    { id: "watcha", name: "Watcha", color: "from-purple-600 to-purple-700", emoji: "🎭" },
    { id: "apple", name: "Apple TV+", color: "from-gray-600 to-gray-700", emoji: "🍎" },
    { id: "coupang", name: "Coupang Play", color: "from-orange-600 to-orange-700", emoji: "🚀" },
];

export default function OTTSelectionPage() {
    const navigate = useNavigate();
    const { ottList, toggleOTT } = useOnboardingStore();

    const handleNext = () => {
        navigate("/onboarding/swipe");
    };

    const handleSkip = () => {
        navigate("/onboarding/swipe");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full">
                {/* 헤더 */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        어떤 OTT를 사용하시나요? 🎯
                    </h1>
                    <p className="text-gray-300 text-lg">
                        맞춤 추천을 위해 사용 중인 플랫폼을 선택해주세요
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                        (건너뛰기도 가능해요!)
                    </p>
                </div>

                {/* OTT 카드 그리드 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {OTT_PLATFORMS.map((platform) => {
                        const isSelected = ottList.includes(platform.id);

                        return (
                            <button
                                key={platform.id}
                                onClick={() => toggleOTT(platform.id)}
                                className={`
                                    relative p-6 rounded-2xl border-2 transition-all duration-300
                                    ${isSelected
                                        ? `bg-gradient-to-br ${platform.color} border-white scale-105 shadow-2xl`
                                        : "bg-gray-800/50 border-gray-700 hover:border-gray-600 hover:scale-102"
                                    }
                                `}
                            >
                                {/* 체크 아이콘 */}
                                {isSelected && (
                                    <div className="absolute top-2 right-2 bg-white rounded-full p-1">
                                        <svg
                                            className="w-4 h-4 text-green-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={3}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                )}

                                {/* 이모지 */}
                                <div className="text-5xl mb-3">{platform.emoji}</div>

                                {/* 플랫폼 이름 */}
                                <div className="text-white font-bold text-lg">
                                    {platform.name}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* 선택 개수 표시 */}
                <div className="text-center mb-6">
                    <p className="text-gray-300">
                        선택된 플랫폼: <span className="text-white font-bold">{ottList.length}개</span>
                    </p>
                </div>

                {/* 버튼 */}
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={handleSkip}
                        className="px-8 py-3 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition-colors"
                    >
                        건너뛰기
                    </button>
                    <button
                        onClick={handleNext}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg"
                    >
                        다음 단계
                    </button>
                </div>
            </div>
        </div>
    );
}
