"use client";

import { motion } from "framer-motion";
import { Download, TrendingUp, Award, BookOpen } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/lib/auth-context";
import { getToken, enrollmentsApi } from "@/lib/api-client";

type GradeRow = {
  courseCode?: string;
  courseName?: string;
  credits?: number;
  midterm?: string | number | null;
  final?: string | number | null;
  letterGrade?: string | null;
  status?: string | null;
};

export default function StudentGradesPage() {
    const currentSemester = [
        { code: "CS101", name: "Intro to Computer Science", credits: 4, midterm: "A", final: "-", status: "In Progress" },
        { code: "MATH201", name: "Calculus II", credits: 4, midterm: "B+", final: "-", status: "In Progress" },
        { code: "ENG102", name: "Advanced Composition", credits: 3, midterm: "A-", final: "-", status: "In Progress" },
        { code: "PHYS150", name: "Physics for Engineers", credits: 4, midterm: "B", final: "-", status: "In Progress" },
        { code: "HIST110", name: "World History", credits: 3, midterm: "A", final: "-", status: "In Progress" },
    ];

    const history = [
        {
            semester: "Spring 2025",
            gpa: "3.85",
            credits: 16,
            courses: [
                { code: "MATH101", name: "Calculus I", credits: 4, grade: "A" },
                { code: "ENG101", name: "Composition I", credits: 3, grade: "A-" },
                { code: "CHEM101", name: "General Chemistry", credits: 4, grade: "B+" },
                { code: "PSY101", name: "Intro to Psychology", credits: 3, grade: "A" },
                { code: "UNI101", name: "University Success", credits: 2, grade: "A" },
            ]
        },
        {
            semester: "Fall 2024",
            gpa: "3.72",
            credits: 15,
            courses: [
                { code: "CS100", name: "Intro to Programming", credits: 3, grade: "A" },
                { code: "MATH100", name: "Pre-Calculus", credits: 3, grade: "B+" },
                { code: "PHYS100", name: "Conceptual Physics", credits: 3, grade: "B" },
                { code: "HIST100", name: "Western Civilization", credits: 3, grade: "A-" },
                { code: "ART100", name: "Art History", credits: 3, grade: "A" },
            ]
        }
    ];

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

    const getGradeColor = (grade: string) => {
        if (grade.startsWith("A")) return "text-emerald-600 font-bold";
        if (grade.startsWith("B")) return "text-blue-600 font-bold";
        if (grade.startsWith("C")) return "text-amber-600 font-bold";
        return "text-red-600 font-bold";
    };

    const statusLabels: Record<string, string> = {
        "In Progress": "Đang học",
        "Completed": "Hoàn thành",
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Điểm & Học bạ</h2>
                    <p className="text-muted-foreground">
                        Xem kết quả học tập và bảng điểm
                    </p>
                </div>
                <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Tải bảng điểm (không chính thức)
                </Button>
            </div>

            {/* GPA Stats */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid gap-4 md:grid-cols-3"
            >
                <motion.div variants={item}>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">GPA tích lũy</CardTitle>
                            <Award className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">3.78</div>
                            <p className="text-xs text-muted-foreground">
                                +0.06 so với học kỳ trước
                            </p>
                            <Progress value={94.5} className="h-2 mt-3" />
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={item}>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tổng số tín chỉ</CardTitle>
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">49</div>
                            <p className="text-xs text-muted-foreground">
                                18 tín chỉ đang học
                            </p>
                            <Progress value={40} className="h-2 mt-3" />
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={item}>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Xếp loại học vụ</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-600">Học lực tốt</div>
                            <p className="text-xs text-muted-foreground">
                                Danh sách Khen thưởng (Spring 2025)
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>

            {/* Current Semester */}
            <Card>
                <CardHeader>
                    <CardTitle>Học kỳ hiện tại (Fall 2025)</CardTitle>
                    <CardDescription>
                        Điểm chỉ mang tính tham khảo cho đến khi Phòng Đào tạo xác nhận.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Mã môn</TableHead>
                                <TableHead>Tên môn học</TableHead>
                                <TableHead className="text-center">Tín chỉ</TableHead>
                                <TableHead className="text-center">Giữa kỳ</TableHead>
                                <TableHead className="text-center">Cuối kỳ</TableHead>
                                <TableHead className="text-right">Trạng thái</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentSemester.map((course) => (
                                <TableRow key={course.code}>
                                    <TableCell className="font-medium">{course.code}</TableCell>
                                    <TableCell>{course.name}</TableCell>
                                    <TableCell className="text-center">{course.credits}</TableCell>
                                    <TableCell className={`text-center ${getGradeColor(course.midterm)}`}>
                                        {course.midterm}
                                    </TableCell>
                                    <TableCell className="text-center text-muted-foreground">
                                        {course.final}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Badge
                                            variant="outline"
                                            className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                                        >
                                            {statusLabels[course.status] ?? course.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Academic History */}
            <Card>
                <CardHeader>
                    <CardTitle>Lịch sử học tập</CardTitle>
                    <CardDescription>
                        Bảng điểm và học phần của các học kỳ trước.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        {history.map((record) => (
                            <AccordionItem key={record.semester} value={record.semester}>
                                <AccordionTrigger className="hover:no-underline">
                                    <div className="flex flex-1 items-center justify-between mr-4">
                                        <span className="font-semibold">{record.semester}</span>
                                        <div className="flex gap-4 text-sm text-muted-foreground">
                                            <span>GPA: <span className="font-bold text-foreground">{record.gpa}</span></span>
                                            <span>Tín chỉ: {record.credits}</span>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Mã môn</TableHead>
                                                <TableHead>Tên môn</TableHead>
                                                <TableHead className="text-right">Tín chỉ</TableHead>
                                                <TableHead className="text-right">Điểm</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {record.courses.map((course) => (
                                                <TableRow key={course.code}>
                                                    <TableCell className="font-medium">{course.code}</TableCell>
                                                    <TableCell>{course.name}</TableCell>
                                                    <TableCell className="text-right">{course.credits}</TableCell>
                                                    <TableCell className={`text-right ${getGradeColor(course.grade)}`}>
                                                        {course.grade}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    );
}
