// [용도] 챗봇 대화형 영화 추천 페이지
// [사용법] <Route path="/chatbot" element={<ChatbotPage />} />
// [수정 가이드]
//   - 대화 단계 수정: 58-97번 줄 ConversationStep 타입과 CONVERSATION_FLOW 상수
//   - 봇 응답 메시지: 195-270번 줄 handleBotResponse 함수
//   - Quick Reply 버튼: 202, 213, 221, 233번 줄 quickReplies 배열
//   - 자연어 파싱: 116-164번 줄 parseUserInput 함수
//   - 타이핑 애니메이션 시간: 186번 줄 setTimeout 시간 (현재 800ms)

import { useState, useEffect } from 'react';
import ChatMessageList, { type Message } from '../services/chatbot/components/ChatMessageList';
import ChatInput from '../services/chatbot/components/ChatInput';
import FilterSummary from '../services/chatbot/components/FilterSummary';
import FilterChatBlock from '../services/chatbot/FilterBlock/FilterChatBlock';
import MovieDetailModal from '../services/chatbot/MovieDetailModal/MovieDetailModal';
import MovieCard from '../services/chatbot/components/MovieCard';
import { useMovieStore } from '../store/useMovieStore';
import { useAuth } from '../app/providers/AuthContext';

// [타입] 대화 단계
// - greeting: 인사 및 시작
// - genre: 장르 선택
// - time: 시간 선택
// - confirm: 추천 조건 확인
// - result: 영화 추천 결과
// - complete: 대화 완료
type ConversationStep = 'greeting' | 'genre' | 'time' | 'confirm' | 'result' | 'complete';

// [상수] 장르 목록
const GENRES = ["액션", "SF", "드라마", "로맨스", "애니메이션", "공포", "스릴러", "모험", "범죄", "판타지", "가족"];

// [상수] 영어 ↔ 한글 장르 매핑
const GENRE_MAP: { [key: string]: string } = {
    "액션": "Action",
    "SF": "Sci-Fi",
    "드라마": "Drama",
    "로맨스": "Romance",
    "애니메이션": "Animation",
    "공포": "Horror",
    "스릴러": "Thriller",
    "모험": "Adventure",
    "범죄": "Crime",
    "판타지": "Fantasy",
    "가족": "Family"
};

// [상수] 시간 옵션
const TIME_OPTIONS = ["1시간", "2시간", "3시간", "상관없음"];

export default function ChatbotPage() {
    // [상태] 메시지 목록
    const [messages, setMessages] = useState<Message[]>([]);

    // [상태] 현재 대화 단계
    const [conversationStep, setConversationStep] = useState<ConversationStep>('greeting');

    // [상태] 봇이 타이핑 중인지
    const [isTyping, setIsTyping] = useState(false);

    // [상태] 선택된 장르들 (임시 저장)
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

    // [Auth] 사용자 인증 정보
    const { user } = useAuth();

    // [Zustand] 영화 스토어
    const { loadRecommended, setTime, toggleGenre, setUserId } = useMovieStore();

    // [Effect] userId 설정
    useEffect(() => {
        if (user?.id) {
            setUserId(user.id);
        }
    }, [user, setUserId]);

    // [Effect] 초기 인사 메시지
    useEffect(() => {
        // 페이지 로드 시 봇의 인사 메시지
        const initialMessages: Message[] = [
            {
                id: '1',
                type: 'bot',
                content: '안녕하세요! 👋\n어떤 영화를 찾고 계세요?',
                quickReplies: ['영화 추천받기', '인기 영화 보기']
            }
        ];
        setMessages(initialMessages);
    }, []);

    // [함수] 사용자 메시지 추가
    const addUserMessage = (text: string) => {
        const userMessage: Message = {
            id: Date.now().toString(),
            type: 'user',
            content: text
        };
        setMessages(prev => [...prev, userMessage]);
    };

    // [함수] 봇 메시지 추가
    const addBotMessage = (content: string | React.ReactNode, quickReplies?: string[]) => {
        const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            type: 'bot',
            content,
            quickReplies
        };
        setMessages(prev => [...prev, botMessage]);
    };

    // [함수] 자연어 파싱 - 사용자 입력에서 의도 파악
    // 키워드 매칭 방식으로 간단하게 구현 (추후 AI API로 대체 가능)
    const parseUserInput = (text: string): { intent: string; value?: string } => {
        const lowerText = text.toLowerCase();

        // 시간 관련 키워드
        if (lowerText.includes('1시간') || lowerText.includes('짧은') || lowerText.includes('60분')) {
            return { intent: 'time', value: '1시간' };
        }
        if (lowerText.includes('2시간') || lowerText.includes('120분')) {
            return { intent: 'time', value: '2시간' };
        }
        if (lowerText.includes('3시간') || lowerText.includes('긴') || lowerText.includes('180분')) {
            return { intent: 'time', value: '3시간' };
        }
        if (lowerText.includes('상관없') || lowerText.includes('아무') || lowerText.includes('다')) {
            return { intent: 'time', value: '상관없음' };
        }

        // 장르 관련 키워드
        for (const genre of GENRES) {
            if (lowerText.includes(genre.toLowerCase())) {
                return { intent: 'genre', value: genre };
            }
        }

        // 영어 장르 키워드
        if (lowerText.includes('action')) return { intent: 'genre', value: '액션' };
        if (lowerText.includes('sci-fi') || lowerText.includes('sf')) return { intent: 'genre', value: 'SF' };
        if (lowerText.includes('drama')) return { intent: 'genre', value: '드라마' };
        if (lowerText.includes('romance')) return { intent: 'genre', value: '로맨스' };
        if (lowerText.includes('animation')) return { intent: 'genre', value: '애니메이션' };
        if (lowerText.includes('horror')) return { intent: 'genre', value: '공포' };
        if (lowerText.includes('thriller')) return { intent: 'genre', value: '스릴러' };

        // 시작 관련 키워드
        if (lowerText.includes('추천') || lowerText.includes('찾') || lowerText.includes('보고싶')) {
            return { intent: 'start' };
        }

        // 확인/완료 관련 키워드
        if (lowerText.includes('네') || lowerText.includes('예') || lowerText.includes('좋') || lowerText.includes('응')) {
            return { intent: 'confirm' };
        }

        // 기본값
        return { intent: 'unknown' };
    };

    // [함수] 타이핑 애니메이션 후 봇 응답
    const showBotResponse = (content: string | React.ReactNode, quickReplies?: string[], callback?: () => void) => {
        setIsTyping(true);

        // 800ms 후 타이핑 종료하고 메시지 추가
        setTimeout(() => {
            setIsTyping(false);
            addBotMessage(content, quickReplies);
            if (callback) callback();
        }, 800);
    };

    // [함수] 단계별 봇 응답 처리
    const handleBotResponse = (step: ConversationStep, userInput?: string) => {
        switch (step) {
            case 'greeting':
                // 인사 → 장르 선택으로 이동
                showBotResponse(
                    '좋아요! 어떤 장르를 좋아하시나요? 😊\n여러 개 선택하셔도 됩니다!',
                    GENRES,
                    () => setConversationStep('genre')
                );
                break;

            case 'genre':
                // 장르 선택 → 시간 선택으로 이동
                if (selectedGenres.length > 0) {
                    showBotResponse(
                        `${selectedGenres.join(', ')} 장르 좋네요! 👍\n얼마나 시간이 있으세요?`,
                        TIME_OPTIONS,
                        () => setConversationStep('time')
                    );
                } else if (userInput) {
                    const parsed = parseUserInput(userInput);
                    if (parsed.intent === 'genre' && parsed.value) {
                        const newGenres = [parsed.value];
                        setSelectedGenres(newGenres);
                        showBotResponse(
                            `${parsed.value} 장르 좋아하시는군요! 👍\n얼마나 시간이 있으세요?`,
                            TIME_OPTIONS,
                            () => setConversationStep('time')
                        );
                    }
                }
                break;

            case 'time':
                // 시간 선택 → 영화 추천
                showBotResponse(
                    '완벽해요! 잠시만 기다려주세요... 🎬',
                    undefined,
                    () => {
                        // 필터 적용
                        selectedGenres.forEach(genre => {
                            const englishGenre = GENRE_MAP[genre];
                            if (englishGenre) toggleGenre(englishGenre);
                        });

                        // 영화 로드 (백엔드가 algorithmic + popular 함께 제공)
                        loadRecommended();

                        // 결과 표시
                        setTimeout(() => {
                            showBotResponse(
                                <ResultMovies />,
                                ['다시 추천받기', '고급 필터'],
                                () => setConversationStep('result')
                            );
                        }, 1000);
                    }
                );
                break;

            case 'result':
                // 결과 → 다시 시작 또는 종료
                if (userInput?.includes('다시')) {
                    setSelectedGenres([]);
                    setConversationStep('greeting');
                    showBotResponse(
                        '다시 추천받으시겠어요? 😊',
                        ['네', '아니요']
                    );
                } else if (userInput?.includes('고급')) {
                    showBotResponse(
                        <FilterChatBlock onApply={() => {
                            loadRecommended();
                            showBotResponse(<ResultMovies />, ['다시 추천받기']);
                        }} />
                    );
                }
                break;

            default:
                break;
        }
    };

    // [함수] Quick Reply 버튼 클릭 처리
    const handleQuickReply = (reply: string) => {
        addUserMessage(reply);

        // 현재 단계에 따라 처리
        if (conversationStep === 'greeting') {
            if (reply === '영화 추천받기') {
                handleBotResponse('greeting');
            } else if (reply === '인기 영화 보기') {
                // 인기 영화만 보기 - 현재는 백엔드에서 분리하지 않으므로 일반 추천을 호출
                loadRecommended();
                showBotResponse(
                    <PopularMoviesOnly />,
                    ['영화 추천받기']
                );
            }
        } else if (conversationStep === 'genre') {
            // "완료" 버튼 클릭 시 다음 단계로
            if (reply === '완료') {
                handleBotResponse('genre');
                return;
            }

            // 장르 선택
            const newGenres = selectedGenres.includes(reply)
                ? selectedGenres.filter(g => g !== reply)
                : [...selectedGenres, reply];
            setSelectedGenres(newGenres);

            // "선택 완료" 버튼 표시를 위해 메시지 업데이트할 수도 있음
            // 여기서는 간단히 자동으로 다음 단계로
            if (newGenres.length > 0) {
                setTimeout(() => {
                    addBotMessage(
                        `현재 선택: ${newGenres.join(', ')}\n더 선택하시거나 "완료"를 눌러주세요!`,
                        [...GENRES, '완료']
                    );
                }, 300);
            }
        } else if (conversationStep === 'time') {
            // 시간 선택
            const timeMap: { [key: string]: string } = {
                '1시간': '01:00',
                '2시간': '02:00',
                '3시간': '03:00',
                '상관없음': '12:00'
            };
            if (timeMap[reply]) {
                setTime(timeMap[reply]);
                handleBotResponse('time');
            }
        } else if (conversationStep === 'result') {
            handleBotResponse('result', reply);
        }
    };

    // [함수] 텍스트 입력 처리
    const handleUserMessage = (text: string) => {
        addUserMessage(text);

        // 자연어 파싱
        const parsed = parseUserInput(text);

        // 현재 단계에 따라 처리
        if (conversationStep === 'greeting') {
            if (parsed.intent === 'start') {
                handleBotResponse('greeting');
            }
        } else if (conversationStep === 'genre') {
            if (parsed.intent === 'genre' && parsed.value) {
                const newGenres = [...selectedGenres, parsed.value];
                setSelectedGenres(newGenres);
                setTimeout(() => {
                    addBotMessage(
                        `${parsed.value} 추가되었어요! 👍\n현재 선택: ${newGenres.join(', ')}\n더 선택하시거나 "완료"를 눌러주세요!`,
                        [...GENRES, '완료']
                    );
                }, 300);
            } else if (text.includes('완료') || text.includes('다음') || text.includes('좋아')) {
                handleBotResponse('genre');
            }
        } else if (conversationStep === 'time') {
            if (parsed.intent === 'time' && parsed.value) {
                const timeMap: { [key: string]: string } = {
                    '1시간': '01:00',
                    '2시간': '02:00',
                    '3시간': '03:00',
                    '상관없음': '12:00'
                };
                const timeValue = timeMap[parsed.value];
                if (timeValue) {
                    setTime(timeValue);
                    handleBotResponse('time');
                }
            }
        } else if (conversationStep === 'result') {
            handleBotResponse('result', text);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
            {/* 헤더 */}
            <header className="bg-white dark:bg-gray-800 shadow-sm p-4 text-center z-deco">
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">Movie Assistant 🎬</h1>
            </header>

            {/* 필터 요약 (상단 고정) */}
            <FilterSummary />

            {/* 메시지 목록 (스크롤 영역) */}
            <div className="flex-1 overflow-hidden relative">
                <ChatMessageList
                    messages={messages}
                    isTyping={isTyping}
                    onQuickReply={handleQuickReply}
                />
            </div>

            {/* 입력창 (하단 고정) */}
            <ChatInput
                onSend={handleUserMessage}
                disabled={isTyping}
                placeholder="메시지를 입력하거나 버튼을 클릭하세요..."
            />

            {/* 영화 상세 모달 */}
            <MovieDetailModal />
        </div>
    );
}

// [컴포넌트] 추천 + 인기 영화 결과
function ResultMovies() {
    const { recommendedMovies, popularMovies, setDetailMovie, removeRecommendedMovie } = useMovieStore();

    return (
        <div className="w-full">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">🎯 맞춤 추천</h3>
            <div className="grid grid-cols-3 gap-2 mb-4">
                {recommendedMovies.length > 0 ? (
                    recommendedMovies.map(movie => (
                        <MovieCard
                            key={movie.id}
                            movie={movie}
                            onClick={() => setDetailMovie(movie)}
                            onReRecommend={() => removeRecommendedMovie(movie.id)}
                            showReRecommend={true}
                        />
                    ))
                ) : (
                    <p className="text-xs text-gray-400 col-span-3">조건에 맞는 영화를 찾지 못했어요 😢</p>
                )}
            </div>

            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">🔥 인기 영화</h3>
            <div className="grid grid-cols-3 gap-2">
                {popularMovies.length > 0 ? (
                    popularMovies.map(movie => (
                        <MovieCard
                            key={movie.id}
                            movie={movie}
                            onClick={() => setDetailMovie(movie)}
                            showReRecommend={false}
                        />
                    ))
                ) : (
                    <p className="text-xs text-gray-400 col-span-3">인기 영화가 없습니다.</p>
                )}
            </div>
        </div>
    );
}

// [컴포넌트] 인기 영화만
function PopularMoviesOnly() {
    const { popularMovies, setDetailMovie } = useMovieStore();

    return (
        <div className="w-full">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">🔥 인기 영화</h3>
            <div className="grid grid-cols-3 gap-2">
                {popularMovies.length > 0 ? (
                    popularMovies.map(movie => (
                        <MovieCard key={movie.id} movie={movie} onClick={() => setDetailMovie(movie)} />
                    ))
                ) : (
                    <p className="text-xs text-gray-400 col-span-3">인기 영화가 없습니다.</p>
                )}
            </div>
        </div>
    );
}

// [확장 가이드]
// 1. 대화 단계 추가:
//    - ConversationStep 타입에 새 단계 추가
//    - handleBotResponse에서 해당 단계 처리 추가
//
// 2. 자연어 이해 개선:
//    - parseUserInput 함수를 AI API로 대체 (OpenAI, Google Gemini 등)
//    - 더 복잡한 의도 파악 가능
//
// 3. 대화 히스토리 저장:
//    - localStorage 또는 백엔드에 대화 저장
//    - 이전 대화 이어가기 기능
//
// 4. 다국어 지원:
//    - i18n 라이브러리 추가
//    - GENRES, TIME_OPTIONS를 다국어로 관리
