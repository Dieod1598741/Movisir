// [용도] OTT 선택 추천 컴포넌트
// [사용법] <OTTSelection onBack={() => setView('main')} />

import { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import type { OTTPlatform } from '../myPage.types';
import { useAuth } from '../../../../app/providers/AuthContext';
import * as userApi from '../../../../api/userApi';

type OTTSelectionProps = {
    onBack: () => void;
};

export default function OTTSelection({ onBack }: OTTSelectionProps) {
    const { user, refreshUser } = useAuth();
    // 초기값을 빈 배열로 설정하고 useEffect에서 로드
    const [selectedOTT, setSelectedOTT] = useState<string[]>([]);

    useEffect(() => {
        if (user?.profile?.ottServices) {
            setSelectedOTT(user.profile.ottServices);
        }
    }, [user]);

    const availableOTT: OTTPlatform[] = [
        { id: 'netflix', name: 'Netflix' },
        { id: 'disney', name: 'Disney+' },
        { id: 'watcha', name: 'Watcha' },
        { id: 'wavve', name: 'Wavve' },
        { id: 'tving', name: 'Tving' },
        { id: 'coupang', name: 'Coupang Play' },
        { id: 'apple', name: 'Apple TV+' },
    ];

    const handleToggleOTT = (ottName: string) => {
        const newSelectedOTT = selectedOTT.includes(ottName)
            ? selectedOTT.filter(ott => ott !== ottName)
            : [...selectedOTT, ottName];

        setSelectedOTT(newSelectedOTT);
    };

    const handleSave = async () => {
        if (!user) return;

        try {
            // 기존 프로필 정보를 유지하면서 ottServices만 업데이트
            const updatedProfile = {
                ...user.profile,
                ottServices: selectedOTT
            };

            await userApi.patchUser(user.id, { profile: updatedProfile } as any);
            await refreshUser();
            alert('OTT 선택이 저장되었습니다!');
        } catch (error) {
            console.error('OTT 저장 실패:', error);
            alert('OTT 저장에 실패했습니다.');
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* 헤더 */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h2 className="text-xl font-bold text-white">OTT 선택 추천</h2>
                </div>
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                    <Save size={18} />
                    저장
                </button>
            </div>

            {/* 내용 */}
            <div className="flex-1 overflow-y-auto p-4">
                <p className="text-gray-400 text-sm mb-4">
                    구독 중인 OTT 플랫폼을 선택하면 맞춤 영화를 추천해드립니다.
                </p>

                <div className="space-y-2">
                    {availableOTT.map((ott) => (
                        <label
                            key={ott.id}
                            className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
                        >
                            <input
                                type="checkbox"
                                checked={selectedOTT.includes(ott.name)}
                                onChange={() => handleToggleOTT(ott.name)}
                                className="w-5 h-5 rounded border-gray-400 text-blue-500 focus:ring-blue-500"
                            />
                            <span className="text-white font-medium">{ott.name}</span>
                        </label>
                    ))}
                </div>

                {selectedOTT.length > 0 && (
                    <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <h4 className="text-blue-400 font-medium mb-2">선택된 OTT</h4>
                        <div className="flex flex-wrap gap-2">
                            {selectedOTT.map((ott) => (
                                <span
                                    key={ott}
                                    className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm"
                                >
                                    {ott}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
