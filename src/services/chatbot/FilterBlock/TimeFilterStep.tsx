// [용도] Step 1 - Time Filter Component
// [사용법] <TimeFilterStep onNext={() => moveToNextStep()} />

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useMovieStore } from '../../../store/useMovieStore';

interface TimeFilterStepProps {
    onNext: () => void;
}

export default function TimeFilterStep({ onNext }: TimeFilterStepProps) {
    const { filters, setTime } = useMovieStore();
    const [sliderValue, setSliderValue] = useState(0);

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        setSliderValue(val);
        const hours = Math.floor(val);
        const minutes = (val % 1) * 60;
        const timeStr = `${hours.toString().padStart(2, '0')}:${minutes === 0 ? '00' : '30'}`;
        setTime(timeStr);
    };

    const hasTimeSelected = filters.time !== "00:00";

    return (
        <div className="space-y-4 sm:space-y-6 animate-slide-in-right">
            {/* Title */}
            <div className="text-center px-2">
                {/* <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-3 sm:mb-4">
                    <Clock className="text-white" size={24} />
                </div> */}
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-1.5 sm:mb-2">
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    얼마나 시간이 있으신가요?
                </p>
            </div>

            {/* Time Display */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center mx-2 sm:mx-0">
                <div className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                    {filters.time}
                </div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1.5 sm:mt-2">
                    {filters.time === "00:00" ? "시간을 선택해주세요" : "선택된 시간"}
                </p>
            </div>

            {/* Slider */}
            <div className="px-4">
                <input
                    type="range"
                    min="0"
                    max="12"
                    step="0.5"
                    value={sliderValue}
                    onChange={handleTimeChange}
                    className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2 px-2">
                    <span>0시간</span>
                    <span>6시간</span>
                    <span>12시간</span>
                </div>
            </div>

            {/* Next Button */}
            <button
                onClick={onNext}
                disabled={!hasTimeSelected}
                className={`
                    w-full py-3 sm:py-3.5 md:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base md:text-lg flex items-center justify-center gap-2
                    transition-all duration-300 transform
                    ${hasTimeSelected
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    }
                `}
            >
                다음 단계
                <ChevronRight size={20} className="sm:w-6 sm:h-6" />
            </button>
        </div>
    );
}
