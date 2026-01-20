"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen, Shield, Activity, Building2, GraduationCap, ArrowRight, Loader2 } from "lucide-react";
import { useAuth, getUserDisplayName } from "@/lib/auth-context";
import { statsApi, DashboardStatsDto } from "@/lib/api-client";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function AdminDashboard() {
    const { user } = useAuth();
    const displayName = user ? getUserDisplayName(user) : "Administrator";
    
    const [stats, setStats] = useState<DashboardStatsDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const response = await statsApi.getDashboard();
                if (response.success && response.data) {
                    setStats(response.data);
                }
            } catch (error) {
                console.error("Failed to load dashboard stats");
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, []);

    const statCards = [
        { title: "Tổng sinh viên", value: stats?.totalStudents?.toString() || "0", icon: GraduationCap, color: "text-blue-500", bgColor: "bg-blue-500/10" },
        { title: "Tổng giảng viên", value: stats?.totalTeachers?.toString() || "0", icon: Users, color: "text-purple-500", bgColor: "bg-purple-500/10" },
        { title: "Tổng môn học", value: stats?.totalCourses?.toString() || "0", icon: BookOpen, color: "text-green-500", bgColor: "bg-green-500/10" },
        { title: "Số khoa", value: stats?.totalDepartments?.toString() || "0", icon: Building2, color: "text-amber-500", bgColor: "bg-amber-500/10" },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={container}
            className="space-y-8"
        >
            <motion.div variants={item} className="space-y-2">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    Bảng quản trị
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                    Chào mừng, <span className="text-primary">{displayName}</span>
                </h1>
                <p className="text-muted-foreground mt-2 text-base md:text-lg">
                    Tổng quan hệ thống và điều khiển quản trị.
                </p>
            </motion.div>

            <motion.div
                variants={container}
                className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div key={stat.title} variants={item}>
                            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] relative overflow-hidden">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        {stat.title}
                                    </CardTitle>
                                    <div className={`h-10 w-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                                        <Icon className={`h-5 w-5 ${stat.color}`} />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                                </CardContent>
                                <div className={`absolute inset-x-0 bottom-0 h-1 ${stat.bgColor}`} />
                            </Card>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* System Status */}
            <motion.div variants={item} className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Trạng thái hệ thống</CardTitle>
                            <CardDescription>Sức khỏe hệ thống hiện tại</CardDescription>
                        </div>
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                            <Activity className="h-3 w-3 mr-1" /> Tốt
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <span className="text-sm">Kết nối Database</span>
                                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600">Đã kết nối</Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <span className="text-sm">Trạng thái API</span>
                                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600">Hoạt động</Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <span className="text-sm">Xác thực</span>
                                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600">An toàn</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Bảo mật</CardTitle>
                            <CardDescription>Tổng quan bảo mật</CardDescription>
                        </div>
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                            <Shield className="h-3 w-3 mr-1" /> An toàn
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <span className="text-sm">Phiên đang hoạt động</span>
                                <Badge variant="outline">12</Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <span className="text-sm">Đăng nhập thất bại (24h)</span>
                                <Badge variant="outline">3</Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <span className="text-sm">Quét bảo mật lần cuối</span>
                                <Badge variant="outline">Hôm nay</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div variants={item}>
                <Card>
                    <CardHeader>
                        <CardTitle>Thao tác nhanh</CardTitle>
                        <CardDescription>Điều khiển và quản lý hệ thống</CardDescription>
                    </CardHeader>
                    <CardContent className="text-muted-foreground">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Link href="/admin/users">
                                <div className="p-4 border rounded-lg hover:bg-accent hover:border-primary/50 transition-all cursor-pointer">
                                    <Users className="h-8 w-8 text-primary mb-3" />
                                    <h3 className="font-medium mb-1">Quản lý người dùng</h3>
                                    <p className="text-sm text-muted-foreground">Quản lý tài khoản người dùng</p>
                                </div>
                            </Link>
                            <Link href="/admin/departments">
                                <div className="p-4 border rounded-lg hover:bg-accent hover:border-primary/50 transition-all cursor-pointer">
                                    <Building2 className="h-8 w-8 text-primary mb-3" />
                                    <h3 className="font-medium mb-1">Khoa</h3>
                                    <p className="text-sm text-muted-foreground">Quản lý các khoa</p>
                                </div>
                            </Link>
                            <Link href="/admin/courses">
                                <div className="p-4 border rounded-lg hover:bg-accent hover:border-primary/50 transition-all cursor-pointer">
                                    <BookOpen className="h-8 w-8 text-primary mb-3" />
                                    <h3 className="font-medium mb-1">Môn học</h3>
                                    <p className="text-sm text-muted-foreground">Quản lý danh mục môn học</p>
                                </div>
                            </Link>
                            <Link href="/admin/users/roles">
                                <div className="p-4 border rounded-lg hover:bg-accent hover:border-primary/50 transition-all cursor-pointer">
                                    <Shield className="h-8 w-8 text-primary mb-3" />
                                    <h3 className="font-medium mb-1">Vai trò & Phân quyền</h3>
                                    <p className="text-sm text-muted-foreground">Quản lý quyền truy cập</p>
                                </div>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}
