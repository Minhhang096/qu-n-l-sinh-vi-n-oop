"use client";

import { motion } from "framer-motion";
import { BookOpen, Users, Clock, ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function TeacherClassesPage() {
    const classes = [
        {
            id: "CS101-01",
            code: "CS101",
            title: "Nhập môn Khoa học Máy tính",
            year: "2025-2026",
            semester: "Học kỳ Thu",
            schedule: "Thứ 2, Thứ 4 10:00 - 11:30",
            location: "Nhà Khoa học 101",
            enrolled: 45,
            capacity: 50,
            avgGrade: "B+",
            status: "Đang hoạt động"
        },
        {
            id: "CS201-02",
            code: "CS201",
            title: "Phát triển Web",
            year: "2025-2026",
            semester: "Học kỳ Thu",
            schedule: "Thứ 3, Thứ 5 14:00 - 15:30",
            location: "Phòng Lab Công nghệ 204",
            enrolled: 32,
            capacity: 35,
            avgGrade: "A-",
            status: "Đang hoạt động"
        },
        {
            id: "CS450-01",
            code: "CS450",
            title: "Học máy",
            year: "2025-2026",
            semester: "Học kỳ Thu",
            schedule: "Thứ 6 09:00 - 12:00",
            location: "Trung tâm Nghiên cứu AI",
            enrolled: 18,
            capacity: 20,
            avgGrade: "B",
            status: "Đang hoạt động"
        }
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Lớp học của tôi</h2>
                    <p className="text-muted-foreground">
                        Quản lý các lớp được phân công và điểm số của sinh viên
                    </p>
                </div>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
                {classes.map((cls) => (
                    <motion.div key={cls.id} variants={item}>
                        <Card className="h-full flex flex-col hover:border-primary/50 transition-colors">
                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-start">
                                    <Badge variant="outline" className="font-mono text-xs mb-2">
                                        {cls.id}
                                    </Badge>
                                    <Badge className="bg-emerald-500 hover:bg-emerald-600">
                                        {cls.status}
                                    </Badge>
                                </div>
                                <CardTitle className="text-xl">{cls.title}</CardTitle>
                                <CardDescription>
                                    {cls.semester} • {cls.year}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-4 flex-1">
                                <div className="space-y-2 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        <span>{cls.schedule}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        <span>{cls.enrolled} / {cls.capacity} sinh viên</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4" />
                                        <span>
                                            Điểm trung bình:{" "}
                                            <span className="font-semibold text-foreground">{cls.avgGrade}</span>
                                        </span>
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="pt-4 border-t bg-muted/20">
                                <Button asChild className="w-full group">
                                    <Link href={`/teacher/classes/${cls.id}`}>
                                        Quản lý lớp
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                ))}

                {/* Coming Soon / Past Classes */}
                <motion.div variants={item}>
                    <Card className="h-full flex flex-col border-dashed justify-center items-center p-6 text-center text-muted-foreground bg-muted/10">
                        <BookOpen className="w-12 h-12 mb-4 opacity-20" />
                        <h3 className="font-semibold text-lg mb-1">Học kỳ trước</h3>
                        <p className="text-sm max-w-[200px]">
                            Truy cập hồ sơ đã lưu trữ của các năm học trước.
                        </p>
                        <Button variant="outline" className="mt-4">
                            Xem lưu trữ
                        </Button>
                    </Card>
                </motion.div>
            </motion.div>
        </div>
    );
}
