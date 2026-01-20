"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, FileText, TrendingUp, Calendar, GraduationCap, ArrowRight, Loader2 } from "lucide-react";
import { useAuth, getUserDisplayName } from "@/lib/auth-context";
import { enrollmentsApi, EnrollmentDto } from "@/lib/api-client";

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

export default function StudentDashboard() {
    const { user } = useAuth();
    const displayName = user ? getUserDisplayName(user) : "Student";
    const studentId = user?.student?.studentId;
    
    const [enrollments, setEnrollments] = useState<EnrollmentDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            if (!studentId) {
                setIsLoading(false);
                return;
            }
            
            try {
                const response = await enrollmentsApi.getAll({ studentId });
                if (response.success && response.data) {
                    setEnrollments(response.data);
                }
            } catch (error) {
                console.error("Failed to load enrollments");
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, [studentId]);

    // Calculate GPA from grades
    const calculateGPA = () => {
        const grades = enrollments.filter(e => e.grade?.gpaPoint);
        if (grades.length === 0) return "N/A";
        const total = grades.reduce((sum, e) => sum + (e.grade?.gpaPoint || 0), 0);
        return (total / grades.length).toFixed(2);
    };

    const stats = [
        { title: "Môn đang học", value: enrollments.filter(e => e.status === 'Enrolled').length.toString(), icon: BookOpen, color: "text-blue-500", bgColor: "bg-blue-500/10" },
        { title: "Môn hoàn thành", value: enrollments.filter(e => e.status === 'Completed').length.toString(), icon: FileText, color: "text-orange-500", bgColor: "bg-orange-500/10" },
        { title: "GPA hiện tại", value: calculateGPA(), icon: TrendingUp, color: "text-green-500", bgColor: "bg-green-500/10" },
        { title: "Tổng đăng ký", value: enrollments.length.toString(), icon: Calendar, color: "text-purple-500", bgColor: "bg-purple-500/10" },
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
                    Cổng Sinh viên
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                    Chào mừng, <span className="text-primary">{displayName}</span>
                </h1>
                <p className="text-muted-foreground mt-2 text-base md:text-lg">
                    Tổng quan học tập của bạn trong học kỳ này.
                </p>
            </motion.div>

            <motion.div
                variants={container}
                className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
                {stats.map((stat) => {
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

            {/* Current Enrollments */}
            <motion.div variants={item}>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Các môn đang học</CardTitle>
                            <CardDescription>Danh sách môn học đã đăng ký</CardDescription>
                        </div>
                        <Link href="/student/courses">
                            <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                                Xem tất cả <ArrowRight className="ml-1 h-3 w-3" />
                            </Badge>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {enrollments.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>Chưa có môn học nào</p>
                                <Link href="/student/registration" className="text-primary hover:underline">
                                    Đăng ký môn học
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {enrollments.slice(0, 5).map((enrollment) => (
                                    <div 
                                        key={enrollment.enrollmentId} 
                                        className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <BookOpen className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{enrollment.courseName}</p>
                                                <p className="text-sm text-muted-foreground">{enrollment.semester}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                                {enrollment.grade && (
                                                <Badge variant="outline" className="font-mono">
                                                    {enrollment.grade.letterGrade || 'Đang học'}
                                                </Badge>
                                            )}
                                            <Badge 
                                                variant="outline" 
                                                className={enrollment.status === 'Enrolled' 
                                                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                                                    : 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                                                }
                                            >
                                                {enrollment.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div variants={item}>
                <Card>
                    <CardHeader>
                        <CardTitle>Thao tác nhanh</CardTitle>
                        <CardDescription>Các tác vụ và tài nguyên phổ biến</CardDescription>
                    </CardHeader>
                    <CardContent className="text-muted-foreground">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <Link href="/student/registration">
                                <div className="p-4 border rounded-lg hover:bg-accent hover:border-primary/50 transition-all cursor-pointer">
                                    <h3 className="font-medium mb-2">Đăng ký môn học</h3>
                                    <p className="text-sm text-muted-foreground">Đăng ký các môn học mới</p>
                                </div>
                            </Link>
                            <Link href="/student/courses">
                                <div className="p-4 border rounded-lg hover:bg-accent hover:border-primary/50 transition-all cursor-pointer">
                                    <h3 className="font-medium mb-2">Môn học của tôi</h3>
                                    <p className="text-sm text-muted-foreground">Xem các môn đã đăng ký</p>
                                </div>
                            </Link>
                            <Link href="/student/grades">
                                <div className="p-4 border rounded-lg hover:bg-accent hover:border-primary/50 transition-all cursor-pointer">
                                    <h3 className="font-medium mb-2">Xem điểm</h3>
                                    <p className="text-sm text-muted-foreground">Xem kết quả học tập</p>
                                </div>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}
