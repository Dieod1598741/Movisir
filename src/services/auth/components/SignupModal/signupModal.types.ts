// [용도] SignupModal 컴포넌트의 타입 정의
// [사용법] import type { SignupModalProps } from './signupModal.types';

export type SignupModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export type SignupFormData = {
    email: string;
    password: string;
    passwordConfirm: string;
    name: string;
};

export type SignupFormErrors = {
    email?: string;
    password?: string;
    passwordConfirm?: string;
    name?: string;
};
