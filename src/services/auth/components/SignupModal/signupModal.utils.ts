// [용도] SignupModal 유효성 검사 유틸리티
// [사용법] import { validateEmail, validatePassword, validateName } from './signupModal.utils';

export const validateEmail = (email: string): string | undefined => {
    if (!email) {
        return '이메일을 입력해주세요';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return '올바른 이메일 형식이 아닙니다';
    }

    return undefined;
};

export const validatePassword = (password: string): string | undefined => {
    if (!password) {
        return '비밀번호를 입력해주세요';
    }

    if (password.length < 8) {
        return '비밀번호는 최소 8자 이상이어야 합니다';
    }

    // 비밀번호 강도 체크 (영문, 숫자 포함)
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasLetter || !hasNumber) {
        return '비밀번호는 영문과 숫자를 포함해야 합니다';
    }

    return undefined;
};

export const validatePasswordConfirm = (password: string, passwordConfirm: string): string | undefined => {
    if (!passwordConfirm) {
        return '비밀번호 확인을 입력해주세요';
    }

    if (password !== passwordConfirm) {
        return '비밀번호가 일치하지 않습니다';
    }

    return undefined;
};

export const validateName = (name: string): string | undefined => {
    if (!name) {
        return '이름을 입력해주세요';
    }

    if (name.length < 2) {
        return '이름은 최소 2자 이상이어야 합니다';
    }

    return undefined;
};
