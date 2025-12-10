// [용도] 이메일 인증 모달 컴포넌트
// [사용법] SignupModal에서 회원가입 성공 후 호출

import { useState, useEffect } from "react";
import { verifyEmail, resendVerificationCode } from "../../../../api/onboardingApi";
import { useNavigate } from "react-router-dom";

interface VerificationModalProps {
    email: string;
    onClose: () => void;
}

export default function VerificationModal({ email, onClose }: VerificationModalProps) {
    const navigate = useNavigate();
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [timeLeft, setTimeLeft] = useState(60);
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState("");

    // 60초 카운트다운
    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    // 코드 입력 처리
    const handleCodeChange = (index: number, value: string) => {
        if (value.length > 1) return; // 한 글자만 입력 가능
        if (!/^\d*$/.test(value)) return; // 숫자만 입력 가능

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // 다음 입력 필드로 자동 이동
        if (value && index < 5) {
            const nextInput = document.getElementById(`code-${index + 1}`);
            nextInput?.focus();
        }
    };

    // 백스페이스 처리
    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            const prevInput = document.getElementById(`code-${index - 1}`);
            prevInput?.focus();
        }
    };

    // 인증 코드 제출
    const handleVerify = async () => {
        const verificationCode = code.join("");

        if (verificationCode.length !== 6) {
            setError("6자리 인증 코드를 입력해주세요");
            return;
        }

        setIsVerifying(true);
        setError("");

        try {
            await verifyEmail({ email, code: verificationCode });

            // 인증 성공 시 OTT 선택 페이지로 이동
            onClose();
            navigate("/onboarding/ott");
        } catch (err: any) {
            setError(err.message || "인증에 실패했습니다");
        } finally {
            setIsVerifying(false);
        }
    };

    // 인증 코드 재전송
    const handleResend = async () => {
        if (timeLeft > 0) return;

        try {
            await resendVerificationCode(email);
            setTimeLeft(60);
            setCode(["", "", "", "", "", ""]);
            setError("");
        } catch (err: any) {
            setError(err.message || "재전송에 실패했습니다");
        }
    };

    // ESC 키로 닫기
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-modal p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-800">
                {/* 헤더 */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">
                        이메일 인증
                    </h2>
                    <p className="text-gray-400 text-sm">
                        {email}로 전송된 6자리 인증 코드를 입력해주세요
                    </p>
                </div>

                {/* 6자리 코드 입력 */}
                <div className="flex gap-2 justify-center mb-6">
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            id={`code-${index}`}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleCodeChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className="w-12 h-14 text-center text-2xl font-bold bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                        />
                    ))}
                </div>

                {/* 에러 메시지 */}
                {error && (
                    <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
                )}

                {/* 타이머 & 재전송 */}
                <div className="flex justify-between items-center mb-6 text-sm">
                    <span className="text-gray-400">
                        남은 시간: <span className="text-white font-bold">{timeLeft}초</span>
                    </span>
                    <button
                        onClick={handleResend}
                        disabled={timeLeft > 0}
                        className={`${timeLeft > 0
                            ? "text-gray-600 cursor-not-allowed"
                            : "text-blue-500 hover:text-blue-400"
                            } font-medium transition-colors`}
                    >
                        재전송
                    </button>
                </div>

                {/* 인증 버튼 */}
                <button
                    onClick={handleVerify}
                    disabled={isVerifying || code.join("").length !== 6}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isVerifying ? "인증 중..." : "인증하기"}
                </button>

                {/* 닫기 버튼 */}
                <button
                    onClick={onClose}
                    className="w-full mt-3 py-2 text-gray-400 hover:text-white transition-colors"
                >
                    취소
                </button>
            </div>
        </div>
    );
}
