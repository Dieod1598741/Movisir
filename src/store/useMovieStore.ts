import { create } from 'zustand';
import { type Movie } from '../api/movieApi.type';
import { getMovies } from '../api/movieApi';

interface Filters {
    time: string;
    genres: string[];
}

interface MovieState {
    filters: Filters;
    allMovies: Movie[];
    recommendedMovies: Movie[];
    popularMovies: Movie[];
    detailMovie: Movie | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    setTime: (time: string) => void;
    toggleGenre: (genre: string) => void;

    loadMovies: () => Promise<void>;
    loadRecommended: () => void;
    loadPopular: () => void;

    setDetailMovie: (movie: Movie | null) => void;
    resetFilters: () => void;
}

export const useMovieStore = create<MovieState>((set, get) => ({
    filters: {
        time: "00:00",
        genres: []
    },
    allMovies: [],
    recommendedMovies: [],
    popularMovies: [],
    detailMovie: null,
    isLoading: false,
    error: null,

    setTime: (time) => set((state) => ({ filters: { ...state.filters, time } })),

    toggleGenre: (genre) => set((state) => {
        const genres = state.filters.genres.includes(genre)
            ? state.filters.genres.filter(g => g !== genre)
            : [...state.filters.genres, genre];
        return { filters: { ...state.filters, genres } };
    }),

    loadMovies: async () => {
        set({ isLoading: true, error: null });
        try {
            const movies = await getMovies();
            set({ allMovies: movies, isLoading: false });
        } catch (error) {
            console.error("Failed to load movies:", error);
            set({ error: "Failed to load movies", isLoading: false });
        }
    },

    loadRecommended: () => {
        const { filters, allMovies } = get();
        // Simple filtering logic based on genres
        let recommended = allMovies.filter(movie => {
            // If genres selected, must match at least one
            if (filters.genres.length > 0) {
                const hasGenre = movie.genres.some((g: string) => filters.genres.includes(g));
                if (!hasGenre) return false;
            }

            return true;
        });

        // Shuffle and pick 3
        recommended = recommended.sort(() => 0.5 - Math.random()).slice(0, 3);
        set({ recommendedMovies: recommended });
    },

    loadPopular: () => {
        const { allMovies } = get();
        let popular = allMovies.filter(movie => movie.popular);

        // Shuffle and pick 3
        popular = popular.sort(() => 0.5 - Math.random()).slice(0, 3);
        set({ popularMovies: popular });
    },

    setDetailMovie: (movie) => set({ detailMovie: movie }),

    resetFilters: () => set({
        filters: {
            time: "00:00",
            genres: []
        }
    })
}));
