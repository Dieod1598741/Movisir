// [용도] 화면 원하는 위치에 띄우는 말풍선 컴포넌트
// [사용법] <FloatingBubble top={100} left={150}>내용</FloatingBubble>
// [주의사항] position: absolute라 부모 요소보다 body 기준으로 두는 게 자연스러움

import React from "react";
import FadeIn from "../transitions/FadeIn";
import FloatAnimation from "../transitions/Float";

type Props = {
    top?: number;        // Y 위치(px)
    left?: number;       // X 위치(px)
    visible?: boolean;
    float?: boolean;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void; // 클릭 이벤트 핸들러
};

export default function FloatingBubble({
    top,
    left,
    visible = true,
    float = false,
    children,
    className = "",
    onClick
}: Props) {
    if (!visible) return null;

    // 1. 내부 콘텐츠 (디자인)
    const InnerContent = (
        <div
            className="
                bg-white
                shadow-lg
                rounded-2xl
                py-9 px-6
                text-sm
                text-blue-400
                border
            "
            onClick={onClick}
        >
            {children}
        </div>
    );

    // 2. 애니메이션 래퍼 (FadeIn -> Float)
    const AnimatedContent = (
        <FadeIn>
            {float ? <FloatAnimation>{InnerContent}</FloatAnimation> : InnerContent}
        </FadeIn>
    );

    // 3. 최상위 위치 래퍼 (absolute positioning)
    return (
        <div
            className={`absolute ${className} z-deco`} // z-index 추가로 안전하게 상위 노출
            style={{ top, left }}
        >
            {AnimatedContent}
        </div>
    );
}
