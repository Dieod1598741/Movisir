import { create } from 'zustand';

interface OnboardingState {
    ottList: string[];
    likedGenres: string[];
    dislikedGenres: string[];
    preferenceVector: number[];

    // Actions
    toggleOTT: (platform: string) => void;
    addSwipe: (genre: string, liked: boolean) => void;
    computeVector: () => void;
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
    dislikedGenres: [],
    preferenceVector: new Array(10).fill(0),
    ottList: [],

    addSwipe: (genre, liked) => {
        set((state) => {
            const newLiked = liked
                ? [...state.likedGenres, genre]
                : state.likedGenres;
            const newDisliked = !liked
                ? [...state.dislikedGenres, genre]
                : state.dislikedGenres;

            // Update vector immediately
            const newVector = [...state.preferenceVector];
            const index = GENRE_INDEX_MAP[genre];
            if (index !== undefined) {
                newVector[index] = liked ? 1 : -1;
            }

            return {
                likedGenres: newLiked,
                dislikedGenres: newDisliked,
                preferenceVector: newVector,
            };
        });
    },

    computeVector: () => {
        // Already computed in addSwipe, but keeping for interface compliance
        const { likedGenres, dislikedGenres } = get();
        const vector = new Array(10).fill(0);

        likedGenres.forEach(g => {
            if (GENRE_INDEX_MAP[g] !== undefined) vector[GENRE_INDEX_MAP[g]] = 1;
        });

        dislikedGenres.forEach(g => {
            if (GENRE_INDEX_MAP[g] !== undefined) vector[GENRE_INDEX_MAP[g]] = -1;
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

    reset: () => {
        set({
            likedGenres: [],
            dislikedGenres: [],
            preferenceVector: new Array(10).fill(0),
            ottList: [],
        });
    }
}));

