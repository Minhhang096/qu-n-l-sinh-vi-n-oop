"use client";

import { ReactNode } from "react";
import { useAuth, isAdminUser, isPortalUser } from "@/lib/auth-context";
import { PortalLayout } from "./PortalLayout";
import { AdminLayout } from "./AdminLayout";
import { Spinner } from "@/components/ui/spinner";

interface LayoutWrapperProps {
    children: ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
    const { user, isLoading, isAuthenticated } = useAuth();

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Spinner className="h-8 w-8 text-primary" />
                    <p className="text-sm text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    // If not authenticated, just render children (likely login page)
    if (!isAuthenticated || !user) {
        return <>{children}</>;
    }

    // Render appropriate layout based on user role
    if (isAdminUser(user.role)) {
        return <AdminLayout>{children}</AdminLayout>;
    }

    if (isPortalUser(user.role)) {
        return <PortalLayout>{children}</PortalLayout>;
    }

    // Fallback - shouldn't reach here
    return <>{children}</>;
}
