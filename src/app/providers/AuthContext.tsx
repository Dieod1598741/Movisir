// [용도] 전역 인증 상태 관리 Context
// [사용법] 
// App.tsx에서: <AuthProvider><App /></AuthProvider>
// 컴포넌트에서: const { user, isAuthenticated, login, logout } = useAuth();

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import * as authApi from '../../api/authApi';
import * as userApi from '../../api/userApi';
import type { User } from '../../api/authApi.type';

interface AuthContextType {
    user: Omit<User, 'password'> | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, name: string) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<Omit<User, 'password'> | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // 컴포넌트 마운트 시 localStorage에서 사용자 정보 복원
    useEffect(() => {
        const savedUser = authApi.getCurrentUser();
        if (savedUser) {
            setUser(savedUser);
        }
        setIsLoading(false);
    }, []);

    // 로그인
    const login = async (email: string, password: string) => {
        try {
            const response = await authApi.login({ email, password });
            setUser(response.user);
            authApi.saveUser(response.user);
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('로그인에 실패했습니다');
        }
    };

    // 회원가입
    const signup = async (email: string, password: string, name: string) => {
        try {
            const response = await authApi.signup({ email, password, name });
            setUser(response.user);
            authApi.saveUser(response.user);
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('회원가입에 실패했습니다');
        }
    };

    // 로그아웃
    const logout = () => {
        setUser(null);
        authApi.logout();
    };

    // 사용자 정보 새로고침 (프로필 업데이트 후 등)
    const refreshUser = async () => {
        if (!user) return;

        try {
            // 최신 사용자 정보를 서버에서 가져오기
            const response = await userApi.getUser(user.id);
            const updatedUser = response.data;
            setUser(updatedUser);
            authApi.saveUser(updatedUser);
        } catch (error) {
            console.error('사용자 정보 새로고침 실패:', error);
        }
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        refreshUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// useAuth 훅
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
