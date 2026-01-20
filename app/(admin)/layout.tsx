"use client";

import { LayoutWrapper } from "@/components/layouts";

export default function AdminGroupLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <LayoutWrapper>{children}</LayoutWrapper>;
}
