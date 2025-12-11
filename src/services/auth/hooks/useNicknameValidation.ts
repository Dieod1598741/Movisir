import { useState, useRef, useCallback, useEffect } from 'react';
import { checkNicknameDuplicate } from '../../../api/authApi';
import { validateName, getNicknameErrorMessage } from '../components/SignupModal/signupModal.utils';

export type ValidationStatus = 'idle' | 'checking' | 'valid' | 'invalid' | 'duplicate';

export function useNicknameValidation() {
    const [nickname, setNickname] = useState('');
    const [nicknameStatus, setNicknameStatus] = useState<ValidationStatus>('idle');
    const [nicknameError, setNicknameError] = useState('');
    const nicknameDebounceTimer = useRef<NodeJS.Timeout | null>(null);

    // 클린업
    useEffect(() => {
        return () => {
            if (nicknameDebounceTimer.current) {
                clearTimeout(nicknameDebounceTimer.current);
            }
        };
    }, []);

    // 닉네임 중복 체크
    const checkNickname = useCallback(async (nicknameValue: string) => {
        try {
            setNicknameStatus('checking');
            const result = await checkNicknameDuplicate(nicknameValue);

            if (result.available) {
                setNicknameStatus('valid');
                setNicknameError('');
            } else {
                setNicknameStatus('duplicate');
                setNicknameError(result.message);
            }
        } catch (err: any) {
            setNicknameStatus('invalid');
            setNicknameError(err.message || '닉네임 확인 중 오류 발생');
        }
    }, []);

    // 닉네임 입력 핸들러
    const handleNicknameChange = useCallback((value: string) => {
        setNickname(value);

        // 타이머 클리어
        if (nicknameDebounceTimer.current) {
            clearTimeout(nicknameDebounceTimer.current);
        }

        // 빈 값
        if (!value) {
            setNicknameStatus('idle');
            setNicknameError('');
            return;
        }

        // 형식 검증
        if (!validateName(value)) {
            setNicknameStatus('invalid');
            setNicknameError(getNicknameErrorMessage(value));
            return;
        }

        // 500ms 후 중복 체크
        setNicknameStatus('checking');
        nicknameDebounceTimer.current = setTimeout(() => {
            checkNickname(value);
        }, 500);
    }, [checkNickname]);

    // 초기화
    const resetNickname = useCallback(() => {
        setNickname('');
        setNicknameStatus('idle');
        setNicknameError('');
        if (nicknameDebounceTimer.current) {
            clearTimeout(nicknameDebounceTimer.current);
        }
    }, []);

    return {
        nickname,
        nicknameStatus,
        nicknameError,
        isNicknameValid: validateName(nickname) && nicknameStatus === 'valid',
        handleNicknameChange,
        resetNickname,
    };
}
