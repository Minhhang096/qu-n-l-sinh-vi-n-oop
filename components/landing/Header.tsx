"use client";

import Link from "next/link";
import { GraduationCap, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export function Header() {
    const navItems = [
        { title: "Giới thiệu", href: "#about" },
        { title: "Chương trình", href: "#programs" },
        { title: "Tuyển sinh", href: "#admissions" },
        { title: "Đời sống", href: "#campus" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="container mx-auto relative flex h-16 items-center justify-between px-4 md:px-6">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 shrink-0">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                        <GraduationCap className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                        <span className="text-lg font-bold tracking-tight">Đại học Apex</span>
                    </div>
                </Link>

                {/* Desktop Navigation - Absolutely Centered */}
                <nav className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center gap-6">
                    {navItems.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {item.title}
                        </a>
                    ))}
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-2 shrink-0">
                    <ThemeToggle />
                    <div className="hidden md:flex items-center gap-2">
                        <Button variant="ghost" asChild>
                            <Link href="/login">Đăng nhập</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/register">Đăng ký ngay</Link>
                        </Button>
                    </div>

                    {/* Mobile Menu */}
                    <Sheet>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                            <div className="flex flex-col gap-4 mt-6">
                                {navItems.map((item) => (
                                    <a
                                        key={item.href}
                                        href={item.href}
                                        className="text-lg font-medium hover:text-primary transition-colors"
                                    >
                                        {item.title}
                                    </a>
                                ))}
                                <div className="flex flex-col gap-2 mt-4">
                                    <Button variant="outline" asChild className="w-full">
                                        <Link href="/login">Đăng nhập</Link>
                                    </Button>
                                    <Button asChild className="w-full">
                                        <Link href="/register">Đăng ký ngay</Link>
                                    </Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
