"use client";

import { LayoutWrapper } from "@/components/layouts";

export default function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <LayoutWrapper>{children}</LayoutWrapper>;
}
