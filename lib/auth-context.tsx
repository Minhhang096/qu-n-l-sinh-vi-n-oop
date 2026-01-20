"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, getStoredUser, removeToken, setStoredUser, UserDto, LoginRequest } from './api-client';

// ============================================
// Types
// ============================================

export type UserRole = 'Student' | 'Teacher' | 'Department' | 'Admin';

export interface AuthState {
    user: UserDto | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

interface AuthContextType extends AuthState {
    login: (credentials: LoginCredentials) => Promise<{ success: boolean; message?: string; user?: UserDto }>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================
// Auth Provider Component
// ============================================

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: true,
    });

    // Load auth state from localStorage on mount
    useEffect(() => {
        const stored = getStoredUser();
        if (stored) {
            setAuthState({
                user: stored,
                isAuthenticated: true,
                isLoading: false,
            });
            // Optionally verify token with backend
            authApi.getCurrentUser().then(response => {
                if (response.success && response.data) {
                    setStoredUser(response.data);
                    setAuthState({
                        user: response.data,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } else {
                    // Token invalid, clear auth
                    removeToken();
                    setAuthState({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                    });
                }
            }).catch((err) => {
                console.error('Error checking auth:', err);
                // Network error - keep cached user
                setAuthState(prev => ({ ...prev, isLoading: false }));
            });
        } else {
            // No stored user, don't try to fetch
            setAuthState({
                user: null,
                isAuthenticated: false,
                isLoading: false,
            });
        }
    }, []);

    // Login function
    const login = useCallback(async (credentials: LoginCredentials): Promise<{ success: boolean; message?: string; user?: UserDto }> => {
        try {
            const response = await authApi.login({
                username: credentials.username,
                password: credentials.password,
            } as LoginRequest);

            if (response.success && response.user) {
                setAuthState({
                    user: response.user,
                    isAuthenticated: true,
                    isLoading: false,
                });
                return { success: true, user: response.user };
            }

            return { success: false, message: response.message || 'Login failed' };
        } catch (error) {
            return { success: false, message: error instanceof Error ? error.message : 'Network error' };
        }
    }, []);

    // Logout function
    const logout = useCallback(() => {
        authApi.logout();
        setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
        });
    }, []);

    // Refresh user data
    const refreshUser = useCallback(async () => {
        const response = await authApi.getCurrentUser();
        if (response.success && response.data) {
            setStoredUser(response.data);
            setAuthState({
                user: response.data,
                isAuthenticated: true,
                isLoading: false,
            });
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                ...authState,
                login,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// ============================================
// useAuth Hook
// ============================================

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// ============================================
// Helper Functions
// ============================================

export function getUserDisplayName(user: UserDto | null): string {
    if (!user) return 'User';
    return user.fullName || user.username;
}

export function getUserInitials(user: UserDto | null): string {
    if (!user?.fullName) return user?.username?.charAt(0).toUpperCase() || 'U';
    const names = user.fullName.split(' ');
    return names.map(n => n.charAt(0)).slice(0, 2).join('').toUpperCase();
}

export function getRoleDashboardPath(role: string): string {
    switch (role) {
        case 'Admin':
            return '/admin';
        case 'Student':
            return '/student';
        case 'Teacher':
            return '/teacher';
        case 'Department':
            return '/department';
        default:
            return '/';
    }
}

export function isPortalUser(role: string): boolean {
    return role === 'Student' || role === 'Teacher' || role === 'Department';
}

export function isAdminUser(role: string): boolean {
    return role === 'Admin';
}

// Helper to get user avatar (for compatibility)
export function getUserAvatar(user: UserDto | null): string | undefined {
    return undefined; // API doesn't return avatar yet
}
