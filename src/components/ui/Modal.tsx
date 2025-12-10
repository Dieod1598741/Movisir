// ============================================================
// [용도] 스크롤 가능한 공용 모달 컴포넌트
// [사용법] <Modal isOpen={state} onClose={...}></Modal>
// [주의사항] children 내부는 개발자가 자유롭게 구성
// ============================================================
// [스타일 수정 가이드]
//
// 1. 배경 오버레이
//    - bg-black/50: 검은색 50% 투명도 (어둡게: /70, 밝게: /30)
//    - backdrop-blur-sm 추가 시 블러 효과
//
// 2. 모달 크기
//    - w-11/12: 화면 너비의 91.67%
//    - max-w-lg: 최대 너비 512px
//    - max-h-[80vh]: 최대 높이 화면의 80%
//    - 더 크게: max-w-xl(576px), max-w-2xl(672px)
//    - 더 작게: max-w-md(448px), max-w-sm(384px)
//
// 3. 모달 배경색
//    - bg-white: 라이트 모드 흰색
//    - dark:bg-gray-800: 다크 모드 어두운 회색
//    - 다른 색: bg-gray-50, dark:bg-gray-900
//
// 4. 모서리 둥글기
//    - rounded-xl: 12px 둥글기
//    - rounded-2xl: 16px / rounded-3xl: 24px
//
// 5. 그림자
//    - shadow-lg: 큰 그림자
//    - shadow-xl: 더 큰 그림자 / shadow-md: 작은 그림자
//
// 6. 닫기 버튼
//    - bg-gray-900: 라이트 모드 검정
//    - dark:bg-gray-200: 다크 모드 밝은 회색
//    - 색상 변경: bg-blue-500 text-white
// ============================================================

import type { ModalProps } from './ui.types';

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      // 배경 오버레이: 클릭하면 모달 닫힘
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        // 모달 본체: 클릭해도 닫히지 않음 (이벤트 버블링 중단)
        className="bg-white dark:bg-gray-800 w-11/12 max-w-lg max-h-[80vh] overflow-y-auto p-5 rounded-xl shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {children}

        <button
          onClick={onClose}
          // 닫기 버튼 스타일
          className="mt-4 w-full py-2 rounded-lg bg-gray-900 text-white dark:bg-gray-200 dark:text-black"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
