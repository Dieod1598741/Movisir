# 🛠️ 전체 기술 스택 (Full Tech Stack)

이 문서는 `package.json`에 포함된 **모든** 라이브러리와 도구들에 대한 상세 설명서입니다.

## 📦 프로덕션 의존성 (dependencies)
실제 배포되는 애플리케이션 실행에 필수적인 라이브러리들입니다.

| 패키지명 | 분류 | 상세 설명 |
| :--- | :--- | :--- |
| **react** | Core | 사용자 인터페이스(UI)를 구축하기 위한 핵심 JavaScript 라이브러리입니다. 컴포넌트 기반 개발을 가능하게 합니다. |
| **react-dom** | Core | React로 만든 컴포넌트를 실제 웹 브라우저의 DOM(Document Object Model)에 렌더링하는 역할을 합니다. |
| **react-router-dom** | Routing | SPA(Single Page Application)에서 페이지 새로고침 없이 URL 이동과 화면 전환을 처리하는 라우팅 라이브러리입니다. |
| **zustand** | State Management | Redux보다 가볍고 사용하기 쉬운 전역 상태 관리 라이브러리입니다. (영화 데이터, 유저 세션 등 관리) |
| **@tanstack/react-query** | Data Fetching | 서버 상태(Server State)를 관리합니다. API 데이터 캐싱, 동기화, 백그라운드 업데이트 등을 효율적으로 처리합니다. |
| **axios** | HTTP Client | 브라우저와 Node.js를 위한 Promise 기반 HTTP 클라이언트입니다. API 요청을 보내고 응답을 받는 데 사용됩니다. |
| **framer-motion** | Animation | React용 프로덕션 레벨 모션 라이브러리입니다. 복잡한 애니메이션과 제스처를 선언적으로 구현할 수 있습니다. |
| **lucide-react** | UI/Icons | 일관된 디자인의 SVG 아이콘을 React 컴포넌트 형태로 제공하는 경량 아이콘 라이브러리입니다. |

<br/>

## 🛠️ 개발 의존성 (devDependencies)
개발 과정에서만 필요하고, 실제 배포 결과물에는 포함되지 않거나 빌드 시에만 사용되는 도구들입니다.

### 1. 빌드 및 번들링 (Build & Bundling)
| 패키지명 | 설명 |
| :--- | :--- |
| **vite** | 빠르고 가벼운 차세대 프론트엔드 빌드 도구입니다. 개발 서버 구동과 프로덕션 빌드를 담당합니다. |
| **@vitejs/plugin-react** | Vite에서 React를 사용할 수 있게 해주는 공식 플러그인입니다. Fast Refresh(수정 사항 즉시 반영) 기능을 제공합니다. |
| **vite-plugin-pwa** | Vite 프로젝트를 PWA(Progressive Web App)로 변환해주는 플러그인입니다. 오프라인 지원 및 앱 설치 기능을 제공합니다. |

### 2. 언어 및 타입 (Language & Types)
| 패키지명 | 설명 |
| :--- | :--- |
| **typescript** | JavaScript에 정적 타입을 추가한 언어입니다. 코드의 안정성을 높이고 개발 도구의 지원을 강화합니다. |
| **@types/react** | React 라이브러리의 TypeScript 타입 정의 파일입니다. |
| **@types/react-dom** | React DOM의 TypeScript 타입 정의 파일입니다. |
| **@types/node** | Node.js 환경의 타입 정의 파일입니다. (파일 시스템 접근 등 Node.js API 사용 시 필요) |

### 3. 스타일링 (Styling)
| 패키지명 | 설명 |
| :--- | :--- |
| **tailwindcss** | 유틸리티 퍼스트 CSS 프레임워크입니다. HTML 클래스명으로 스타일을 빠르게 적용할 수 있습니다. |
| **postcss** | CSS를 변환하는 도구입니다. Tailwind CSS가 동작하기 위한 기반 환경을 제공합니다. |
| **autoprefixer** | PostCSS 플러그인으로, CSS 속성에 브라우저별 접두사(vendor prefix)를 자동으로 추가하여 호환성을 높여줍니다. |

### 4. 린팅 및 코드 품질 (Linting & Quality)
| 패키지명 | 설명 |
| :--- | :--- |
| **eslint** | JavaScript/TypeScript 코드의 문법 오류나 안 좋은 패턴을 찾아주는 정적 분석 도구입니다. |
| **@eslint/js** | ESLint의 기본 JavaScript 설정 및 규칙 모음입니다. |
| **globals** | 전역 변수(window, document 등) 목록을 정의하여 ESLint가 이를 인식하게 돕습니다. |
| **@typescript-eslint/parser** | ESLint가 TypeScript 코드를 이해하고 분석할 수 있게 해주는 파서입니다. |
| **@typescript-eslint/eslint-plugin** | TypeScript 관련 린트 규칙들을 제공하는 플러그인입니다. |
| **eslint-plugin-react-hooks** | React Hooks(useEffect, useState 등)의 사용 규칙을 강제하여 버그를 방지합니다. |
| **eslint-plugin-react-refresh** | React Fast Refresh 기능이 올바르게 작동하도록 돕는 린트 규칙입니다. |

### 5. 기타 유틸리티 (Utilities)
| 패키지명 | 설명 |
| :--- | :--- |
| **json-server** | 프론트엔드 개발 시 백엔드 없이도 REST API를 흉내 낼 수 있게 해주는 가짜(Mock) API 서버 도구입니다. |

---
> **참고**: 이 문서는 `package.json` (v0.0.0) 기준으로 작성되었습니다.
