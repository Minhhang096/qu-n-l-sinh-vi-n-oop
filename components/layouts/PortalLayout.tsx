"use client";

import { ReactNode } from "react";
import { Navbar } from "./Navbar";

interface PortalLayoutProps {
    children: ReactNode;
}

export function PortalLayout({ children }: PortalLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
                {children}
            </main>
        </div>
    );
}
