import { Check } from 'lucide-react';
import { useOnboardingStore } from '../../store/onboardingStore';

interface OTTSelectionModalProps {
    isOpen: boolean;
    onFinish: () => void;
}

const OTT_PLATFORMS = [
    { id: 'netflix', name: 'Netflix', color: 'bg-red-600' },
    { id: 'disney', name: 'Disney+', color: 'bg-blue-900' },
    { id: 'prime', name: 'Prime Video', color: 'bg-blue-500' },
    { id: 'wavve', name: 'Wavve', color: 'bg-blue-400' },
    { id: 'tving', name: 'Tving', color: 'bg-red-500' },
    { id: 'coupang', name: 'Coupang Play', color: 'bg-blue-800' },
    { id: 'apple', name: 'Apple TV+', color: 'bg-gray-900' },
    { id: 'watcha', name: 'Watcha', color: 'bg-pink-500' },
];

export default function OTTSelectionModal({ isOpen, onFinish }: OTTSelectionModalProps) {
    const { ottList, toggleOTT } = useOnboardingStore();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 z-modal flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-800 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        구독 중인 OTT 서비스를 선택해주세요
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        선택하신 서비스에 맞춰 영화를 추천해드립니다
                    </p>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {OTT_PLATFORMS.map((platform) => {
                            const isSelected = ottList.includes(platform.id);
                            return (
                                <button
                                    key={platform.id}
                                    onClick={() => toggleOTT(platform.id)}
                                    className={`
                    relative aspect-square rounded-xl flex items-center justify-center p-4 transition-all duration-200
                    ${isSelected
                                            ? 'ring-4 ring-blue-500 scale-105 shadow-lg'
                                            : 'hover:scale-105 hover:shadow-md opacity-80 hover:opacity-100'
                                        }
                    ${platform.color}
                  `}
                                >
                                    <span className="text-white font-bold text-lg text-center break-words">
                                        {platform.name}
                                    </span>

                                    {isSelected && (
                                        <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm">
                                            <Check size={16} className="text-blue-600" />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                    <button
                        onClick={onFinish}
                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
                    >
                        완료하고 시작하기
                    </button>
                </div>
            </div>
        </div>
    );
}
