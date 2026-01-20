"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Search, Plus, MoreVertical, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import { courses as initialCourses, courseSections, enrollments } from "@/lib/mock-db";
import type { Course } from "@/lib/db-types";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function DepartmentCoursesPage() {
    const router = useRouter();
    const [courseList, setCourseList] = useState<Course[]>(initialCourses);
    const [searchTerm, setSearchTerm] = useState("");
    const [levelFilter, setLevelFilter] = useState<string>("all");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        credits: 3,
        level: "Undergraduate",
        description: ""
    });

    const filteredCourses = useMemo(() => {
        return courseList.filter(course => {
            const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesLevel = levelFilter === "all" || course.level === levelFilter;
            return matchesSearch && matchesLevel;
        });
    }, [courseList, searchTerm, levelFilter]);

    const handleAddCourse = async () => {
        if (!formData.id.trim() || !formData.name.trim()) {
            toast.error("Vui lòng điền đủ thông tin");
            return;
        }

        setIsSubmitting(true);
        try {
            // API call: POST /api/courses
            const newCourse: Course = {
                id: formData.id,
                name: formData.name,
                credits: formData.credits,
                level: formData.level,
                description: formData.description
            };

            // Simulate API delay
            setTimeout(() => {
                setCourseList([...courseList, newCourse]);
                toast.success(`Thêm học phần "${newCourse.name}" thành công`);
                setIsAddDialogOpen(false);
                setFormData({
                    id: "",
                    name: "",
                    credits: 3,
                    level: "Undergraduate",
                    description: ""
                });
                setIsSubmitting(false);
            }, 500);
        } catch (error) {
            toast.error("Lỗi khi thêm học phần");
            setIsSubmitting(false);
        }
    };

    // Get stats for each course
    const getCourseStats = (courseId: string) => {
        const sections = courseSections.filter(s => s.courseId === courseId);
        const openSections = sections.filter(s => s.status === 'OPEN').length;
        const totalEnrolled = sections.reduce((sum, s) => sum + s.enrolledCount, 0);
        return { sections: sections.length, openSections, enrolled: totalEnrolled };
    };

    // Overall stats
    const stats = {
        total: courseList.length,
        withOpenSections: courseList.filter(c => courseSections.some(s => s.courseId === c.id && s.status === 'OPEN')).length,
        totalCredits: courseList.reduce((sum, c) => sum + c.credits, 0),
        totalEnrolled: enrollments.filter(e => e.status === 'ENROLLED').length,
    };

    return (
        <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <Badge variant="outline" className="mb-2 bg-blue-500/10 text-blue-600 border-blue-500/20">
                        Quản lý học phần
                    </Badge>
                    <h2 className="text-3xl font-bold tracking-tight">Danh mục học phần</h2>
                    <p className="text-muted-foreground">
                        Quản lý học phần, học phần tiên quyết và chương trình đào tạo
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => {
                        const csvContent = [
                            ['Mã học phần', 'Tên', 'Tín chỉ', 'Mô tả'],
                            ...courseList.map(c => [c.id, c.name, c.credits, c.description || ''])
                        ]
                        .map(row => row.map(cell => `"${cell}"`).join(','))
                        .join('\n');
                        
                        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                        const link = document.createElement('a');
                        const url = URL.createObjectURL(blob);
                        link.setAttribute('href', url);
                        link.setAttribute('download', `courses_${new Date().toISOString().split('T')[0]}.csv`);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        toast.success('Xuất dữ liệu thành công');
                    }}>
                        <Download className="mr-2 h-4 w-4" />
                        Xuất dữ liệu
                    </Button>
                    <Button onClick={() => {
                        setIsAddDialogOpen(true);
                    }}>
                        <Plus className="mr-2 h-4 w-4" />
                        Thêm học phần
                    </Button>
                </div>
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-4">
                {[
                    { label: "Tổng số học phần", value: stats.total, color: "text-foreground" },
                    { label: "Có lớp đang mở", value: stats.withOpenSections, color: "text-emerald-600" },
                    { label: "Tổng số tín chỉ cung cấp", value: stats.totalCredits, color: "text-foreground" },
                    { label: "Sinh viên đã đăng ký", value: stats.totalEnrolled, color: "text-blue-600" },
                ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                    >
                        <Card className="hover:shadow-md transition-shadow">
                            <CardHeader className="py-4">
                                <CardDescription>{stat.label}</CardDescription>
                                <CardTitle className={`text-2xl ${stat.color}`}>{stat.value}</CardTitle>
                            </CardHeader>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            {/* Filters & Table */}
            <motion.div variants={itemVariants}>
                <Card>
                    <CardHeader>
                        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Tìm kiếm học phần..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select value={levelFilter} onValueChange={setLevelFilter}>
                                <SelectTrigger className="w-[160px]">
                                    <SelectValue placeholder="Tất cả bậc học" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả bậc học</SelectItem>
                                    <SelectItem value="Undergraduate">Đại học</SelectItem>
                                    <SelectItem value="Graduate">Sau đại học</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Học phần</TableHead>
                                    <TableHead className="text-center">Tín chỉ</TableHead>
                                    <TableHead className="text-center">Lớp học</TableHead>
                                    <TableHead className="text-center">Đã đăng ký</TableHead>
                                    <TableHead>Bậc học</TableHead>
                                    <TableHead className="w-[80px]">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCourses.map((course, index) => {
                                    const stats = getCourseStats(course.id);
                                    return (
                                        <motion.tr
                                            key={course.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.03 }}
                                            className="group hover:bg-muted/50 transition-colors"
                                        >
                                            <TableCell>
                                                <div>
                                                    <div className="font-mono text-xs text-muted-foreground">{course.id}</div>
                                                    <div className="font-medium group-hover:text-primary transition-colors">{course.name}</div>
                                                    <div className="text-xs text-muted-foreground line-clamp-1">{course.description}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center font-medium">{course.credits}</TableCell>
                                            <TableCell className="text-center">
                                                <span className="font-medium">{stats.sections}</span>
                                                {stats.openSections > 0 && (
                                                    <span className="text-emerald-600 text-xs ml-1">
                                                        ({stats.openSections} lớp đang mở)
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">{stats.enrolled}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{course.level || "Không xác định"}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
                                                        <DropdownMenuItem>Chỉnh sửa học phần</DropdownMenuItem>
                                                        <DropdownMenuItem>Quản lý lớp học</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </motion.tr>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Add Course Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Thêm học phần mới</DialogTitle>
                        <DialogDescription>
                            Nhập thông tin học phần mới vào hệ thống
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="course-id">Mã học phần</Label>
                            <Input
                                id="course-id"
                                placeholder="VD: CS101"
                                value={formData.id}
                                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="course-name">Tên học phần</Label>
                            <Input
                                id="course-name"
                                placeholder="Nhập tên học phần"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="course-credits">Số tín chỉ</Label>
                            <Input
                                id="course-credits"
                                type="number"
                                min="1"
                                max="12"
                                value={formData.credits}
                                onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="course-level">Bậc học</Label>
                            <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value })}>
                                <SelectTrigger id="course-level">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Undergraduate">Đại học</SelectItem>
                                    <SelectItem value="Graduate">Sau đại học</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="course-desc">Mô tả</Label>
                            <Input
                                id="course-desc"
                                placeholder="Nhập mô tả học phần"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsAddDialogOpen(false)}
                            disabled={isSubmitting}
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleAddCourse}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Đang thêm..." : "Thêm học phần"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
}
