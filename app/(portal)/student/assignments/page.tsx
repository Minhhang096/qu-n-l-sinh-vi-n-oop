"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
    Calendar,
    AlertCircle,
    CheckCircle2,
    Clock,
    Upload,
    Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "sonner";

export default function StudentAssignmentsPage() {
    const [submittedAssignments, setSubmittedAssignments] = useState<number[]>([]);
        {
            id: 1,
            title: "Algorithm Analysis Report",
            course: "CS101: Intro to Computer Science",
            dueDate: "Today, 11:59 PM",
            status: "Pending",
            points: 100,
            description: "Analyze the time complexity of the provided sorting algorithms including Bubble Sort, Merge Sort, and Quick Sort."
        },
        {
            id: 2,
            title: "Calculus Problem Set 3",
            course: "MATH201: Calculus II",
            dueDate: "Tomorrow, 11:59 PM",
            status: "Pending",
            points: 50,
            description: "Complete problems 1-15 from Chapter 4. Include all working steps."
        },
        {
            id: 3,
            title: "World War II Essay",
            course: "HIST110: World History",
            dueDate: "Oct 15, 2025",
            status: "Submitted",
            points: 100,
            submittedDate: "Oct 10, 2025",
            description: "Write a 2000-word essay on the economic impact of World War II on post-war Europe."
        },
        {
            id: 4,
            title: "Physics Lab Report: Mechanics",
            course: "PHYS150: Physics for Engineers",
            dueDate: "Oct 01, 2025",
            status: "Graded",
            points: 100,
            score: 92,
            feedback: "Excellent analysis of the data. Work on error propagation calculations next time.",
            description: "Lab report for the projectile motion experiment."
        },
        {
            id: 5,
            title: "Literary Analysis",
            course: "ENG102: Advanced Composition",
            dueDate: "Sep 28, 2025",
            status: "Graded",
            points: 100,
            score: 88,
            feedback: "Strong thesis statement. Body paragraphs need more evidentiary support.",
            description: "Analyze the themes of isolation in 'The Catcher in the Rye'."
        }
    ];

    const statusLabels: Record<string, string> = {
        Pending: "Chưa nộp",
        Submitted: "Đã nộp",
        Graded: "Đã chấm",
        Overdue: "Quá hạn",
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Pending":
                return "text-amber-500 bg-amber-50 dark:bg-amber-900/20";
            case "Submitted":
                return "text-blue-500 bg-blue-50 dark:bg-blue-900/20";
            case "Graded":
                return "text-green-500 bg-green-50 dark:bg-green-900/20";
            case "Overdue":
                return "text-red-500 bg-red-50 dark:bg-red-900/20";
            default:
                return "text-gray-500 bg-gray-50 dark:bg-gray-800";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Pending":
                return <Clock className="w-4 h-4 mr-1" />;
            case "Submitted":
                return <CheckCircle2 className="w-4 h-4 mr-1" />;
            case "Graded":
                return <CheckCircle2 className="w-4 h-4 mr-1" />;
            case "Overdue":
                return <AlertCircle className="w-4 h-4 mr-1" />;
            default:
                return null;
        }
    };

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
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Bài tập</h2>
                <p className="text-muted-foreground">
                    Theo dõi bài tập sắp tới, bài đã nộp và điểm số
                </p>
            </div>

            <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="all">Tất cả</TabsTrigger>
                    <TabsTrigger value="pending">Chưa nộp</TabsTrigger>
                    <TabsTrigger value="submitted">Đã nộp</TabsTrigger>
                    <TabsTrigger value="graded">Đã chấm</TabsTrigger>
                </TabsList>

                {["all", "pending", "submitted", "graded"].map((tab) => (
                    <TabsContent key={tab} value={tab}>
                        <motion.div
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="space-y-4"
                        >
                            {assignments
                                .filter(a => tab === "all" || a.status.toLowerCase() === tab)
                                .map((assignment) => (
                                    <motion.div key={assignment.id} variants={item}>
                                        <Card>
                                            <CardHeader className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-start">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Badge variant="outline" className="font-normal">
                                                            {assignment.course}
                                                        </Badge>
                                                        <Badge
                                                            variant="secondary"
                                                            className={`font-medium ${getStatusColor(assignment.status)}`}
                                                        >
                                                            {getStatusIcon(assignment.status)}
                                                            {statusLabels[assignment.status] ?? assignment.status}
                                                        </Badge>
                                                    </div>
                                                    <CardTitle className="text-xl">{assignment.title}</CardTitle>
                                                    <CardDescription className="line-clamp-2">
                                                        {assignment.description}
                                                    </CardDescription>
                                                </div>
                                                <div className="flex flex-col items-end gap-2 text-sm">
                                                    <div className="flex items-center text-muted-foreground">
                                                        <Calendar className="mr-2 h-4 w-4" />
                                                        Hạn nộp: {assignment.dueDate}
                                                    </div>
                                                    <div className="font-medium">
                                                        {assignment.status === "Graded" ? (
                                                            <span className="text-green-600 dark:text-green-500">
                                                                Điểm: {assignment.score}/{assignment.points}
                                                            </span>
                                                        ) : (
                                                            <span>{assignment.points} điểm</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardFooter className="flex justify-between border-t pt-6 bg-muted/20">
                                                <Button variant="ghost" size="sm" onClick={() => {
                                                    // Simulate download
                                                    toast.success(`Tải đề bài ${assignment.title}`);
                                                }}>
                                                    <Download className="mr-2 h-4 w-4" />
                                                    Tải đề bài
                                                </Button>
                                                {assignment.status === "Pending" ? (
                                                    <Button size="sm" onClick={() => {
                                                        setSubmittedAssignments([...submittedAssignments, assignment.id]);
                                                        toast.success(`Nộp bài "${assignment.title}" thành công`);
                                                    }} disabled={submittedAssignments.includes(assignment.id)}>
                                                        <Upload className="mr-2 h-4 w-4" />
                                                        {submittedAssignments.includes(assignment.id) ? "Đã nộp" : "Nộp bài"}
                                                    </Button>
                                                ) : (
                                                    <Button variant="outline" size="sm" onClick={() => {
                                                        toast.info(`Xem bài nộp của "${assignment.title}"`);
                                                    }}>
                                                        Xem bài đã nộp
                                                    </Button>
                                                )}
                                            </CardFooter>
                                        </Card>
                                    </motion.div>
                                ))}
                        </motion.div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
