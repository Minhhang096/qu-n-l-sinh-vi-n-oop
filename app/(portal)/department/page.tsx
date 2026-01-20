"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, GraduationCap, Layers, BarChart3, TrendingUp, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth, getUserDisplayName } from "@/lib/auth-context";
import { statsApi, departmentsApi, DepartmentDto, DashboardStatsDto } from "@/lib/api-client";
import { toast } from "sonner";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function DepartmentDashboard() {
    const { user } = useAuth();
    const displayName = user ? getUserDisplayName(user) : "Nhân viên khoa";

    const [stats, setStats] = useState<DashboardStatsDto | null>(null);
    const [departments, setDepartments] = useState<DepartmentDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const [statsRes, deptsRes] = await Promise.all([
                    statsApi.getDashboard(),
                    departmentsApi.getAll()
                ]);

                if (statsRes.success && statsRes.data) {
                    setStats(statsRes.data);
                }
                if (deptsRes.success && deptsRes.data) {
                    setDepartments(deptsRes.data);
                }
            } catch (error) {
                toast.error("Tải dữ liệu bảng điều khiển thất bại");
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, []);

    const quickLinks = [
        { title: "Môn học", href: "/department/courses", icon: BookOpen, count: stats?.totalCourses || 0, color: "from-blue-500 to-blue-600", bgColor: "bg-blue-500/10" },
        { title: "Học phần", href: "/department/sections", icon: Layers, count: stats?.activeSections || 0, color: "from-purple-500 to-purple-600", bgColor: "bg-purple-500/10" },
        { title: "Sinh viên", href: "/department/students", icon: Users, count: stats?.totalStudents || 0, color: "from-emerald-500 to-emerald-600", bgColor: "bg-emerald-500/10" },
        { title: "Đăng ký học", href: "/department/enrollments", icon: GraduationCap, count: stats?.totalEnrollments || 0, color: "from-amber-500 to-amber-600", bgColor: "bg-amber-500/10" },
        { title: "Báo cáo", href: "/department/reports", icon: BarChart3, count: null, color: "from-rose-500 to-rose-600", bgColor: "bg-rose-500/10" },
    ];

    const statCards = [
        { label: "Tổng môn học", value: stats?.totalCourses || 0, subtext: `${stats?.activeSections || 0} học phần đang mở`, icon: BookOpen, trend: "+12%", color: "text-blue-600" },
        { label: "Tổng sinh viên", value: stats?.totalStudents || 0, subtext: "sinh viên đăng ký", icon: Users, trend: "+5%", color: "text-emerald-600" },
        { label: "Học phần đang mở", value: stats?.activeSections || 0, subtext: "hiện đang mở", icon: Layers, trend: "+8%", color: "text-purple-600" },
        { label: "Tổng đăng ký", value: stats?.totalEnrollments || 0, subtext: "tất cả đăng ký", icon: GraduationCap, trend: "+15%", color: "text-amber-600" },
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
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Welcome Header */}
            <motion.div variants={itemVariants} className="space-y-2">
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        Cổng Khoa
                    </Badge>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                    Chào mừng, <span className="text-primary">{displayName}</span>
                </h1>
                <p className="text-muted-foreground text-lg">
                    Quản lý chương trình học, học phần và đăng ký của sinh viên
                </p>
            </motion.div>

            {/* Stats Overview */}
            <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between">
                                        <CardDescription className="font-medium">{stat.label}</CardDescription>
                                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${stat.color} bg-current/10`}>
                                            <Icon className={`h-4 w-4 ${stat.color}`} />
                                        </div>
                                    </div>
                                    <CardTitle className={`text-3xl font-bold ${stat.color}`}>
                                        {stat.value}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">{stat.subtext}</span>
                                        <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
                                            <TrendingUp className="h-3 w-3" />
                                            {stat.trend}
                                        </div>
                                    </div>
                                </CardContent>
                                <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${stat.color === 'text-blue-600' ? 'from-blue-500 to-blue-600' : stat.color === 'text-emerald-600' ? 'from-emerald-500 to-emerald-600' : stat.color === 'text-purple-600' ? 'from-purple-500 to-purple-600' : 'from-amber-500 to-amber-600'}`} />
                            </Card>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Quick Access */}
            <motion.div variants={itemVariants} className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Truy cập nhanh</h2>
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                        Xem tất cả <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
                    {quickLinks.map((link, index) => {
                        const Icon = link.icon;
                        return (
                            <motion.div
                                key={link.href}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 + index * 0.05 }}
                                whileHover={{ scale: 1.05, y: -4 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Link href={link.href}>
                                    <Card className="group cursor-pointer border-2 hover:border-primary/50 transition-all duration-300 h-full">
                                        <CardContent className="pt-6 flex flex-col items-center text-center gap-3">
                                            <div className={`h-14 w-14 rounded-xl ${link.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                                <Icon
                                                    className={`h-7 w-7`}
                                                    style={{
                                                        color: link.color.includes('blue') ? '#3b82f6'
                                                            : link.color.includes('purple') ? '#a855f7'
                                                                : link.color.includes('emerald') ? '#10b981'
                                                                    : link.color.includes('amber') ? '#f59e0b'
                                                                        : '#f43f5e'
                                                    }}
                                                />
                                            </div>
                                            <h3 className="font-semibold group-hover:text-primary transition-colors">{link.title}</h3>
                                            {link.count !== null && (
                                                <p className="text-2xl font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                                                    {link.count}
                                                </p>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Department Overview */}
            <motion.div variants={itemVariants}>
                <Card>
                    <CardHeader>
                        <CardTitle>Tổng quan các Khoa</CardTitle>
                        <CardDescription>Tóm tắt nhanh về các khoa học thuật</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                            {departments.map((dept, index) => (
                                <motion.div
                                    key={dept.deptId}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + index * 0.05 }}
                                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                                >
                                    <div>
                                        <p className="font-medium">{dept.deptName}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {dept.studentCount || 0} sinh viên • {dept.courseCount || 0} môn học
                                        </p>
                                    </div>
                                    <Badge variant="outline">{dept.deptId}</Badge>
                                </motion.div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}
