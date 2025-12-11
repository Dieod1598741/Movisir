// [용도] SignupModal 유효성 검사 유틸리티
// [사용법] import { validateEmail, validatePassword, validateName, getEmailErrorMessage } from './signupModal.utils';

// ================================
// 검증 함수 (boolean 반환)
// ================================

export const validateEmail = (email: string): boolean => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
    if (!password || password.length < 8) return false;

    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    return hasLetter && hasNumber;
};

export const validateName = (name: string): boolean => {
    if (!name) return false;
    return name.length >= 2;
};

// ================================
// 에러 메시지 생성 함수
// ================================

export const getEmailErrorMessage = (email: string): string => {
    if (!email) return '이메일을 입력해주세요';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return '올바른 이메일 형식이 아닙니다';
    return '';
};

export const getPasswordErrorMessage = (password: string): string => {
    if (!password) return '비밀번호를 입력해주세요';
    if (password.length < 8) return '비밀번호는 최소 8자 이상이어야 합니다';

    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasLetter || !hasNumber) return '비밀번호는 영문과 숫자를 포함해야 합니다';
    return '';
};

export const getNicknameErrorMessage = (nickname: string): string => {
    if (!nickname) return '닉네임을 입력해주세요';
    if (nickname.length < 2) return '닉네임은 최소 2자 이상이어야 합니다';
    return '';
};
