import { useState, useEffect } from 'react';
import type { ChatbotPanelProps } from "./chatbot.types";
import ChatMessageList, { type Message } from './ChatMessageList';
import FilterChatBlock from '../FilterBlock/FilterChatBlock';
import MovieDetailModal from '../MovieDetailModal/MovieDetailModal';
import MovieCard from './MovieCard';
import { useMovieStore } from '../../../store/useMovieStore';

export default function ChatbotPanel({ isOpen, onClose }: ChatbotPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasRecommended, setHasRecommended] = useState(false);  // 추천 완료 플래그
  const { loadRecommended } = useMovieStore();

  // 챗봇이 열릴 때 초기 메시지 표시
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initialize messages when panel opens for the first time
      const initialMessages: Message[] = [
        {
          id: '1',
          type: 'bot',
          content: '영화 추천을 받으시려면 아래 필터를 선택하세요!'
        },
        {
          id: '2',
          type: 'bot',
          content: <FilterChatBlock onApply={handleApplyFilters} />
        }
      ];
      setMessages(initialMessages);
    }
  }, [isOpen]);

  // 챗봇이 닫힐 때 모든 상태 초기화
  useEffect(() => {
    if (!isOpen) {
      setMessages([]);
      setHasRecommended(false);
      console.log('🔄 챗봇 닫힘 - 상태 초기화 완료');
    }
  }, [isOpen]);

  const handleApplyFilters = () => {
    console.log('=== handleApplyFilters 호출 ===');

    // 이미 추천했으면 무시 (중복 방지)
    if (hasRecommended) {
      console.log('⚠️ 이미 추천을 받았습니다. 다시 추천받으려면 챗봇을 닫고 다시 열어주세요.');
      return;
    }

    // Load recommendations (popular 데이터는 loadRecommended에서 함께 로드됨)
    loadRecommended();
    setHasRecommended(true);

    // 필터 메시지를 제거하고 결과만 표시 (첫 인사 메시지는 유지)
    setMessages([
      {
        id: '1',
        type: 'bot',
        content: '영화 추천을 받으시려면 아래 필터를 선택하세요!'
      },
      {
        id: Date.now().toString(),
        type: 'bot',
        content: '추천 결과는 다음과 같습니다!'
      },
      {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: (
          <div className="w-full">
            <h3 className="text-sm font-bold text-gray-500 mb-2">Recommended for You</h3>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <RecommendedList />
            </div>

            <h3 className="text-sm font-bold text-gray-500 mb-2">Popular Now</h3>
            <div className="grid grid-cols-3 gap-2">
              <PopularList />
            </div>
          </div>
        )
      },
      {
        id: (Date.now() + 2).toString(),
        type: 'bot',
        content: '💡 다시 추천받으려면 챗봇을 닫고 다시 열어주세요!'
      }
    ]);
  };

  // 패널이 닫혀있을 때는 렌더링하지 않음 (DOM에서 제거)
  if (!isOpen) return null;

  return (
    <div
      // [스타일 수정 가이드]
      // 1. 패널 위치 및 크기
      // fixed: 화면에 고정
      // bottom-5 left-5: 모바일에서 왼쪽 하단 (5px 여백)
      // sm:left-1/2 sm:-translate-x-1/2: 태블릿 이상에서 가로 중앙 정렬
      // w-full sm:w-[20em] lg:w-[32em]: 반응형 너비
      // max-w-[calc(100%-2.5rem)]: 모바일에서 좌우 여백 확보
      // h-[30em]: 패널 고정 높이 (약 480px)
      //
      // 2. 배경 및 테두리 디자인 (채팅 UI 스타일)
      // bg-white dark:bg-gray-800: 배경색 (라이트/다크 모드)
      // border-2: 2px 테두리
      // border-gray-900 dark:border-gray-600: 테두리 색상
      // rounded-[20px]: 둥근 모서리 (20px)
      //
      // 3. 애니메이션 (자연스러운 등장)
      // animate-panel-appear: 커스텀 애니메이션 (scale + opacity)
      // transition-all duration-300: 다른 속성 변경 시 0.3초 전환
      className="
        fixed bottom-5 left-5
        sm:left-1/2 sm:-translate-x-1/2
        w-full sm:w-[20em] lg:w-[32em]
        max-w-[calc(100%-2.5rem)]
        h-[30em]
        bg-white dark:bg-gray-800
        border-2 border-gray-900 dark:border-gray-600
        rounded-[20px]
        overflow-hidden
        z-panel
        flex flex-col
        animate-panel-appear
        shadow-[5px_5px_0px_rgba(0,0,0,0.8)]
    dark:shadow-[5px_5px_0px_rgba(96,165,250,1)]
      "
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b-2 border-gray-900 dark:border-gray-600">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white capitalize text-center flex-1">
          무비서
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <ChatMessageList messages={messages} />
      </div>

      <MovieDetailModal />
    </div>
  );
}

// Helper components to subscribe to store changes within the chat bubble
function RecommendedList() {
  const { recommendedMovies, setDetailMovie, removeRecommendedMovie, userId } = useMovieStore();

  if (recommendedMovies.length === 0) return <p className="text-xs text-gray-400 col-span-3">No matches found.</p>;

  // localStorage에서 봤어요 목록 가져오기
  const getWatchedMovies = (): number[] => {
    if (!userId) return [];
    const stored = localStorage.getItem(`watchedMovies_${userId}`);
    return stored ? JSON.parse(stored) : [];
  };

  // localStorage에 봤어요 목록 저장하기
  const saveWatchedMovie = (movieId: number) => {
    if (!userId) return;
    const watched = getWatchedMovies();
    if (!watched.includes(movieId)) {
      watched.push(movieId);
      localStorage.setItem(`watchedMovies_${userId}`, JSON.stringify(watched));
      console.log('✅ 봤어요 리스트에 추가:', movieId);
    }
  };

  const handleAddToWatched = (movieId: number) => {
    saveWatchedMovie(movieId);
    // TODO: 추후 백엔드 API 호출로 교체
    // await addWatchHistory(userId, movieId, 0);
  };

  const watchedMovieIds = getWatchedMovies();

  return (
    <>
      {recommendedMovies.map(movie => (
        <MovieCard
          key={movie.id}
          movie={{
            ...movie,
            watched: watchedMovieIds.includes(movie.id)  // localStorage 기반으로 watched 설정
          }}
          onClick={() => setDetailMovie(movie)}
          onReRecommend={() => removeRecommendedMovie(movie.id)}
          onAddToWatched={() => handleAddToWatched(movie.id)}
          showReRecommend={true}
        />
      ))}
    </>
  );
}

function PopularList() {
  const { popularMovies, setDetailMovie } = useMovieStore();

  if (popularMovies.length === 0) return <p className="text-xs text-gray-400 col-span-3">No popular movies found.</p>;

  return (
    <>
      {popularMovies.map(movie => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onClick={() => setDetailMovie(movie)}
          showReRecommend={false}
        />
      ))}
    </>
  );
}
