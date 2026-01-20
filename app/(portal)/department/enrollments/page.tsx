"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Plus, MoreVertical, GraduationCap, CheckCircle, XCircle, Clock } from "lucide-react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { enrollments as initialEnrollments, students, courseSections, courses } from "@/lib/mock-db";
import type { Enrollment, EnrollmentStatus } from "@/lib/db-types";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const statusColors: Record<EnrollmentStatus, string> = {
    ENROLLED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    COMPLETED: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    CANCELED: "bg-red-500/10 text-red-600 border-red-500/20",
};

const statusIcons: Record<EnrollmentStatus, React.ElementType> = {
    ENROLLED: Clock,
    COMPLETED: CheckCircle,
    CANCELED: XCircle,
};

const statusLabels: Record<EnrollmentStatus, string> = {
    ENROLLED: "Đang đăng ký",
    COMPLETED: "Đã hoàn thành",
    CANCELED: "Đã hủy",
};

export default function DepartmentEnrollmentsPage() {
    const [enrollmentList, setEnrollmentList] = useState<Enrollment[]>(initialEnrollments);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        studentId: "",
        sectionId: ""
    });
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
    const [newStatus, setNewStatus] = useState<EnrollmentStatus>("ENROLLED");

    const filteredEnrollments = useMemo(() => {
        return enrollmentList.filter(enrollment => {
            const student = students.find(s => s.id === enrollment.studentId);
            const section = courseSections.find(s => s.id === enrollment.sectionId);
            const course = section ? courses.find(c => c.id === section.courseId) : null;

            const matchesSearch =
                student?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student?.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                section?.courseId.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === "all" || enrollment.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [enrollmentList, searchTerm, statusFilter]);

    const handleAddEnrollment = async () => {
        if (!formData.studentId || !formData.sectionId) {
            toast.error("Vui lòng chọn sinh viên và lớp học phần");
            return;
        }

        setIsSubmitting(true);
        try {
            const student = students.find(s => s.id === formData.studentId);
            const section = courseSections.find(s => s.id === formData.sectionId);

            if (!student || !section) {
                toast.error("Sinh viên hoặc lớp không tồn tại");
                setIsSubmitting(false);
                return;
            }

            // API call: POST /api/enrollments
            const newEnrollment: Enrollment = {
                id: `enrollment_${enrollmentList.length + 1}`,
                studentId: formData.studentId,
                sectionId: formData.sectionId,
                enrollDate: new Date(),
                status: "ENROLLED",
                createdAt: new Date(),
                updatedAt: new Date()
            };

            setTimeout(() => {
                setEnrollmentList([...enrollmentList, newEnrollment]);
                toast.success(`Tạo đăng ký cho ${student.fullName} thành công`);
                setIsAddDialogOpen(false);
                setFormData({
                    studentId: "",
                    sectionId: ""
                });
                setIsSubmitting(false);
            }, 500);
        } catch {
            toast.error("Lỗi khi tạo đăng ký");
            setIsSubmitting(false);
        }
    };

    const handleViewDetails = (enrollment: Enrollment) => {
        setSelectedEnrollment(enrollment);
        setDetailDialogOpen(true);
    };

    const handleOpenStatusDialog = (enrollment: Enrollment) => {
        setSelectedEnrollment(enrollment);
        setNewStatus(enrollment.status);
        setStatusDialogOpen(true);
    };

    const handleUpdateStatus = async () => {
        if (!selectedEnrollment) return;

        setIsSubmitting(true);
        try {
            // API call: PUT /api/enrollments/{id}/status
            setTimeout(() => {
                setEnrollmentList(enrollmentList.map(e => 
                    e.id === selectedEnrollment.id 
                        ? { ...e, status: newStatus }
                        : e
                ));
                toast.success(`Cập nhật trạng thái thành "${statusLabels[newStatus]}" thành công`);
                setStatusDialogOpen(false);
                setIsSubmitting(false);
            }, 500);
        } catch {
            toast.error("Lỗi khi cập nhật trạng thái");
            setIsSubmitting(false);
        }
    };

    const handleCancelEnrollment = async (enrollment: Enrollment) => {
        setIsSubmitting(true);
        try {
            // API call: DELETE /api/enrollments/{id}
            setTimeout(() => {
                setEnrollmentList(enrollmentList.map(e =>
                    e.id === enrollment.id
                        ? { ...e, status: "CANCELED" }
                        : e
                ));
                const student = students.find(s => s.id === enrollment.studentId);
                toast.success(`Đã hủy đăng ký cho ${student?.fullName}`);
                setIsSubmitting(false);
            }, 500);
        } catch {
            toast.error("Lỗi khi hủy đăng ký");
            setIsSubmitting(false);
        }
    };

    const stats = {
        total: enrollmentList.length,
        enrolled: enrollmentList.filter(e => e.status === 'ENROLLED').length,
        completed: enrollmentList.filter(e => e.status === 'COMPLETED').length,
        canceled: enrollmentList.filter(e => e.status === 'CANCELED').length,
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
                    <Badge variant="outline" className="mb-2 bg-amber-500/10 text-amber-600 border-amber-500/20">
                        Quản lý đăng ký học phần
                    </Badge>
                    <h2 className="text-3xl font-bold tracking-tight">Quản lý đăng ký học phần</h2>
                    <p className="text-muted-foreground">Quản lý đăng ký lớp học phần và trạng thái đăng ký</p>
                </div>
                <Button onClick={() => {
                    setIsAddDialogOpen(true);
                }}><Plus className="mr-2 h-4 w-4" />Tạo đăng ký mới</Button>
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-4">
                {[
                    { label: "Tổng lượt đăng ký", value: stats.total, icon: GraduationCap, color: "text-foreground" },
                    { label: "Đang hiệu lực", value: stats.enrolled, icon: Clock, color: "text-emerald-600" },
                    { label: "Đã hoàn thành", value: stats.completed, icon: CheckCircle, color: "text-blue-600" },
                    { label: "Đã hủy", value: stats.canceled, icon: XCircle, color: "text-red-600" },
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
                                <CardTitle className={`text-2xl flex items-center gap-2 ${stat.color}`}>
                                    <stat.icon className="h-5 w-5" />
                                    {stat.value}
                                </CardTitle>
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
                                    placeholder="Tìm kiếm đăng ký..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[160px]">
                                    <SelectValue placeholder="Trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                                    <SelectItem value="ENROLLED">Đang đăng ký</SelectItem>
                                    <SelectItem value="COMPLETED">Đã hoàn thành</SelectItem>
                                    <SelectItem value="CANCELED">Đã hủy</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Sinh viên</TableHead>
                                    <TableHead>Học phần</TableHead>
                                    <TableHead>Lớp</TableHead>
                                    <TableHead>Ngày đăng ký</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                    <TableHead className="w-[80px]">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredEnrollments.map((enrollment, index) => {
                                    const student = students.find(s => s.id === enrollment.studentId);
                                    const section = courseSections.find(s => s.id === enrollment.sectionId);
                                    const course = section ? courses.find(c => c.id === section.courseId) : null;
                                    const StatusIcon = statusIcons[enrollment.status];

                                    return (
                                        <motion.tr
                                            key={enrollment.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.03 }}
                                            className="group hover:bg-muted/50 transition-colors"
                                        >
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback className="text-xs">
                                                            {student?.fullName.substring(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-medium group-hover:text-primary transition-colors">
                                                            {student?.fullName}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground font-mono">
                                                            {student?.id}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{course?.name}</div>
                                                    <div className="text-xs text-muted-foreground">{section?.courseId}</div>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <Badge variant="outline">Lớp {section?.sectionNumber}</Badge>
                                            </TableCell>

                                            <TableCell className="text-muted-foreground">
                                                {new Date(enrollment.enrollDate).toLocaleDateString()}
                                            </TableCell>

                                            <TableCell>
                                                <Badge variant="outline" className={statusColors[enrollment.status]}>
                                                    <StatusIcon className="h-3 w-3 mr-1" />
                                                    {statusLabels[enrollment.status]}
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
                                                        <DropdownMenuItem onClick={() => handleViewDetails(enrollment)}>
                                                            Xem chi tiết
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleOpenStatusDialog(enrollment)}>
                                                            Cập nhật trạng thái
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem 
                                                            className="text-red-600"
                                                            onClick={() => handleCancelEnrollment(enrollment)}
                                                        >
                                                            Hủy đăng ký
                                                        </DropdownMenuItem>
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

            {/* Add Enrollment Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Tạo đăng ký mới</DialogTitle>
                        <DialogDescription>
                            Chọn sinh viên và lớp học phần để đăng ký
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="student-select">Sinh viên</Label>
                            <Select value={formData.studentId} onValueChange={(value) => setFormData({ ...formData, studentId: value })}>
                                <SelectTrigger id="student-select">
                                    <SelectValue placeholder="Chọn sinh viên" />
                                </SelectTrigger>
                                <SelectContent>
                                    {students.map((student) => (
                                        <SelectItem key={student.id} value={student.id}>
                                            {student.id} - {student.fullName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="section-select">Lớp học phần</Label>
                            <Select value={formData.sectionId} onValueChange={(value) => setFormData({ ...formData, sectionId: value })}>
                                <SelectTrigger id="section-select">
                                    <SelectValue placeholder="Chọn lớp học phần" />
                                </SelectTrigger>
                                <SelectContent>
                                    {courseSections.map((section) => {
                                        const course = courses.find(c => c.id === section.courseId);
                                        return (
                                            <SelectItem key={section.id} value={section.id}>
                                                {section.courseId} - {course?.name} ({section.sectionNumber})
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
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
                            onClick={handleAddEnrollment}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Đang tạo..." : "Tạo đăng ký"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Detail Enrollment Dialog */}
            <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Chi tiết đăng ký</DialogTitle>
                        <DialogDescription>Thông tin đăng ký học phần</DialogDescription>
                    </DialogHeader>
                    {selectedEnrollment && (
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-xs text-muted-foreground">Sinh viên</Label>
                                    <div className="font-medium text-sm">
                                        {students.find(s => s.id === selectedEnrollment.studentId)?.fullName}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {selectedEnrollment.studentId}
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">Học phần</Label>
                                    <div className="font-medium text-sm">
                                        {(() => {
                                            const section = courseSections.find(s => s.id === selectedEnrollment.sectionId);
                                            const course = section ? courses.find(c => c.id === section.courseId) : null;
                                            return course?.name || "N/A";
                                        })()}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {(() => {
                                            const section = courseSections.find(s => s.id === selectedEnrollment.sectionId);
                                            return section?.courseId || "N/A";
                                        })()}
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-xs text-muted-foreground">Lớp</Label>
                                    <div className="font-medium text-sm">
                                        Lớp {courseSections.find(s => s.id === selectedEnrollment.sectionId)?.sectionNumber}
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">Ngày đăng ký</Label>
                                    <div className="font-medium text-sm">{new Date(selectedEnrollment.enrollDate).toLocaleDateString()}</div>
                                </div>
                            </div>
                            <div>
                                <Label className="text-xs text-muted-foreground">Trạng thái</Label>
                                <div className="mt-1">
                                    <Badge className={statusColors[selectedEnrollment.status]}>
                                        {statusLabels[selectedEnrollment.status]}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button onClick={() => setDetailDialogOpen(false)}>Đóng</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Update Status Dialog */}
            <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Cập nhật trạng thái đăng ký</DialogTitle>
                        <DialogDescription>
                            Chọn trạng thái mới cho đăng ký học phần
                        </DialogDescription>
                    </DialogHeader>
                    {selectedEnrollment && (
                        <div className="space-y-4 py-4">
                            <div className="rounded-lg bg-muted p-3 text-sm">
                                <div className="font-medium mb-1">
                                    {students.find(s => s.id === selectedEnrollment.studentId)?.fullName}
                                </div>
                                <div className="text-muted-foreground">
                                    {(() => {
                                        const section = courseSections.find(s => s.id === selectedEnrollment.sectionId);
                                        const course = section ? courses.find(c => c.id === section.courseId) : null;
                                        return course?.name || "N/A";
                                    })()}
                                </div>
                            </div>
                            <div className="space-y-3">
                                {(['ENROLLED', 'COMPLETED', 'CANCELED'] as EnrollmentStatus[]).map(status => (
                                    <div
                                        key={status}
                                        className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                                            newStatus === status
                                                ? 'border-primary bg-primary/5'
                                                : 'border-border hover:bg-muted'
                                        }`}
                                        onClick={() => setNewStatus(status)}
                                    >
                                        <div
                                            className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                                                newStatus === status
                                                    ? 'border-primary bg-primary'
                                                    : 'border-muted-foreground'
                                            }`}
                                        >
                                            {newStatus === status && (
                                                <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm">{statusLabels[status]}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setStatusDialogOpen(false)}
                            disabled={isSubmitting}
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleUpdateStatus}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
}
