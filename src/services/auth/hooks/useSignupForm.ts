import { useState, useCallback } from 'react';
import { signup } from '../../../api/authApi';
import { useAuth } from '../../../app/providers/AuthContext';
import { useEmailValidation } from './useEmailValidation';
import { useNicknameValidation } from './useNicknameValidation';
import { usePasswordValidation } from './usePasswordValidation';
import { useVerificationCode } from './useVerificationCode';

export function useSignupForm() {
    const { loadUserFromStorage } = useAuth();

    // 각 필드별 검증 훅
    const emailValidation = useEmailValidation();
    const nicknameValidation = useNicknameValidation();
    const passwordValidation = usePasswordValidation();
    const codeValidation = useVerificationCode();

    // 공통 상태
    const [generalError, setGeneralError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 회원가입 가능 여부
    const canSignup =
        emailValidation.isEmailValid &&
        nicknameValidation.isNicknameValid &&
        passwordValidation.isPasswordValid &&
        passwordValidation.isPasswordMatch &&
        codeValidation.codeVerified;

    // 진행 상황
    const progress = {
        email: emailValidation.isEmailValid && codeValidation.codeVerified,
        info: nicknameValidation.isNicknameValid &&
            passwordValidation.isPasswordValid &&
            passwordValidation.isPasswordMatch,
    };

    // 이메일 변경 핸들러 (코드 상태 리셋 포함)
    const handleEmailChange = useCallback((value: string) => {
        emailValidation.handleEmailChange(value);
        codeValidation.handleEmailChange();
    }, [emailValidation, codeValidation]);

    // 인증 코드 전송
    const handleSendCode = useCallback(async () => {
        if (!emailValidation.isEmailValid) {
            setGeneralError('올바른 이메일 형식이 아닙니다');
            return;
        }

        const result = await codeValidation.sendCode(emailValidation.email);
        if (!result.success) {
            setGeneralError(result.error || '');
        } else {
            setGeneralError('');
        }
    }, [emailValidation.isEmailValid, emailValidation.email, codeValidation]);

    // 인증 코드 확인
    const handleVerifyCode = useCallback(async () => {
        const result = await codeValidation.verifyCode(
            emailValidation.email,
            codeValidation.code
        );
        if (!result.success) {
            setGeneralError(result.error || '');
        } else {
            setGeneralError('');
        }
    }, [emailValidation.email, codeValidation]);

    // 회원가입
    const handleSignup = useCallback(async () => {
        if (!canSignup) return;

        try {
            setIsSubmitting(true);
            setGeneralError('');

            const res = await signup({
                name: nicknameValidation.nickname,
                email: emailValidation.email,
                password: passwordValidation.password,
                verificationCode: codeValidation.code,
            });

            if (res.user) {
                localStorage.setItem('user', JSON.stringify(res.user));
                await loadUserFromStorage();
            }

            return { success: true };
        } catch (err: any) {
            const errorMsg = err.message || '회원가입 중 오류';
            setGeneralError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setIsSubmitting(false);
        }
    }, [canSignup, emailValidation.email, nicknameValidation.nickname, passwordValidation.password, codeValidation.code, loadUserFromStorage]);

    // 폼 초기화
    const resetForm = useCallback(() => {
        emailValidation.resetEmail();
        nicknameValidation.resetNickname();
        passwordValidation.resetPassword();
        codeValidation.resetCode();
        setGeneralError('');
    }, [emailValidation, nicknameValidation, passwordValidation, codeValidation]);

    return {
        // 이메일
        email: emailValidation.email,
        emailStatus: emailValidation.emailStatus,
        emailError: emailValidation.emailError,
        isEmailValid: emailValidation.isEmailValid,
        handleEmailChange,

        // 닉네임
        nickname: nicknameValidation.nickname,
        nicknameStatus: nicknameValidation.nicknameStatus,
        nicknameError: nicknameValidation.nicknameError,
        isNicknameValid: nicknameValidation.isNicknameValid,
        handleNicknameChange: nicknameValidation.handleNicknameChange,

        // 비밀번호
        password: passwordValidation.password,
        passwordConfirm: passwordValidation.passwordConfirm,
        passwordError: passwordValidation.passwordError,
        passwordConfirmError: passwordValidation.passwordConfirmError,
        isPasswordValid: passwordValidation.isPasswordValid,
        isPasswordMatch: passwordValidation.isPasswordMatch,
        handlePasswordChange: passwordValidation.handlePasswordChange,
        handlePasswordConfirmChange: passwordValidation.handlePasswordConfirmChange,

        // 인증 코드
        code: codeValidation.code,
        codeSent: codeValidation.codeSent,
        codeVerified: codeValidation.codeVerified,
        codeError: codeValidation.codeError,
        setCode: codeValidation.setCode,
        handleSendCode,
        handleVerifyCode,

        // 공통
        generalError,
        isSubmitting,
        isLoading: codeValidation.isLoading,
        canSignup,
        progress,

        // 액션
        handleSignup,
        resetForm,
    };
}
