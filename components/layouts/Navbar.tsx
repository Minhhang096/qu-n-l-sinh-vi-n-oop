"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    GraduationCap,
    BookOpen,
    Bell,
    Settings,
    LayoutDashboard,
    Users,
    Microscope,
    Plus,
    Layers,
    BarChart3,
    LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuth, getUserDisplayName, getUserInitials, getRoleDashboardPath } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

interface NavItem {
    title: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
}

// Navigation items per role
const getNavItems = (role: string): NavItem[] => {
    switch (role) {
        case 'Student':
            return [
                { title: 'Trang chủ', href: '/student', icon: LayoutDashboard },
                { title: 'Môn học', href: '/student/courses', icon: BookOpen },
                { title: 'Đăng ký', href: '/student/registration', icon: Plus },
                { title: 'Điểm số', href: '/student/grades', icon: GraduationCap },
            ];
        case 'Teacher':
            return [
                { title: 'Trang chủ', href: '/teacher', icon: LayoutDashboard },
                { title: 'Lớp giảng dạy', href: '/teacher/classes', icon: BookOpen },
            ];
        case 'Department':
            return [
                { title: 'Trang chủ', href: '/department', icon: LayoutDashboard },
                { title: 'Môn học', href: '/department/courses', icon: BookOpen },
                { title: 'Học phần', href: '/department/sections', icon: Layers },
                { title: 'Sinh viên', href: '/department/students', icon: Users },
                { title: 'Đăng ký học', href: '/department/enrollments', icon: GraduationCap },
                { title: 'Báo cáo', href: '/department/reports', icon: BarChart3 },
            ];
        default:
            return [];
    }
};

interface NavbarProps {
    className?: string;
}

export function Navbar({ className }: NavbarProps) {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    if (!user) return null;

    const navItems = getNavItems(user.role);
    const displayName = getUserDisplayName(user);
    const initials = getUserInitials(user);

    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    return (
        <header className={cn(
            "sticky top-0 z-50 w-full items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
            className
        )}>
            <div className="container w-full mx-auto relative flex h-16 items-center justify-between px-4 md:px-6">
                {/* Logo */}
                <Link href={getRoleDashboardPath(user.role)} className="flex items-center gap-2 shrink-0">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                        <GraduationCap className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="hidden sm:block">
                        <span className="text-lg font-bold tracking-tight">Đại học Apex</span>
                    </div>
                </Link>

                {/* Navigation Links - Absolutely Centered */}
                <nav className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center gap-1">
                    {navItems.map((item) => {
                        const isRootDashboard = item.href.split('/').length === 2;
                        const isActive = isRootDashboard
                            ? pathname === item.href
                            : pathname === item.href || pathname.startsWith(item.href + '/');
                        const Icon = item.icon;
                        return (
                            <Link key={item.href} href={item.href}>
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    size="sm"
                                    className={cn(
                                        "gap-2 transition-all duration-200",
                                        isActive && "bg-primary/10 text-primary hover:bg-primary/15"
                                    )}
                                >
                                    {Icon && <Icon className="h-4 w-4" />}
                                    <span>{item.title}</span>
                                </Button>
                            </Link>
                        );
                    })}
                </nav>

                {/* Right Side - Notifications, Theme, Profile */}
                <div className="flex items-center gap-2 shrink-0">
                    {/* Notifications */}
                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        <Badge
                            variant="destructive"
                            className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                        >
                            3
                        </Badge>
                    </Button>

                    {/* Theme Toggle */}
                    <ThemeToggle />

                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                                <Avatar className="h-9 w-9">
                                    <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{displayName}</p>
                                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                    <Badge variant="outline" className="w-fit mt-1 text-xs">
                                        {user.role}
                                    </Badge>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/profile" className="cursor-pointer">
                                    <Settings className="mr-2 h-4 w-4" />
                                    Cài đặt hồ sơ
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="cursor-pointer text-destructive focus:text-destructive"
                                onClick={handleLogout}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Đăng xuất
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden border-t">
                <nav className="container flex items-center gap-1 overflow-x-auto py-2 px-4 scrollbar-thin">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                        const Icon = item.icon;
                        return (
                            <Link key={item.href} href={item.href}>
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    size="sm"
                                    className={cn(
                                        "gap-1.5 whitespace-nowrap",
                                        isActive && "bg-primary/10 text-primary hover:bg-primary/15"
                                    )}
                                >
                                    {Icon && <Icon className="h-4 w-4" />}
                                    <span className="text-xs">{item.title}</span>
                                </Button>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </header>
    );
}
