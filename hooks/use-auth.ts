"use client";

export { 
    useAuth, 
    getUserDisplayName, 
    getUserInitials, 
    getRoleDashboardPath, 
    isPortalUser, 
    isAdminUser,
    getUserAvatar,
    AuthProvider
} from '@/lib/auth-context';

export type { UserRole, AuthState, LoginCredentials } from '@/lib/auth-context';
