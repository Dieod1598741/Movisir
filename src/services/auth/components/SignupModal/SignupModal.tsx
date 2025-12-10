// [용도] 회원가입 모달 - 4단계 회원가입 플로우를 모달 내에서 진행
// [사용법] <SignupModal isOpen={isOpen} onClose={handleClose} />

import { useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSignupStore } from '../../../../store/signupStore';
import { sendVerificationCode, verifyCode, signup } from '../../../../api/authApi';

interface SignupModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type SignupStep = 1 | 2 | 3 | 4;

export default function SignupModal({ isOpen, onClose }: SignupModalProps) {
    const navigate = useNavigate();
    const { nickname, email, password, setNickname, setEmail, setPassword, setVerificationCode, reset } = useSignupStore();

    const [currentStep, setCurrentStep] = useState<SignupStep>(1);
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [codeSent, setCodeSent] = useState(false);
    const [errors, setErrors] = useState({
        nickname: '',
        email: '',
        password: '',
        passwordConfirm: '',
        code: '',
        general: '',
    });

    // 모달 닫기 시 초기화
    const handleClose = () => {
        setCurrentStep(1);
        setPasswordConfirm('');
        setCode('');
        setCodeSent(false);
        setErrors({
            nickname: '',
            email: '',
            password: '',
            passwordConfirm: '',
            code: '',
            general: '',
        });
        reset();
        onClose();
    };

    // 외부 클릭 시 닫기
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    // Step 1: 이메일 유효성 검사
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Step 1: 비밀번호 강도 검사
    const validatePassword = (password: string): boolean => {
        const minLength = password.length >= 8;
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        return minLength && hasLetter && hasNumber;
    };

    // Step 1: 폼 검증
    const validateStep1 = (): boolean => {
        const newErrors = {
            nickname: '',
            email: '',
            password: '',
            passwordConfirm: '',
            code: '',
            general: '',
        };

        if (!nickname.trim()) {
            newErrors.nickname = '닉네임을 입력해주세요';
        } else if (nickname.length < 2) {
            newErrors.nickname = '닉네임은 2자 이상이어야 합니다';
        }

        if (!email.trim()) {
            newErrors.email = '이메일을 입력해주세요';
        } else if (!validateEmail(email)) {
            newErrors.email = '올바른 이메일 형식이 아닙니다';
        }

        if (!password) {
            newErrors.password = '비밀번호를 입력해주세요';
        } else if (!validatePassword(password)) {
            newErrors.password = '비밀번호는 8자 이상, 영문과 숫자를 포함해야 합니다';
        }

        if (!passwordConfirm) {
            newErrors.passwordConfirm = '비밀번호 확인을 입력해주세요';
        } else if (password !== passwordConfirm) {
            newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다';
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error !== '');
    };

    // Step 1 → Step 2
    const handleStep1Next = () => {
        if (validateStep1()) {
            setCurrentStep(2);
        }
    };

    // Step 2: 인증 코드 전송
    const handleSendCode = async () => {
        setIsLoading(true);
        setErrors({ ...errors, general: '' });

        try {
            await sendVerificationCode(email);
            setCodeSent(true);
        } catch (err: any) {
            setErrors({ ...errors, general: err.message || '인증 코드 전송에 실패했습니다' });
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2 → Step 3
    const handleStep2Next = () => {
        if (!codeSent) {
            setErrors({ ...errors, general: '먼저 인증 코드를 전송해주세요' });
            return;
        }
        setCurrentStep(3);
    };

    // Step 3: 인증 코드 확인
    const handleVerifyCode = async () => {
        if (!code || code.length !== 6) {
            setErrors({ ...errors, code: '6자리 인증 코드를 입력해주세요' });
            return;
        }

        setIsLoading(true);
        setErrors({ ...errors, code: '', general: '' });

        try {
            const response = await verifyCode(email, code);

            if (response.valid) {
                setVerificationCode(code);
                setCurrentStep(4);
            } else {
                setErrors({ ...errors, code: response.message || '잘못된 인증 코드입니다' });
            }
        } catch (err: any) {
            setErrors({ ...errors, code: err.message || '인증 코드 확인 중 오류가 발생했습니다' });
        } finally {
            setIsLoading(false);
        }
    };

    // Step 4: 회원가입 완료
    const handleCompleteSignup = async () => {
        setIsLoading(true);
        setErrors({ ...errors, general: '' });

        try {
            await signup({
                name: nickname,
                email,
                password,
                verificationCode: code,
            });

            // 성공 시 모달 닫고 온보딩으로 이동
            handleClose();
            navigate('/onboarding/ott');
        } catch (err: any) {
            setErrors({ ...errors, general: err.message || '회원가입 중 오류가 발생했습니다' });
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 z-modal flex items-center justify-center p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white dark:bg-gray-800 w-[90%] md:w-full max-w-md rounded-xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
                {/* 닫기 버튼 */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors z-deco"
                >
                    <X size={24} />
                </button>

                {/* 헤더 */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        회원가입 🎬
                    </h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        무비서와 함께 영화 추천을 시작하세요
                    </p>
                    {/* 진행 표시기 */}
                    <div className="mt-4 flex gap-2">
                        {[1, 2, 3, 4].map((step) => (
                            <div
                                key={step}
                                className={`flex-1 h-1 rounded-full ${step <= currentStep ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Step 1: 사용자 정보 입력 */}
                {currentStep === 1 && (
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                                닉네임 *
                            </label>
                            <input
                                type="text"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                placeholder="사용하실 닉네임을 입력하세요"
                                className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border ${errors.nickname ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                    } rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors`}
                            />
                            {errors.nickname && (
                                <p className="text-red-500 text-sm mt-1">{errors.nickname}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                                이메일 *
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example@email.com"
                                className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                    } rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors`}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                                비밀번호 *
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="영문, 숫자 포함 8자 이상"
                                className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                    } rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors`}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                                비밀번호 확인 *
                            </label>
                            <input
                                type="password"
                                value={passwordConfirm}
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                                placeholder="비밀번호를 다시 입력하세요"
                                className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border ${errors.passwordConfirm ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                    } rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors`}
                            />
                            {errors.passwordConfirm && (
                                <p className="text-red-500 text-sm mt-1">{errors.passwordConfirm}</p>
                            )}
                        </div>

                        <button
                            onClick={handleStep1Next}
                            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors"
                        >
                            다음 단계
                        </button>
                    </div>
                )}

                {/* Step 2: 이메일 인증 코드 전송 */}
                {currentStep === 2 && (
                    <div className="p-6 space-y-4">
                        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600">
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">인증할 이메일</p>
                            <p className="text-gray-900 dark:text-white font-medium text-lg">{email}</p>
                        </div>

                        {!codeSent ? (
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-lg">
                                <p className="text-blue-700 dark:text-blue-300 text-sm">
                                    💡 아래 버튼을 클릭하면 이메일로 6자리 인증 코드가 전송됩니다.
                                </p>
                            </div>
                        ) : (
                            <div className="p-4 bg-green-50 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg">
                                <p className="text-green-700 dark:text-green-300 text-sm">
                                    ✅ 인증 코드가 전송되었습니다! 이메일을 확인해주세요.
                                </p>
                            </div>
                        )}

                        {errors.general && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
                                <p className="text-red-700 dark:text-red-300 text-sm">❌ {errors.general}</p>
                            </div>
                        )}

                        <div className="space-y-3">
                            {!codeSent ? (
                                <button
                                    onClick={handleSendCode}
                                    disabled={isLoading}
                                    className={`w-full py-3 font-bold rounded-lg transition-all ${isLoading
                                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                                        }`}
                                >
                                    {isLoading ? '전송 중...' : '인증 코드 전송'}
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handleStep2Next}
                                        className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors"
                                    >
                                        다음 단계
                                    </button>
                                    <button
                                        onClick={handleSendCode}
                                        disabled={isLoading}
                                        className="w-full py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        코드 재전송
                                    </button>
                                </>
                            )}

                            <button
                                onClick={() => setCurrentStep(1)}
                                className="w-full py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                                이전 단계
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: 인증 코드 입력 */}
                {currentStep === 3 && (
                    <div className="p-6 space-y-4">
                        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600">
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">전송된 이메일</p>
                            <p className="text-gray-900 dark:text-white font-medium">{email}</p>
                        </div>

                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-3">
                                인증 코드 (6자리)
                            </label>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => {
                                    const numericValue = e.target.value.replace(/\D/g, '').slice(0, 6);
                                    setCode(numericValue);
                                    setErrors({ ...errors, code: '' });
                                }}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && code.length === 6) {
                                        handleVerifyCode();
                                    }
                                }}
                                placeholder="000000"
                                maxLength={6}
                                className={`w-full px-4 py-4 text-center text-2xl font-bold tracking-widest bg-gray-50 dark:bg-gray-700 border ${errors.code ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                    } rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors`}
                            />
                            {errors.code && (
                                <p className="text-red-500 text-sm mt-2">{errors.code}</p>
                            )}
                        </div>

                        <div className="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-lg">
                            <p className="text-blue-700 dark:text-blue-300 text-sm">
                                💡 이메일을 받지 못하셨나요? 스팸 메일함을 확인해보세요.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={handleVerifyCode}
                                disabled={isLoading || code.length !== 6}
                                className={`w-full py-3 font-bold rounded-lg transition-all ${isLoading || code.length !== 6
                                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                                    }`}
                            >
                                {isLoading ? '확인 중...' : '인증 확인'}
                            </button>

                            <button
                                onClick={() => setCurrentStep(2)}
                                className="w-full py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                                이전 단계
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 4: 회원가입 완료 */}
                {currentStep === 4 && (
                    <div className="p-6 space-y-4">
                        <div className="space-y-4">
                            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600">
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">닉네임</p>
                                <p className="text-gray-900 dark:text-white font-medium text-lg">{nickname}</p>
                            </div>

                            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600">
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">이메일</p>
                                <p className="text-gray-900 dark:text-white font-medium">{email}</p>
                            </div>

                            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600">
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">비밀번호</p>
                                <p className="text-gray-900 dark:text-white font-medium">••••••••</p>
                            </div>

                            <div className="p-4 bg-green-50 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <span className="text-green-600 dark:text-green-400 text-xl">✅</span>
                                    <p className="text-green-700 dark:text-green-300 text-sm">이메일 인증 완료</p>
                                </div>
                            </div>
                        </div>

                        {errors.general && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
                                <p className="text-red-700 dark:text-red-300 text-sm">❌ {errors.general}</p>
                            </div>
                        )}

                        <div className="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-lg">
                            <p className="text-blue-700 dark:text-blue-300 text-sm">
                                💡 회원가입을 완료하면 OTT 및 장르 선호도 설정 페이지로 이동합니다.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={handleCompleteSignup}
                                disabled={isLoading}
                                className={`w-full py-3 font-bold rounded-lg transition-all ${isLoading
                                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                                    }`}
                            >
                                {isLoading ? '처리 중...' : '회원가입 완료하기'}
                            </button>

                            <button
                                onClick={() => setCurrentStep(3)}
                                disabled={isLoading}
                                className="w-full py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                이전 단계
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
