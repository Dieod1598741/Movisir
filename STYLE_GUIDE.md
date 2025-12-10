# 🎨 스타일 수정 가이드 (Style Modification Guide)

이 문서는 프로젝트 내 주요 컴포넌트의 스타일을 **주석만 보고 직접 수정**할 수 있도록 정리한 가이드입니다.

---

## 📋 목차

1. [TailwindCSS 기초](#tailwindcss-기초)
2. [공통 UI 컴포넌트](#공통-ui-컴포넌트)
3. [챗봇 컴포넌트](#챗봇-컴포넌트)
4. [페이지 컴포넌트](#페이지-컴포넌트)
5. [자주 사용하는 스타일 패턴](#자주-사용하는-스타일-패턴)

---

## TailwindCSS 기초

### 크기 단위
| 값 | 실제 크기 |
|----|----------|
| `1` | 4px |
| `2` | 8px |
| `4` | 16px |
| `6` | 24px |
| `8` | 32px |

예: `px-4` = 좌우 패딩 16px, `py-2` = 위아래 패딩 8px

### 반응형 브레이크포인트
| 접두사 | 최소 너비 |
|--------|----------|
| (기본) | 0px (모바일) |
| `sm:` | 640px |
| `md:` | 768px |
| `lg:` | 1024px |
| `xl:` | 1280px |

예: `text-sm md:text-base` = 모바일 14px, 태블릿 이상 16px

### 다크모드
`dark:` 접두사 사용
예: `bg-white dark:bg-gray-800`

---

## 공통 UI 컴포넌트

### Button.tsx
**파일 위치:** `src/components/ui/Button.tsx`

| 수정 항목 | 현재 값 | 변경 방법 |
|----------|--------|----------|
| 버튼 크기 | `px-3 py-1.5` | 더 크게: `px-6 py-3` |
| 글자 크기 | `text-sm` | 더 크게: `text-lg` |
| 글자 색상 | `text-blue-400` | 다른 색: `text-green-500` |
| 모서리 | `rounded-lg` | 더 둥글게: `rounded-full` |
| 호버 효과 | `hover:scale-105` | 끄기: `hover:scale-100` |

---

### Modal.tsx
**파일 위치:** `src/components/ui/Modal.tsx`

| 수정 항목 | 현재 값 | 변경 방법 |
|----------|--------|----------|
| 배경 어둡기 | `bg-black/50` | 더 어둡게: `/70`, 밝게: `/30` |
| 모달 너비 | `max-w-lg` (512px) | 크게: `max-w-xl`, 작게: `max-w-md` |
| 모달 높이 | `max-h-[80vh]` | 높게: `[90vh]`, 낮게: `[60vh]` |
| 모달 배경 | `bg-white` | 다른 색: `bg-gray-50` |
| 모서리 | `rounded-xl` | 더 둥글게: `rounded-2xl` |

---

### LoadingSpinner.tsx
**파일 위치:** `src/components/ui/LoadingSpinner.tsx`

| 수정 항목 | 현재 값 | 변경 방법 |
|----------|--------|----------|
| 스피너 크기 | `h-14 w-14` | 크게: `h-20 w-20` |
| 스피너 색상 | `border-blue-500` | 다른 색: `border-purple-500` |
| 점 색상 | `bg-blue-600` | 다른 색: `bg-green-600` |
| 메시지 크기 | `text-xl` | 크게: `text-2xl` |

---

## 챗봇 컴포넌트

### ChatbotPanel.tsx
**파일 위치:** `src/services/chatbot/components/ChatbotPanel.tsx`

| 수정 항목 | 현재 값 | 변경 방법 |
|----------|--------|----------|
| 패널 높이 | `h-[85vh]` | 높게: `h-[95vh]`, 낮게: `h-[70vh]` |
| 패널 최대 너비 | `max-w-[640px]` | 크게: `max-w-[800px]` |
| 모서리 | `rounded-t-2xl` | 더 둥글게: `rounded-t-3xl` |
| 그림자 | `shadow-xl` | 더 강하게: `shadow-2xl` |
| 애니메이션 | `duration-500` | 빠르게: `duration-300` |

---

### ChatbotButton.tsx
**파일 위치:** `src/services/chatbot/components/ChatbotButton.tsx`

| 수정 항목 | 현재 값 | 변경 방법 |
|----------|--------|----------|
| 버튼 크기 | `w-28 h-28` | 크게: `w-32 h-32` |
| 그라데이션 | `from-blue-400 to-cyan-400` | 다른 색: `from-purple-500 to-pink-500` |
| 눈 크기 | `w-3 h-3` | 크게: `w-4 h-4` |
| 홍조 색상 | `bg-pink-400/80` | 다른 색: `bg-red-400/80` |

---

### ChatInput.tsx
**파일 위치:** `src/services/chatbot/components/ChatInput.tsx`

| 수정 항목 | 현재 값 | 변경 방법 |
|----------|--------|----------|
| 입력창 높이 | `py-3` | 높게: `py-4`, 낮게: `py-2` |
| 입력창 모서리 | `rounded-xl` | 더 둥글게: `rounded-2xl` |
| 전송 버튼 색상 | `bg-blue-600` | 다른 색: `bg-green-600` |

---

### QuickReplyButtons.tsx
**파일 위치:** `src/services/chatbot/components/QuickReplyButtons.tsx`

| 수정 항목 | 현재 값 | 변경 방법 |
|----------|--------|----------|
| 버튼 배경 | `bg-blue-50` | 다른 색: `bg-purple-50` |
| 버튼 테두리 | `border-blue-300` | 다른 색: `border-purple-300` |
| 버튼 모양 | `rounded-full` | 각지게: `rounded-lg` |

---

### MovieCard.tsx
**파일 위치:** `src/services/chatbot/components/MovieCard.tsx`

| 수정 항목 | 현재 값 | 변경 방법 |
|----------|--------|----------|
| 카드 모서리 | `rounded-lg` | 더 둥글게: `rounded-xl` |
| 호버 확대 | `hover:scale-105` | 더 크게: `hover:scale-110` |
| 포스터 비율 | `aspect-[2/3]` | 정사각형: `aspect-square` |
| Watched 뱃지 | `bg-green-500` | 다른 색: `bg-blue-500` |

---

### MovieDetailModal.tsx
**파일 위치:** `src/services/chatbot/MovieDetailModal/MovieDetailModal.tsx`

| 수정 항목 | 현재 값 | 변경 방법 |
|----------|--------|----------|
| 포스터 너비 | `md:w-1/3` | 크게: `md:w-1/2` |
| 장르 뱃지 | `bg-gray-100` | 다른 색: `bg-blue-100` |
| Watch 버튼 | `bg-blue-600` | 다른 색: `bg-green-600` |

---

## 페이지 컴포넌트

### MainPage.tsx
**파일 위치:** `src/pages/MainPage.tsx`

| 수정 항목 | 현재 값 | 변경 방법 |
|----------|--------|----------|
| 실험실 버튼 그라데이션 | `from-purple-600 to-pink-600` | 시원하게: `from-blue-500 to-cyan-500` |
| 버튼 크기 | `px-8 py-3` | 크게: `px-10 py-4` |

---

### MainLayout.tsx
**파일 위치:** `src/components/layout/MainLayout.tsx`

| 수정 항목 | 현재 값 | 변경 방법 |
|----------|--------|----------|
| 배경색 | `bg-gray-50` | 다른 색: `bg-white` |
| 다크모드 배경 | `dark:bg-gray-900` | 더 어둡게: `dark:bg-black` |

---

## 자주 사용하는 스타일 패턴

### 그라데이션 버튼
```jsx
className="bg-gradient-to-r from-색상1 to-색상2"
// 예: from-blue-500 to-cyan-500
// 예: from-purple-600 to-pink-600
```

### 호버 효과
```jsx
className="hover:scale-105 transition-all duration-300"
// 확대, 부드러운 애니메이션
```

### 다크모드 대응
```jsx
className="bg-white dark:bg-gray-800 text-black dark:text-white"
```

### 반응형 크기
```jsx
className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
// 모바일: 100%, 태블릿: 50%, 데스크톱: 33%, 대형: 25%
```

---

## 📝 스타일 추가된 파일 목록

| 파일 | 추가된 주석 |
|------|------------|
| `components/ui/Button.tsx` | ✅ 버튼 크기, 색상, 호버 효과 |
| `components/ui/Modal.tsx` | ✅ 오버레이, 모달 크기, 닫기 버튼 |
| `components/ui/LoadingSpinner.tsx` | ✅ (기존 주석 유지) |
| `services/chatbot/components/Chatbot.tsx` | ✅ 위치 애니메이션, z-index |
| `services/chatbot/components/ChatbotButton.tsx` | ✅ (기존 주석 유지) |
| `services/chatbot/components/ChatbotPanel.tsx` | ✅ (기존 주석 유지) |
| `services/chatbot/components/ChatInput.tsx` | ✅ 입력창, 전송 버튼 |
| `services/chatbot/components/QuickReplyButtons.tsx` | ✅ 버튼 스타일 |
| `services/chatbot/components/MovieCard.tsx` | ✅ 카드, 포스터, 뱃지 |
| `services/chatbot/MovieDetailModal/MovieDetailModal.tsx` | ✅ 레이아웃, 장르 뱃지 |
| `pages/MainPage.tsx` | ✅ 실험실 버튼 그라데이션 |
| `components/layout/MainLayout.tsx` | ✅ (기존 주석 유지) |

---

**작성일**: 2025-12-08
