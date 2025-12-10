# MOVISIR 🎬

> 챗봇 기반 영화 추천 서비스

AI 챗봇과 대화하며 취향에 맞는 영화를 추천받을 수 있는 웹 애플리케이션입니다.

## 📋 목차

- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [시작하기](#-시작하기)
- [프로젝트 구조](#-프로젝트-구조)
- [개발 스크립트](#-개발-스크립트)
- [주요 페이지](#-주요-페이지)

## ✨ 주요 기능

### 🤖 챗봇 영화 추천
- AI 챗봇과 대화형식으로 영화 추천받기
- 장르, 감독, 배우, 개봉년도 등 다양한 필터 옵션
- 실시간 영화 정보 검색 및 상세 정보 제공

### 👤 회원 기능
- 로그인 / 회원가입
- 마이페이지에서 개인 정보 관리
- 찜한 영화 목록 관리
- OTT 플랫폼 설정
- 영화 시청 캘린더

### 🎨 UX/UI
- 다크모드 / 라이트모드 지원
- 반응형 디자인 (모바일, 태블릿, 데스크톱)
- PWA (Progressive Web App) 지원
- 부드러운 애니메이션 효과 (Framer Motion)

## 🛠 기술 스택

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Routing**: React Router v6
- **State Management**: Zustand
- **Animation**: Framer Motion
- **HTTP Client**: Axios + React Query

### Backend (Mock)
- **JSON Server**: 개발용 Mock API 서버

### 개발 도구
- **Linting**: ESLint
- **PWA**: vite-plugin-pwa
- **Icons**: Lucide React

## 🚀 시작하기

### 필수 요구사항
- Node.js (v18 이상)
- npm 또는 yarn

### 설치 및 실행

1. **의존성 설치**
```bash
npm install
```

2. **Mock API 서버 실행** (터미널 1)
```bash
npm run mock
```
> Mock API 서버가 `http://localhost:3001`에서 실행됩니다.

3. **개발 서버 실행** (터미널 2)
```bash
npm run dev
```
> 개발 서버가 `http://localhost:5173`에서 실행됩니다.

4. **브라우저에서 확인**
```
http://localhost:5173
```

## 📁 프로젝트 구조

```
movisr/
├── public/              # 정적 파일
├── src/
│   ├── api/            # API 통신 함수들
│   ├── app/            # App 전역 설정 (Provider 등)
│   ├── components/     # 재사용 가능한 컴포넌트
│   │   ├── layout/    # 레이아웃 컴포넌트 (Header, Footer 등)
│   │   ├── module/    # 기능별 모듈 컴포넌트 (LoginModal, SignupModal 등)
│   │   ├── ui/        # UI 기본 컴포넌트 (Button, Modal 등)
│   │   └── ...
│   ├── features/       # 기능별 모듈 (챗봇, 영화 등)
│   ├── pages/          # 페이지 컴포넌트
│   ├── store/          # Zustand 상태 관리
│   ├── utils/          # 유틸리티 함수
│   ├── App.tsx         # 메인 App 컴포넌트
│   └── main.tsx        # 진입점
├── mock/
│   └── db.json         # Mock 데이터베이스
└── package.json
```

## 📜 개발 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 (Vite) |
| `npm run build` | 프로덕션 빌드 |
| `npm run preview` | 빌드된 앱 미리보기 |
| `npm run lint` | ESLint 실행 |
| `npm run mock` | Mock API 서버 실행 (포트 3001) |

## 🗺 주요 페이지

| 경로 | 설명 | 접근 권한 |
|------|------|-----------|
| `/` | 메인 페이지 | 전체 |
| `/chatbot` | 챗봇 영화 추천 페이지 | 전체 |
| `/mypage` | 마이페이지 (회원 정보, 찜 목록 등) | 로그인 필요 |
| `/signup-complete` | 회원가입 완료 및 온보딩 | 전체 |
| `/experiment` | 실험용 페이지 | 전체 |

## 🔐 인증 시스템

- **AuthContext**: React Context를 이용한 전역 인증 상태 관리
- **ProtectedRoute**: 로그인이 필요한 페이지 보호
- **자동 리다이렉트**: 비로그인 시 로그인 페이지로 이동

## 🎨 테마 시스템

- **ThemeContext**: 다크모드/라이트모드 전역 관리
- **TailwindCSS dark:** 클래스를 이용한 다크모드 스타일링
- **사용자 설정 저장**: LocalStorage에 테마 설정 저장

## 📱 PWA 기능

- 오프라인 지원
- 홈 화면에 추가 가능
- 빠른 로딩 속도
- 모바일 앱과 유사한 사용자 경험

## 🤝 기여하기

1. 이 저장소를 Fork합니다
2. Feature 브랜치를 생성합니다 (`git checkout -b feature/AmazingFeature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 Push합니다 (`git push origin feature/AmazingFeature`)
5. Pull Request를 생성합니다

## 📄 라이선스

이 프로젝트는 개인 프로젝트입니다.

---

**Made with using React + TypeScript + Vite**
