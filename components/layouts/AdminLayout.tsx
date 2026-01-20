"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    GraduationCap,
    LayoutDashboard,
    Users,
    BookOpen,
    Shield,
    Bell,
    UserCog,
    LogOut,
    ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarProvider,
    SidebarRail,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth, getUserDisplayName, getUserInitials } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { TooltipProvider } from "@/components/ui/tooltip";

// Admin navigation structure
const adminNavItems = [
    {
        title: "Trang chủ",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Quản lý người dùng",
        icon: Users,
        children: [
            { title: "Tất cả người dùng", href: "/admin/users" },
            { title: "Sinh viên", href: "/admin/users/students" },
            { title: "Giảng viên", href: "/admin/users/teachers" },
            { title: "Nhân viên", href: "/admin/users/staff" },
            { title: "Vai trò & Phân quyền", href: "/admin/users/roles" },
        ],
    },
    {
        title: "Học vụ",
        icon: BookOpen,
        children: [
            { title: "Môn học", href: "/admin/courses" },
            { title: "Khoa", href: "/admin/departments" },
            { title: "Học kỳ", href: "/admin/semesters" },
            { title: "Đăng ký học", href: "/admin/enrollments" },
        ],
    },
];

interface AdminLayoutProps {
    children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    if (!user) return null;

    const displayName = getUserDisplayName(user);
    const initials = getUserInitials(user);

    const handleLogout = () => {
        logout();
        window.location.href = "/";
    };

    return (
        <TooltipProvider delayDuration={0}>
            <SidebarProvider>
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="h-full"
                >
                    <Sidebar collapsible="icon" className="border-r">
                        {/* Header with Logo */}
                        <SidebarHeader>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton size="lg" asChild>
                                        <Link href="/admin" className="group">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
                                                <GraduationCap className="h-4 w-4 text-primary-foreground" />
                                            </div>
                                            <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
                                                <span className="font-semibold">Đại học Apex</span>
                                                <span className="text-xs text-muted-foreground">
                                                    Bảng quản trị
                                                </span>
                                            </div>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarHeader>

                        {/* Navigation Content */}
                        <SidebarContent className="scrollbar-thin">
                            <SidebarGroup>
                                <SidebarGroupLabel>Điều hướng</SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        {adminNavItems.map((item) => {
                                            if (!item.children) {
                                                // Simple menu item
                                                const isActive = pathname === item.href;
                                                return (
                                                    <SidebarMenuItem key={item.title}>
                                                        <SidebarMenuButton
                                                            asChild
                                                            isActive={isActive}
                                                            tooltip={item.title}
                                                        >
                                                            <Link href={item.href!}>
                                                                <item.icon className="h-4 w-4" />
                                                                <span>{item.title}</span>
                                                            </Link>
                                                        </SidebarMenuButton>
                                                    </SidebarMenuItem>
                                                );
                                            }

                                            // Collapsible menu item with children
                                            const isChildActive = item.children.some(
                                                (child) =>
                                                    pathname === child.href ||
                                                    pathname.startsWith(child.href + "/")
                                            );

                                            return (
                                                <Collapsible
                                                    key={item.title}
                                                    asChild
                                                    defaultOpen={isChildActive}
                                                    className="group/collapsible"
                                                >
                                                    <SidebarMenuItem>
                                                        <CollapsibleTrigger asChild>
                                                            <SidebarMenuButton
                                                                tooltip={item.title}
                                                                isActive={isChildActive}
                                                            >
                                                                <item.icon className="h-4 w-4" />
                                                                <span>{item.title}</span>
                                                                <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                            </SidebarMenuButton>
                                                        </CollapsibleTrigger>
                                                        <CollapsibleContent>
                                                            <SidebarMenuSub>
                                                                {item.children.map((child) => {
                                                                    const isActive = pathname === child.href;
                                                                    return (
                                                                        <SidebarMenuSubItem key={child.title}>
                                                                            <SidebarMenuSubButton
                                                                                asChild
                                                                                isActive={isActive}
                                                                            >
                                                                                <Link href={child.href}>
                                                                                    <span>{child.title}</span>
                                                                                </Link>
                                                                            </SidebarMenuSubButton>
                                                                        </SidebarMenuSubItem>
                                                                    );
                                                                })}
                                                            </SidebarMenuSub>
                                                        </CollapsibleContent>
                                                    </SidebarMenuItem>
                                                </Collapsible>
                                            );
                                        })}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>

                            {/* Quick Actions */}
                            <SidebarGroup>
                                <SidebarGroupLabel>Thao tác nhanh</SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton asChild tooltip="Thêm người dùng">
                                                <Link href="/admin/users/new">
                                                    <UserCog className="h-4 w-4" />
                                                    <span>Thêm người dùng</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        </SidebarContent>

                        {/* Footer with User */}
                        <SidebarFooter className="border-t">
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <SidebarMenuButton
                                                size="lg"
                                                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                            >
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback className="bg-primary text-primary-foreground font-medium text-sm">
                                                        {initials}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="grid flex-1 text-left text-sm leading-tight">
                                                    <span className="truncate font-semibold">
                                                        {displayName}
                                                    </span>
                                                    <span className="truncate text-xs text-muted-foreground">
                                                        {user.email}
                                                    </span>
                                                </div>
                                                <Badge
                                                    variant="outline"
                                                    className="ml-auto text-xs bg-primary/10 text-primary border-primary/20"
                                                >
                                                    Admin
                                                </Badge>
                                            </SidebarMenuButton>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
                                            side="top"
                                            align="start"
                                            sideOffset={4}
                                        >
                                            <DropdownMenuLabel className="font-normal">
                                                <div className="flex flex-col space-y-1">
                                                    <p className="text-sm font-medium leading-none">
                                                        {displayName}
                                                    </p>
                                                    <p className="text-xs leading-none text-muted-foreground">
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem asChild>
                                                <Link href="/admin/profile">
                                                    <UserCog className="mr-2 h-4 w-4" />
                                                    Cài đặt hồ sơ
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href="/admin/settings/security">
                                                    <Shield className="mr-2 h-4 w-4" />
                                                    Bảo mật
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className="text-destructive focus:text-destructive"
                                                onClick={handleLogout}
                                            >
                                                <LogOut className="mr-2 h-4 w-4" />
                                                Đăng xuất
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarFooter>

                        <SidebarRail />
                    </Sidebar>
                </motion.div>

                {/* Main Content Area */}
                <SidebarInset>
                    {/* Top Bar */}
                    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
                        <SidebarTrigger className="-ml-1" />

                        {/* Breadcrumb or Page Title could go here */}
                        <div className="flex-1" />

                        {/* Right side actions */}
                        <div className="flex items-center gap-2">
                            <ThemeToggle />
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="relative flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent">
                                        <Bell className="h-5 w-5" />
                                        <Badge
                                            variant="destructive"
                                            className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                                        >
                                            5
                                        </Badge>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-80">
                                    <DropdownMenuLabel>Thông báo</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <div className="p-2 text-sm text-muted-foreground text-center">
                                        Không có thông báo mới
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </header>

                    {/* Page Content */}
                    <main className="flex-1 overflow-auto p-6 md:p-8 max-w-[1600px] mx-auto w-full">
                        {children}
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </TooltipProvider>
    );
}
