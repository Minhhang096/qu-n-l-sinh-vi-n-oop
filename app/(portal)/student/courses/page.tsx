"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    BookOpen,
    Clock,
    User,
    MoreVertical,
    FileText,
    Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function StudentCoursesPage() {
    const router = useRouter();
    const courses = [
        {
            id: "CS101",
            title: "Introduction to Computer Science",
            instructor: "Dr. Sarah Johnson",
            schedule: "Mon, Wed 10:00 AM",
            location: "Science Bldg 101",
            credits: 4,
            progress: 75,
            semester: "Fall 2025",
            image: "bg-blue-100 dark:bg-blue-900/30",
            color: "text-blue-600 dark:text-blue-400"
        },
        {
            id: "MATH201",
            title: "Calculus II",
            instructor: "Prof. Robert Smith",
            schedule: "Tue, Thu 02:00 PM",
            location: "Math Hall 204",
            credits: 4,
            progress: 60,
            semester: "Fall 2025",
            image: "bg-purple-100 dark:bg-purple-900/30",
            color: "text-purple-600 dark:text-purple-400"
        },
        {
            id: "ENG102",
            title: "Advanced Composition",
            instructor: "Dr. Emily Davis",
            schedule: "Fri 09:00 AM",
            location: "Humanities 305",
            credits: 3,
            progress: 90,
            semester: "Fall 2025",
            image: "bg-amber-100 dark:bg-amber-900/30",
            color: "text-amber-600 dark:text-amber-400"
        },
        {
            id: "PHYS150",
            title: "Physics for Engineers",
            instructor: "Dr. Michael Change",
            schedule: "Mon, Wed 01:00 PM",
            location: "Science Bldg 105",
            credits: 4,
            progress: 45,
            semester: "Fall 2025",
            image: "bg-red-100 dark:bg-red-900/30",
            color: "text-red-600 dark:text-red-400"
        },
        {
            id: "HIST110",
            title: "World History",
            instructor: "Prof. James Wilson",
            schedule: "Tue 11:00 AM",
            location: "Arts Center 201",
            credits: 3,
            progress: 30,
            semester: "Fall 2025",
            image: "bg-emerald-100 dark:bg-emerald-900/30",
            color: "text-emerald-600 dark:text-emerald-400"
        },
        {
            id: "ART105",
            title: "Art Appreciation",
            instructor: "Ms. Linda Martinez",
            schedule: "Thu 04:00 PM",
            location: "Arts Center 102",
            credits: 2,
            progress: 15,
            semester: "Fall 2025",
            image: "bg-pink-100 dark:bg-pink-900/30",
            color: "text-pink-600 dark:text-pink-400"
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

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Môn học của tôi</h2>
                    <p className="text-muted-foreground">
                        Quản lý các môn đã đăng ký và tài liệu học kỳ Fall 2025
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.push('/student/schedule')}>
                        <Calendar className="mr-2 h-4 w-4" />
                        Thời khóa biểu
                    </Button>
                    <Button onClick={() => router.push('/student/registration')}>
                        <BookOpen className="mr-2 h-4 w-4" />
                        Xem danh mục môn học
                    </Button>
                </div>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
                {courses.map((course) => (
                    <motion.div key={course.id} variants={item}>
                        <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                <div className="space-y-1">
                                    <Badge variant="outline" className="mb-2">
                                        {course.id}
                                    </Badge>
                                    <CardTitle className="line-clamp-1 text-lg">
                                        {course.title}
                                    </CardTitle>
                                    <CardDescription>
                                        {course.credits} tín chỉ • {course.semester}
                                    </CardDescription>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="-mr-2">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>Xem đề cương</DropdownMenuItem>
                                        <DropdownMenuItem>Tài liệu lớp học</DropdownMenuItem>
                                        <DropdownMenuItem>Gửi email giảng viên</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardHeader>

                            <CardContent className="space-y-4 flex-1">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <User className="h-4 w-4" />
                                    <span>{course.instructor}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    <span>{course.schedule}</span>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground">Tiến độ môn học</span>
                                        <span className="font-medium">{course.progress}%</span>
                                    </div>
                                    <Progress value={course.progress} className="h-2" />
                                </div>
                            </CardContent>

                            <CardFooter>
                                <Button className="w-full" variant="secondary" onClick={() => {
                                    router.push(`/student/courses/${course.id}/materials`);
                                    toast.success(`Xem tài liệu môn học ${course.id}`);
                                }}>
                                    <FileText className="mr-2 h-4 w-4" />
                                    Xem tài liệu
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
