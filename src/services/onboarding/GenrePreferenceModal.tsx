import { useState, useEffect } from 'react';
import { X, Heart } from 'lucide-react';
import TinderCard from './TinderCard';
import { useOnboardingStore } from '../../store/onboardingStore';

interface GenrePreferenceModalProps {
    isOpen: boolean;
    onComplete: () => void;
}

// Dummy data
const MOVIES = [
    { id: 1, title: 'Inception', genre: 'Sci-Fi', image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=80' },
    { id: 2, title: 'The Notebook', genre: 'Romance', image: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=500&q=80' },
    { id: 3, title: 'The Dark Knight', genre: 'Action', image: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cd4?w=500&q=80' },
    { id: 4, title: 'Toy Story', genre: 'Animation', image: 'https://images.unsplash.com/photo-1535572290543-523a14f4230e?w=500&q=80' },
    { id: 5, title: 'The Conjuring', genre: 'Horror', image: 'https://images.unsplash.com/photo-1505635552518-3448ff116af3?w=500&q=80' },
    { id: 6, title: 'Interstellar', genre: 'Sci-Fi', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&q=80' },
    { id: 7, title: 'La La Land', genre: 'Romance', image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500&q=80' },
    { id: 8, title: 'Avengers', genre: 'Action', image: 'https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=500&q=80' },
    { id: 9, title: 'Coco', genre: 'Animation', image: 'https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=500&q=80' },
    { id: 10, title: 'Get Out', genre: 'Thriller', image: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=500&q=80' },
];

export default function GenrePreferenceModal({ isOpen, onComplete }: GenrePreferenceModalProps) {
    const [currentIndex, setCurrentIndex] = useState(MOVIES.length - 1);
    const addSwipe = useOnboardingStore((state) => state.addSwipe);

    useEffect(() => {
        if (currentIndex < 0) {
            setTimeout(onComplete, 500); // Wait for last animation
        }
    }, [currentIndex, onComplete]);

    const handleSwipe = (direction: 'left' | 'right') => {
        if (currentIndex >= 0) {
            const movie = MOVIES[currentIndex];
            addSwipe(movie.genre, direction === 'right');
            setCurrentIndex((prev) => prev - 1);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 z-modal flex items-center justify-center p-4">
            <div className="w-full max-w-md h-[700px] flex flex-col items-center relative">
                {/* Header */}
                <div className="text-center mb-8 z-deco">
                    <h2 className="text-3xl font-bold text-white mb-2">영화 취향 분석</h2>
                    <p className="text-gray-300">좋아하면 오른쪽, 싫으면 왼쪽으로 넘겨주세요</p>
                    <p className="text-sm text-gray-400 mt-2">
                        {Math.max(0, MOVIES.length - 1 - currentIndex)} / {MOVIES.length}
                    </p>
                </div>

                {/* Card Stack */}
                <div className="relative w-full flex-1 flex justify-center items-center">
                    {MOVIES.map((movie, index) => (
                        index <= currentIndex && (
                            <TinderCard
                                key={movie.id}
                                movie={movie}
                                index={index}
                                onSwipe={handleSwipe}
                            />
                        )
                    ))}

                    {currentIndex < 0 && (
                        <div className="text-white text-xl font-medium animate-pulse">
                            분석 완료! 다음 단계로 이동합니다...
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="flex gap-8 mt-8 z-deco">
                    <button
                        onClick={() => handleSwipe('left')}
                        className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform text-red-500"
                        disabled={currentIndex < 0}
                    >
                        <X size={32} />
                    </button>
                    <button
                        onClick={() => handleSwipe('right')}
                        className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform text-green-500"
                        disabled={currentIndex < 0}
                    >
                        <Heart size={32} fill="currentColor" />
                    </button>
                </div>
            </div>
        </div>
    );
}
