import { create } from 'zustand';

interface OnboardingState {
    ottList: string[];
    likedGenres: string[];  // 좋아하는 장르만 저장 (nope는 단순히 제외)
    preferenceVector: number[];
    skipped: boolean;

    // Actions
    toggleOTT: (platform: string) => void;
    addSwipe: (genre: string, liked: boolean) => void;
    computeVector: () => void;
    setSkipped: (value: boolean) => void;
    reset: () => void;
}

// Dummy genre mapping for vector calculation
const GENRE_INDEX_MAP: Record<string, number> = {
    'Action': 0,
    'Comedy': 1,
    'Drama': 2,
    'Sci-Fi': 3,
    'Horror': 4,
    'Romance': 5,
    'Thriller': 6,
    'Fantasy': 7,
    'Animation': 8,
    'Documentary': 9,
};

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
    likedGenres: [],
    preferenceVector: new Array(10).fill(0),
    ottList: [],
    skipped: false,

    addSwipe: (genre, liked) => {
        set((state) => {
            // liked=true인 경우에만 likedGenres에 추가
            // liked=false(nope)인 경우는 단순히 제외 (아무 것도 하지 않음)
            let newLiked = state.likedGenres;

            if (liked) {
                // 중복 확인: 이미 있는 장르면 추가하지 않음
                if (!state.likedGenres.includes(genre)) {
                    newLiked = [...state.likedGenres, genre];
                }
            }

            // Update vector: liked는 1, nope는 0 (기본값 유지)
            const newVector = [...state.preferenceVector];
            const index = GENRE_INDEX_MAP[genre];
            if (index !== undefined && liked) {
                newVector[index] = 1;  // liked만 1로 설정
            }
            // nope의 경우 0 유지 (별도 처리 안 함)

            return {
                likedGenres: newLiked,
                preferenceVector: newVector,
            };
        });
    },

    computeVector: () => {
        // Already computed in addSwipe, but keeping for interface compliance
        const { likedGenres } = get();
        const vector = new Array(10).fill(0);

        // liked된 장르만 1로 설정, nope는 0 유지
        likedGenres.forEach(g => {
            if (GENRE_INDEX_MAP[g] !== undefined) vector[GENRE_INDEX_MAP[g]] = 1;
        });

        set({ preferenceVector: vector });
    },

    toggleOTT: (platform) => {
        set((state) => {
            const isSelected = state.ottList.includes(platform);
            return {
                ottList: isSelected
                    ? state.ottList.filter((p) => p !== platform)
                    : [...state.ottList, platform],
            };
        });
    },

    setSkipped: (value) => {
        set({ skipped: value });
    },

    reset: () => {
        set({
            likedGenres: [],
            preferenceVector: new Array(10).fill(0),
            ottList: [],
            skipped: false,
        });
    }
}));

