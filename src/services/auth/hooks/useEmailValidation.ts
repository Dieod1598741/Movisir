import { useState, useRef, useCallback, useEffect } from 'react';
import { checkEmailDuplicate } from '../../../api/authApi';
import { validateEmail, getEmailErrorMessage } from '../components/SignupModal/signupModal.utils';

export type ValidationStatus = 'idle' | 'checking' | 'valid' | 'invalid' | 'duplicate';

export function useEmailValidation() {
    const [email, setEmail] = useState('');
    const [emailStatus, setEmailStatus] = useState<ValidationStatus>('idle');
    const [emailError, setEmailError] = useState('');
    const emailDebounceTimer = useRef<NodeJS.Timeout | null>(null);

    // 클린업
    useEffect(() => {
        return () => {
            if (emailDebounceTimer.current) {
                clearTimeout(emailDebounceTimer.current);
            }
        };
    }, []);

    // 이메일 중복 체크
    const checkEmail = useCallback(async (emailValue: string) => {
        try {
            setEmailStatus('checking');
            const result = await checkEmailDuplicate(emailValue);

            if (result.available) {
                setEmailStatus('valid');
                setEmailError('');
            } else {
                setEmailStatus('duplicate');
                setEmailError(result.message);
            }
        } catch (err: any) {
            setEmailStatus('invalid');
            setEmailError(err.message || '이메일 확인 중 오류 발생');
        }
    }, []);

    // 이메일 입력 핸들러
    const handleEmailChange = useCallback((value: string) => {
        setEmail(value);

        // 타이머 클리어
        if (emailDebounceTimer.current) {
            clearTimeout(emailDebounceTimer.current);
        }

        // 빈 값
        if (!value) {
            setEmailStatus('idle');
            setEmailError('');
            return;
        }

        // 형식 검증
        if (!validateEmail(value)) {
            setEmailStatus('invalid');
            setEmailError(getEmailErrorMessage(value));
            return;
        }

        // 500ms 후 중복 체크
        setEmailStatus('checking');
        emailDebounceTimer.current = setTimeout(() => {
            checkEmail(value);
        }, 500);
    }, [checkEmail]);

    // 초기화
    const resetEmail = useCallback(() => {
        setEmail('');
        setEmailStatus('idle');
        setEmailError('');
        if (emailDebounceTimer.current) {
            clearTimeout(emailDebounceTimer.current);
        }
    }, []);

    return {
        email,
        emailStatus,
        emailError,
        isEmailValid: validateEmail(email) && emailStatus === 'valid',
        handleEmailChange,
        resetEmail,
    };
}
