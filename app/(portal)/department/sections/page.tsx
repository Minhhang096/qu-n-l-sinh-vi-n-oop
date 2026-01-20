"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Search, Plus, MoreVertical, Clock, MapPin } from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { courseSections as initialSections, courses, teachers } from "@/lib/mock-db";
import type { CourseSection } from "@/lib/db-types";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const statusColors: Record<string, string> = {
    OPEN: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    CLOSED: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    CANCELED: "bg-red-500/10 text-red-600 border-red-500/20",
};

const statusLabels: Record<string, string> = {
    OPEN: "Đang mở",
    CLOSED: "Đã đóng",
    CANCELED: "Đã hủy",
};

export default function DepartmentSectionsPage() {
    const router = useRouter();
    const [sections, setSections] = useState<CourseSection[]>(initialSections);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [termFilter, setTermFilter] = useState<string>("all");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        courseId: "",
        teacherId: "",
        term: "",
        schedule: "",
        room: "",
        capacity: 50
    });

    const filteredSections = useMemo(() => {
        return sections.filter(section => {
            const course = courses.find(c => c.id === section.courseId);
            const matchesSearch = course?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                section.courseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                section.sectionNumber.includes(searchTerm);
            const matchesStatus = statusFilter === "all" || section.status === statusFilter;
            const matchesTerm = termFilter === "all" || section.term === termFilter;
            return matchesSearch && matchesStatus && matchesTerm;
        });
    }, [sections, searchTerm, statusFilter, termFilter]);

    const handleAddSection = async () => {
        if (!formData.courseId || !formData.teacherId) {
            toast.error("Vui lòng điền đủ thông tin");
            return;
        }

        setIsSubmitting(true);
        try {
            const course = courses.find(c => c.id === formData.courseId);
            const teacher = teachers.find(t => t.id === formData.teacherId);
            
            if (!course || !teacher) {
                toast.error("Học phần hoặc giảng viên không tồn tại");
                setIsSubmitting(false);
                return;
            }

            // API call: POST /api/sections
            const newSection: CourseSection = {
                id: `${formData.courseId}-${sections.length + 1}`,
                courseId: formData.courseId,
                courseName: course.name,
                sectionNumber: `Lớp ${sections.length + 1}`,
                term: formData.term || "HK1-2026",
                teacherId: formData.teacherId,
                teacherName: teacher.fullName,
                capacity: formData.capacity,
                enrolledCount: 0,
                status: "OPEN",
                schedule: formData.schedule || "Thứ 2, 4: 10:00-11:30",
                room: formData.room || "Phòng 101",
                isGradeLocked: false
            };

            setTimeout(() => {
                setSections([...sections, newSection]);
                toast.success(`Tạo lớp học phần "${course.name}" thành công`);
                setIsAddDialogOpen(false);
                setFormData({
                    courseId: "",
                    teacherId: "",
                    term: "",
                    schedule: "",
                    room: "",
                    capacity: 50
                });
                setIsSubmitting(false);
            }, 500);
        } catch (error) {
            toast.error("Lỗi khi tạo lớp học phần");
            setIsSubmitting(false);
        }
    };

    const terms = [...new Set(sections.map(s => s.term))];

    const stats = {
        total: sections.length,
        open: sections.filter(s => s.status === 'OPEN').length,
        closed: sections.filter(s => s.status === 'CLOSED').length,
        totalCapacity: sections.reduce((sum, s) => sum + s.capacity, 0),
        totalEnrolled: sections.reduce((sum, s) => sum + s.enrolledCount, 0),
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
                    <Badge variant="outline" className="mb-2 bg-purple-500/10 text-purple-600 border-purple-500/20">
                        Quản lý lớp học phần
                    </Badge>
                    <h2 className="text-3xl font-bold tracking-tight">Danh sách lớp học phần</h2>
                    <p className="text-muted-foreground">
                        Quản lý lớp học phần, lịch học và sức chứa
                    </p>
                </div>
                <Button onClick={() => {
                    setIsAddDialogOpen(true);
                }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Tạo lớp học phần
                </Button>
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-4">
                {[
                    { label: "Tổng số lớp học phần", value: stats.total, color: "text-foreground" },
                    { label: "Lớp đang mở", value: stats.open, color: "text-emerald-600" },
                    { label: "Lớp đã đóng", value: stats.closed, color: "text-amber-600" },
                    { label: "Tổng số đăng ký", value: `${stats.totalEnrolled}/${stats.totalCapacity}`, color: "text-foreground", showProgress: true },
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
                                {stat.showProgress && (
                                    <Progress value={(stats.totalEnrolled / stats.totalCapacity) * 100} className="h-2 mt-2" />
                                )}
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
                                    placeholder="Tìm kiếm lớp học phần..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-[150px]">
                                        <SelectValue placeholder="Trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tất cả trạng thái</SelectItem>
                                        <SelectItem value="OPEN">Đang mở</SelectItem>
                                        <SelectItem value="CLOSED">Đã đóng</SelectItem>
                                        <SelectItem value="CANCELED">Đã hủy</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={termFilter} onValueChange={setTermFilter}>
                                    <SelectTrigger className="w-[160px]">
                                        <SelectValue placeholder="Học kỳ" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tất cả học kỳ</SelectItem>
                                        {terms.map(term => (
                                            <SelectItem key={term} value={term}>{term}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Lớp học phần</TableHead>
                                    <TableHead>Giảng viên</TableHead>
                                    <TableHead>Lịch học</TableHead>
                                    <TableHead className="text-center">Sĩ số</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                    <TableHead className="w-[80px]">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {filteredSections.map((section, index) => {
                                    const course = courses.find(c => c.id === section.courseId);
                                    const teacher = teachers.find(t => t.id === section.teacherId);
                                    const fillRate = (section.enrolledCount / section.capacity) * 100;

                                    return (
                                        <motion.tr
                                            key={section.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.03 }}
                                            className="group hover:bg-muted/50 transition-colors"
                                        >
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium group-hover:text-primary transition-colors">
                                                        {course?.name}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {section.courseId} - Lớp {section.sectionNumber}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">{section.term}</div>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <div className="font-medium">{teacher?.fullName}</div>
                                            </TableCell>

                                            <TableCell>
                                                <div className="text-sm">
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {section.schedule || "Chưa cập nhật"}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-muted-foreground">
                                                        <MapPin className="h-3 w-3" />
                                                        {section.room || "Chưa cập nhật"}
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <div className="space-y-1 w-24">
                                                    <div className="text-sm font-medium text-center">
                                                        {section.enrolledCount}/{section.capacity}
                                                    </div>
                                                    <Progress value={fillRate} className="h-2" />
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <Badge variant="outline" className={statusColors[section.status]}>
                                                    {statusLabels[section.status] ?? section.status}
                                                </Badge>
                                            </TableCell>

                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>Xem danh sách</DropdownMenuItem>
                                                        <DropdownMenuItem>Chỉnh sửa lớp</DropdownMenuItem>
                                                        <DropdownMenuItem>Quản lý đăng ký</DropdownMenuItem>
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

            {/* Add Section Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Tạo lớp học phần mới</DialogTitle>
                        <DialogDescription>
                            Nhập thông tin lớp học phần mới
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="course-select">Học phần</Label>
                            <Select value={formData.courseId} onValueChange={(value) => setFormData({ ...formData, courseId: value })}>
                                <SelectTrigger id="course-select">
                                    <SelectValue placeholder="Chọn học phần" />
                                </SelectTrigger>
                                <SelectContent>
                                    {courses.map((course) => (
                                        <SelectItem key={course.id} value={course.id}>
                                            {course.id} - {course.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="teacher-select">Giảng viên</Label>
                            <Select value={formData.teacherId} onValueChange={(value) => setFormData({ ...formData, teacherId: value })}>
                                <SelectTrigger id="teacher-select">
                                    <SelectValue placeholder="Chọn giảng viên" />
                                </SelectTrigger>
                                <SelectContent>
                                    {teachers.map((teacher) => (
                                        <SelectItem key={teacher.id} value={teacher.id}>
                                            {teacher.fullName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="term-input">Học kỳ</Label>
                            <Input
                                id="term-input"
                                placeholder="VD: HK1-2026"
                                value={formData.term}
                                onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="schedule-input">Lịch học</Label>
                            <Input
                                id="schedule-input"
                                placeholder="VD: Thứ 2, 4: 10:00-11:30"
                                value={formData.schedule}
                                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="room-input">Phòng học</Label>
                            <Input
                                id="room-input"
                                placeholder="VD: Phòng 101"
                                value={formData.room}
                                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="capacity-input">Sức chứa</Label>
                            <Input
                                id="capacity-input"
                                type="number"
                                min="10"
                                max="100"
                                value={formData.capacity}
                                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
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
                            onClick={handleAddSection}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Đang tạo..." : "Tạo lớp học phần"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
}
