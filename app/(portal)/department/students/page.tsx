"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Plus, MoreVertical, Users, UserCheck, Download, Loader2, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { studentsApi, departmentsApi, classesApi, StudentDto, DepartmentDto, ClassDto } from "@/lib/api-client";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const statusColors: Record<string, string> = {
    Active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    OnLeave: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    Graduated: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    Suspended: "bg-red-500/10 text-red-600 border-red-500/20",
};

const statusLabels: Record<string, string> = {
    Active: "Đang học",
    OnLeave: "Tạm nghỉ",
    Graduated: "Đã tốt nghiệp",
    Suspended: "Bị đình chỉ",
};

export default function DepartmentStudentsPage() {
    const router = useRouter();
    const [studentList, setStudentList] = useState<StudentDto[]>([]);
    const [departments, setDepartments] = useState<DepartmentDto[]>([]);
    const [classes, setClasses] = useState<ClassDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    // Dialog states
    const [selectedStudent, setSelectedStudent] = useState<StudentDto | null>(null);
    const [viewProfileOpen, setViewProfileOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [editFormData, setEditFormData] = useState<Partial<StudentDto>>({});
    const [addFormData, setAddFormData] = useState({
        studentId: "",
        fullname: "",
        email: "",
        phone: "",
        deptId: "",
        classId: "",
        status: "Active",
    });

    // Fetch data
    useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            try {
                const [studentsRes, deptsRes, classesRes] = await Promise.all([
                    studentsApi.getAll(),
                    departmentsApi.getAll(),
                    classesApi.getAll()
                ]);

                if (studentsRes.success && studentsRes.data) {
                    setStudentList(studentsRes.data);
                }
                if (deptsRes.success && deptsRes.data) {
                    setDepartments(deptsRes.data);
                }
                if (classesRes.success && classesRes.data) {
                    setClasses(classesRes.data);
                }
            } catch (error) {
                toast.error("Tải dữ liệu thất bại");
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, []);

    const filteredStudents = useMemo(() => {
        return studentList.filter(student => {
            const matchesSearch =
                student.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (student.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());

            const matchesDept = departmentFilter === "all" || student.deptId === departmentFilter;
            const matchesStatus = statusFilter === "all" || student.status === statusFilter;

            return matchesSearch && matchesDept && matchesStatus;
        });
    }, [studentList, searchTerm, departmentFilter, statusFilter]);

    const stats = {
        total: studentList.length,
        active: studentList.filter(s => s.status === 'Active').length,
        onLeave: studentList.filter(s => s.status === 'OnLeave').length,
        graduated: studentList.filter(s => s.status === 'Graduated').length,
    };

    const handleExportData = () => {
        try {
            const csvContent = [
                ['Mã sinh viên', 'Họ tên', 'Email', 'Khoa', 'Lớp', 'Trạng thái'],
                ...filteredStudents.map(s => [
                    s.studentId,
                    s.fullname,
                    s.email || '',
                    s.deptName || s.deptId,
                    s.classId,
                    statusLabels[s.status] || s.status
                ])
            ]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `students_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success('Xuất dữ liệu thành công');
        } catch (error) {
            toast.error('Lỗi khi xuất dữ liệu');
            console.error(error);
        }
    };

    const handleAddStudent = () => {
        setAddOpen(true);
    };

    const handleSaveNewStudent = async () => {
        try {
            // Validate form
            if (!addFormData.studentId || !addFormData.fullname || !addFormData.email) {
                toast.error('Vui lòng điền đủ thông tin');
                return;
            }

            // Get department name from ID
            const selectedDept = departments.find(d => d.deptId === addFormData.deptId);
            const selectedClass = classes.find(c => c.classId === addFormData.classId);

            // Create new student object
            const newStudent: StudentDto = {
                studentId: addFormData.studentId,
                fullname: addFormData.fullname,
                email: addFormData.email,
                phone: addFormData.phone || '',
                deptId: addFormData.deptId,
                deptName: selectedDept?.deptName || '',
                classId: addFormData.classId,
                status: addFormData.status as any,
                dateOfBirth: '',
                address: '',
                gender: '',
                enrollmentDate: new Date().toISOString(),
                accountId: 0
            };

            // Try to call API if available
            // const result = await studentsApi.create(newStudent);
            // if (result.success) {
            //     setStudentList([...studentList, result.data]);
            // } else {
            //     toast.error(result.message || 'Lỗi khi thêm sinh viên');
            //     return;
            // }

            // Add to local list
            setStudentList([...studentList, newStudent]);
            
            toast.success(`Thêm sinh viên ${addFormData.fullname} thành công`);
            setAddOpen(false);
            setAddFormData({
                studentId: "",
                fullname: "",
                email: "",
                phone: "",
                deptId: "",
                classId: "",
                status: "Active",
            });
        } catch (error) {
            toast.error('Lỗi khi thêm sinh viên');
            console.error(error);
        }
    };

    const handleViewProfile = (student: StudentDto) => {
        setSelectedStudent(student);
        setViewProfileOpen(true);
    };

    const handleEditStudent = (student: StudentDto) => {
        setSelectedStudent(student);
        setEditFormData({ ...student });
        setEditOpen(true);
    };

    const handleSaveEdit = async () => {
        try {
            if (!selectedStudent) return;

            // Call API to update student (if available)
            const updatedStudents = studentList.map(s =>
                s.studentId === selectedStudent.studentId
                    ? { ...s, ...editFormData }
                    : s
            );
            setStudentList(updatedStudents);
            toast.success('Cập nhật thông tin thành công');
            setEditOpen(false);
        } catch (error) {
            toast.error('Lỗi khi cập nhật thông tin');
            console.error(error);
        }
    };

    const handleViewGrades = (student: StudentDto) => {
        // Navigate to grades page for this student
        router.push(`/department/students/${student.studentId}/grades`);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

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
                    <Badge variant="outline" className="mb-2 bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                        Hồ sơ sinh viên
                    </Badge>
                    <h2 className="text-3xl font-bold tracking-tight">Danh sách sinh viên</h2>
                    <p className="text-muted-foreground">Quản lý hồ sơ sinh viên và trạng thái học tập</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleExportData}><Download className="mr-2 h-4 w-4" />Xuất dữ liệu</Button>
                    <Button onClick={handleAddStudent}><Plus className="mr-2 h-4 w-4" />Thêm sinh viên</Button>
                </div>
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-4">
                {[
                    { label: "Tổng số sinh viên", value: stats.total, icon: Users, color: "text-foreground" },
                    { label: "Sinh viên đang học", value: stats.active, icon: UserCheck, color: "text-emerald-600" },
                    { label: "Sinh viên tạm nghỉ", value: stats.onLeave, color: "text-amber-600" },
                    { label: "Sinh viên đã tốt nghiệp", value: stats.graduated, color: "text-blue-600" },
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
                                    {stat.icon && <stat.icon className="h-5 w-5" />}
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
                                    placeholder="Tìm kiếm sinh viên..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                                    <SelectTrigger className="w-[170px]">
                                        <SelectValue placeholder="Khoa" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tất cả khoa</SelectItem>
                                        {departments.map(dept => (
                                            <SelectItem key={dept.deptId} value={dept.deptId}>
                                                {dept.deptName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-[150px]">
                                        <SelectValue placeholder="Trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tất cả trạng thái</SelectItem>
                                        <SelectItem value="Active">Đang học</SelectItem>
                                        <SelectItem value="OnLeave">Tạm nghỉ</SelectItem>
                                        <SelectItem value="Graduated">Đã tốt nghiệp</SelectItem>
                                        <SelectItem value="Suspended">Bị đình chỉ</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Sinh viên</TableHead>
                                    <TableHead>Khoa</TableHead>
                                    <TableHead>Lớp</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                    <TableHead className="w-[80px]">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {filteredStudents.map((student, index) => {
                                    const classGroup = classes.find(c => c.classId === student.classId);

                                    return (
                                        <motion.tr
                                            key={student.studentId}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.03 }}
                                            className="group hover:bg-muted/50 transition-colors"
                                        >
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9">
                                                        <AvatarFallback>
                                                            {student.fullname.substring(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-medium group-hover:text-primary transition-colors">
                                                            {student.fullname}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">{student.email}</div>
                                                        <div className="text-xs text-muted-foreground font-mono">
                                                            Mã SV: {student.studentId}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell>{student.deptName || student.deptId}</TableCell>

                                            <TableCell>
                                                <Badge variant="outline">
                                                    {classGroup?.className || student.classId}
                                                </Badge>
                                            </TableCell>

                                            <TableCell>
                                                <Badge variant="outline" className={statusColors[student.status] || ''}>
                                                    {statusLabels[student.status] ?? student.status}
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
                                                        <DropdownMenuItem onClick={() => handleViewProfile(student)}>Xem hồ sơ</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleEditStudent(student)}>Chỉnh sửa</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleViewGrades(student)}>Xem bảng điểm</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </motion.tr>
                                    );
                                })}
                            </TableBody>
                        </Table>

                        {filteredStudents.length === 0 && (
                            <div className="text-center py-12 text-muted-foreground">
                                {searchTerm ? "Không tìm thấy sinh viên phù hợp với từ khóa" : "Chưa có sinh viên nào"}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            {/* Dialog: View Profile */}
            <Dialog open={viewProfileOpen} onOpenChange={setViewProfileOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Hồ sơ sinh viên</DialogTitle>
                        <DialogDescription>Thông tin chi tiết của {selectedStudent?.fullname}</DialogDescription>
                    </DialogHeader>
                    {selectedStudent && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-xs text-muted-foreground">Mã sinh viên</Label>
                                    <p className="font-medium">{selectedStudent.studentId}</p>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">Họ tên</Label>
                                    <p className="font-medium">{selectedStudent.fullname}</p>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">Email</Label>
                                    <p className="font-medium">{selectedStudent.email}</p>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">Điện thoại</Label>
                                    <p className="font-medium">{selectedStudent.phone || 'N/A'}</p>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">Khoa</Label>
                                    <p className="font-medium">{selectedStudent.deptName || selectedStudent.deptId}</p>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">Lớp</Label>
                                    <p className="font-medium">{selectedStudent.classId}</p>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">Trạng thái</Label>
                                    <p className="font-medium">{statusLabels[selectedStudent.status] || selectedStudent.status}</p>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">Ngày sinh</Label>
                                    <p className="font-medium">{selectedStudent.dateOfBirth || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => setViewProfileOpen(false)}>Đóng</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Dialog: Edit Student */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Chỉnh sửa thông tin sinh viên</DialogTitle>
                        <DialogDescription>Cập nhật thông tin của {selectedStudent?.fullname}</DialogDescription>
                    </DialogHeader>
                    {selectedStudent && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Mã sinh viên</Label>
                                    <Input
                                        value={editFormData.studentId || ''}
                                        disabled
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label>Họ tên</Label>
                                    <Input
                                        value={editFormData.fullname || ''}
                                        onChange={(e) => setEditFormData({ ...editFormData, fullname: e.target.value })}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        value={editFormData.email || ''}
                                        onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label>Điện thoại</Label>
                                    <Input
                                        value={editFormData.phone || ''}
                                        onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label>Khoa</Label>
                                    <Select value={editFormData.deptId || ''} onValueChange={(value) => setEditFormData({ ...editFormData, deptId: value })}>
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Chọn khoa" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {departments.map(dept => (
                                                <SelectItem key={dept.deptId} value={dept.deptId}>
                                                    {dept.deptName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Lớp</Label>
                                    <Select value={editFormData.classId || ''} onValueChange={(value) => setEditFormData({ ...editFormData, classId: value })}>
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Chọn lớp" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {classes.map(cls => (
                                                <SelectItem key={cls.classId} value={cls.classId}>
                                                    {cls.className}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Trạng thái</Label>
                                    <Select value={editFormData.status || 'Active'} onValueChange={(value) => setEditFormData({ ...editFormData, status: value as any })}>
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Chọn trạng thái" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Active">Đang học</SelectItem>
                                            <SelectItem value="OnLeave">Tạm nghỉ</SelectItem>
                                            <SelectItem value="Graduated">Đã tốt nghiệp</SelectItem>
                                            <SelectItem value="Suspended">Bị đình chỉ</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => setEditOpen(false)}>Hủy</Button>
                        <Button onClick={handleSaveEdit}>Lưu thay đổi</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Dialog: Add Student */}
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Thêm sinh viên mới</DialogTitle>
                        <DialogDescription>Nhập thông tin sinh viên mới</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Mã sinh viên</Label>
                                <Input
                                    placeholder="VD: 2024001"
                                    value={addFormData.studentId}
                                    onChange={(e) => setAddFormData({ ...addFormData, studentId: e.target.value })}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label>Họ tên</Label>
                                <Input
                                    placeholder="Nhập họ tên"
                                    value={addFormData.fullname}
                                    onChange={(e) => setAddFormData({ ...addFormData, fullname: e.target.value })}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    placeholder="example@univ.edu"
                                    value={addFormData.email}
                                    onChange={(e) => setAddFormData({ ...addFormData, email: e.target.value })}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label>Điện thoại</Label>
                                <Input
                                    placeholder="Nhập số điện thoại"
                                    value={addFormData.phone}
                                    onChange={(e) => setAddFormData({ ...addFormData, phone: e.target.value })}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label>Khoa</Label>
                                <Select value={addFormData.deptId} onValueChange={(value) => setAddFormData({ ...addFormData, deptId: value })}>
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Chọn khoa" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {departments.map(dept => (
                                            <SelectItem key={dept.deptId} value={dept.deptId}>
                                                {dept.deptName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Lớp</Label>
                                <Select value={addFormData.classId} onValueChange={(value) => setAddFormData({ ...addFormData, classId: value })}>
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Chọn lớp" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {classes.map(cls => (
                                            <SelectItem key={cls.classId} value={cls.classId}>
                                                {cls.className}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => {
                            setAddOpen(false);
                            setAddFormData({
                                studentId: "",
                                fullname: "",
                                email: "",
                                phone: "",
                                deptId: "",
                                classId: "",
                                status: "Active",
                            });
                        }}>Hủy</Button>
                        <Button onClick={handleSaveNewStudent}>Thêm sinh viên</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
}
