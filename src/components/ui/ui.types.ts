// [용도] UI 컴포넌트의 타입 정의

import type { ReactNode } from 'react';

export type ButtonProps = {
    label: string;
    onClick: () => void;
    className?: string;
};

export type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
};
