// SignupModal.tsx - 리팩토링 버전 (useSignupForm 훅 사용)

import { X, CheckCircle2, XCircle, Loader2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { SignupModalProps } from "./signupModal.types";
import { useSignupForm } from "../../hooks";

export default function SignupModal({ isOpen, onClose }: SignupModalProps) {
    const navigate = useNavigate();

    // ✅ 모든 로직을 useSignupForm 훅에서 가져옴
    const {
        // 이메일
        email,
        emailStatus,
        emailError,
        isEmailValid,
        handleEmailChange,

        // 닉네임
        nickname,
        nicknameStatus,
        nicknameError,
        handleNicknameChange,

        // 비밀번호
        password,
        passwordConfirm,
        passwordError,
        passwordConfirmError,
        isPasswordValid,
        isPasswordMatch,
        handlePasswordChange,
        handlePasswordConfirmChange,

        // 인증 코드
        code,
        codeSent,
        codeVerified,
        codeError,
        setCode,
        handleSendCode,
        handleVerifyCode,

        // 공통
        generalError,
        isSubmitting,
        isLoading,
        canSignup,
        progress,

        // 액션
        handleSignup,
        resetForm,
    } = useSignupForm();

    // 모달 닫기 핸들러
    const handleClose = () => {
        resetForm();
        onClose();
    };

    // 회원가입 완료 핸들러
    const handleSubmitSignup = async () => {
        const result = await handleSignup();
        if (result?.success) {
            handleClose();
            navigate("/onboarding/ott");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-modal p-4">
            <div className="bg-white dark:bg-gray-800 w-[90%] max-w-md rounded-xl p-6 relative space-y-6 max-h-[90vh] overflow-y-auto">
                {/* CLOSE */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                    <X size={24} />
                </button>

                {/* HEADER */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        회원가입 🎬
                    </h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        무비서와 함께 영화 추천을 시작하세요
                    </p>

                    {/* 진행 상황 표시 */}
                    <div className="mt-4 flex gap-2">
                        <div
                            className={`flex-1 h-1 rounded-full transition-colors ${progress.email ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
                                }`}
                        />
                        <div
                            className={`flex-1 h-1 rounded-full transition-colors ${progress.info ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
                                }`}
                        />
                    </div>
                </div>

                {/* SECTION 1: 이메일 인증 */}
                <section className="border-b border-gray-200 dark:border-gray-700 pb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            1. 이메일 인증
                        </h3>
                        {progress.email && (
                            <span className="text-green-500 text-xl">✓</span>
                        )}
                    </div>

                    <div className="space-y-3">
                        {/* EMAIL INPUT */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                이메일 *
                            </label>
                            <div className="relative">
                                <input
                                    value={email}
                                    onChange={(e) => handleEmailChange(e.target.value)}
                                    placeholder="example@email.com"
                                    className={`w-full px-4 py-3 pr-12 rounded-lg border ${emailStatus === 'invalid' || emailStatus === 'duplicate'
                                        ? "border-red-500"
                                        : emailStatus === 'checking'
                                            ? "border-blue-400"
                                            : emailStatus === 'valid'
                                                ? "border-green-500"
                                                : "border-gray-300 dark:border-gray-600"
                                        } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors`}
                                    disabled={codeVerified}
                                />
                                {/* 검증 상태 아이콘 */}
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    {emailStatus === 'checking' && (
                                        <Loader2 className="animate-spin text-blue-500" size={20} />
                                    )}
                                    {emailStatus === 'valid' && (
                                        <CheckCircle2 className="text-green-500" size={20} />
                                    )}
                                    {(emailStatus === 'invalid' || emailStatus === 'duplicate') && (
                                        <XCircle className="text-red-500" size={20} />
                                    )}
                                </div>
                            </div>

                            {/* 에러 메시지 */}
                            {emailError && (
                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                    <AlertCircle size={14} />
                                    {emailError}
                                </p>
                            )}

                            {/* 성공 메시지 */}
                            {emailStatus === 'valid' && !emailError && (
                                <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                                    <CheckCircle2 size={14} />
                                    사용 가능한 이메일입니다
                                </p>
                            )}

                            {/* 검증 중 메시지 */}
                            {emailStatus === 'checking' && (
                                <p className="text-blue-500 text-sm mt-1 flex items-center gap-1">
                                    <Loader2 size={14} className="animate-spin" />
                                    이메일 중복 확인 중...
                                </p>
                            )}
                        </div>

                        {/* 인증번호 섹션 */}
                        {isEmailValid && !codeVerified && (
                            <>
                                {!codeSent ? (
                                    <button
                                        onClick={handleSendCode}
                                        disabled={isLoading}
                                        className={`w-full py-3 rounded-lg font-bold transition-colors ${isLoading
                                            ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                                            : "bg-blue-500 hover:bg-blue-600 text-white"
                                            }`}
                                    >
                                        {isLoading ? "전송 중..." : "인증번호 받기"}
                                    </button>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-lg">
                                            <p className="text-blue-700 dark:text-blue-300 text-sm">
                                                📧 이메일로 6자리 인증번호가 전송되었습니다
                                            </p>
                                        </div>

                                        <input
                                            value={code}
                                            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                            onKeyPress={(e) => {
                                                if (e.key === "Enter" && code.length === 6) {
                                                    handleVerifyCode();
                                                }
                                            }}
                                            className={`w-full px-4 py-3 text-center text-xl font-bold tracking-widest rounded-lg border ${codeError
                                                ? "border-red-500"
                                                : "border-gray-300 dark:border-gray-600"
                                                } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-blue-500`}
                                            placeholder="000000"
                                            maxLength={6}
                                        />

                                        {codeError && (
                                            <p className="text-red-500 text-sm">{codeError}</p>
                                        )}

                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleVerifyCode}
                                                disabled={isLoading || code.length !== 6}
                                                className={`flex-1 py-3 rounded-lg font-bold transition-colors ${isLoading || code.length !== 6
                                                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                                                    : "bg-blue-500 hover:bg-blue-600 text-white"
                                                    }`}
                                            >
                                                {isLoading ? "확인 중..." : "인증 확인"}
                                            </button>

                                            <button
                                                onClick={handleSendCode}
                                                disabled={isLoading}
                                                className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
                                            >
                                                재전송
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {codeVerified && (
                            <div className="p-3 bg-green-50 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <span className="text-green-600 dark:text-green-400 text-xl">✓</span>
                                    <p className="text-green-700 dark:text-green-300 font-medium">
                                        이메일 인증 완료
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* SECTION 2: 계정 정보 */}
                <section className="pb-4">
                    <div className="flex items-center gap-2 mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            2. 계정 정보
                        </h3>
                        {progress.info && (
                            <span className="text-green-500 text-xl">✓</span>
                        )}
                    </div>

                    <div className="space-y-4">
                        {/* 닉네임 */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                닉네임 *
                            </label>
                            <div className="relative">
                                <input
                                    value={nickname}
                                    onChange={(e) => handleNicknameChange(e.target.value)}
                                    placeholder="사용하실 닉네임을 입력하세요"
                                    className={`w-full px-4 py-3 pr-12 rounded-lg border ${nicknameStatus === 'invalid' || nicknameStatus === 'duplicate'
                                        ? "border-red-500"
                                        : nicknameStatus === 'checking'
                                            ? "border-blue-400"
                                            : nicknameStatus === 'valid'
                                                ? "border-green-500"
                                                : "border-gray-300 dark:border-gray-600"
                                        } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors`}
                                />
                                {/* 검증 상태 아이콘 */}
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    {nicknameStatus === 'checking' && (
                                        <Loader2 className="animate-spin text-blue-500" size={20} />
                                    )}
                                    {nicknameStatus === 'valid' && (
                                        <CheckCircle2 className="text-green-500" size={20} />
                                    )}
                                    {(nicknameStatus === 'invalid' || nicknameStatus === 'duplicate') && (
                                        <XCircle className="text-red-500" size={20} />
                                    )}
                                </div>
                            </div>

                            {/* 에러 메시지 */}
                            {nicknameError && (
                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                    <AlertCircle size={14} />
                                    {nicknameError}
                                </p>
                            )}

                            {/* 성공 메시지 */}
                            {nicknameStatus === 'valid' && !nicknameError && (
                                <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                                    <CheckCircle2 size={14} />
                                    사용 가능한 닉네임입니다
                                </p>
                            )}

                            {/* 검증 중 메시지 */}
                            {nicknameStatus === 'checking' && (
                                <p className="text-blue-500 text-sm mt-1 flex items-center gap-1">
                                    <Loader2 size={14} className="animate-spin" />
                                    닉네임 중복 확인 중...
                                </p>
                            )}
                        </div>

                        {/* 비밀번호 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                비밀번호 *
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => handlePasswordChange(e.target.value)}
                                className={`w-full px-4 py-3 rounded-lg border ${passwordError
                                    ? "border-red-500"
                                    : password && isPasswordValid
                                        ? "border-green-500"
                                        : "border-gray-300 dark:border-gray-600"
                                    } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors`}
                                placeholder="영문, 숫자 포함 8자 이상"
                            />
                            {passwordError && (
                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                    <AlertCircle size={14} />
                                    {passwordError}
                                </p>
                            )}
                            {password && isPasswordValid && !passwordError && (
                                <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                                    <CheckCircle2 size={14} />
                                    안전한 비밀번호입니다
                                </p>
                            )}
                        </div>

                        {/* 비밀번호 확인 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                비밀번호 확인 *
                            </label>
                            <input
                                type="password"
                                value={passwordConfirm}
                                onChange={(e) => handlePasswordConfirmChange(e.target.value)}
                                className={`w-full px-4 py-3 rounded-lg border ${!isPasswordMatch && passwordConfirm
                                    ? "border-red-500"
                                    : isPasswordMatch && passwordConfirm
                                        ? "border-green-500"
                                        : "border-gray-300 dark:border-gray-600"
                                    } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors`}
                                placeholder="비밀번호를 다시 입력하세요"
                            />
                            {passwordConfirmError && (
                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                    <AlertCircle size={14} />
                                    {passwordConfirmError}
                                </p>
                            )}
                            {isPasswordMatch && passwordConfirm && (
                                <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                                    <CheckCircle2 size={14} />
                                    비밀번호가 일치합니다
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                {/* 오류 메시지 */}
                {generalError && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
                        <p className="text-red-700 dark:text-red-300 text-sm text-center">
                            {generalError}
                        </p>
                    </div>
                )}

                {/* 회원가입 버튼 */}
                <button
                    disabled={!canSignup || isSubmitting}
                    onClick={handleSubmitSignup}
                    className={`w-full py-3 rounded-lg font-bold transition-all ${canSignup && !isSubmitting
                        ? "bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl"
                        : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        }`}
                >
                    {isSubmitting ? "처리 중..." : "회원가입 완료"}
                </button>

                {!canSignup && (
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                        모든 항목을 입력하고 이메일 인증을 완료해주세요
                    </p>
                )}
            </div>
        </div>
    );
}