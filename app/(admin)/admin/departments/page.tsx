"use client";

import { useState, useMemo, useEffect } from "react";
import {
    Search, Plus, MoreVertical, Edit, Trash2, Users,
    GraduationCap, BookOpen, Loader2
} from "lucide-react";
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useDeleteConfirm } from "@/components/ui/delete-confirm-dialog";
import { departmentsApi, statsApi, DepartmentDto, DashboardStatsDto } from "@/lib/api-client";

export default function AdminDepartmentsPage() {
    const [depts, setDepts] = useState<DepartmentDto[]>([]);
    const [stats, setStats] = useState<DashboardStatsDto | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [selectedDept, setSelectedDept] = useState<DepartmentDto | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({ deptId: "", deptName: "" });
    const { openDeleteDialog, DeleteDialog } = useDeleteConfirm();

    // Fetch departments and stats
    useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            try {
                const [deptsRes, statsRes] = await Promise.all([
                    departmentsApi.getAll(),
                    statsApi.getDashboard()
                ]);
                
                if (deptsRes.success && deptsRes.data) {
                    setDepts(deptsRes.data);
                }
                if (statsRes.success && statsRes.data) {
                    setStats(statsRes.data);
                }
            } catch (error) {
                toast.error("Failed to load departments");
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, []);

    const filteredDepts = useMemo(() => {
        return depts.filter(dept =>
            dept.deptName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dept.deptId.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [depts, searchTerm]);

    const handleViewDept = (dept: DepartmentDto) => {
        setSelectedDept(dept);
        setFormData({ deptId: dept.deptId, deptName: dept.deptName });
        setIsViewDialogOpen(true);
    };

    const handleCreateDept = async () => {
        if (!formData.deptId || !formData.deptName) {
            toast.error("Vui lòng điền đầy đủ các trường bắt buộc");
            return;
        }
        
        setIsSubmitting(true);
        try {
            const response = await departmentsApi.create(formData);
            if (response.success && response.data) {
                setDepts([...depts, response.data]);
                toast.success("Khoa đã được tạo thành công");
                setIsCreateDialogOpen(false);
                setFormData({ deptId: "", deptName: "" });
            } else {
                toast.error(response.message || "Không thể tạo khoa");
            }
        } catch (error) {
            toast.error("Không thể tạo khoa");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateDept = async () => {
        if (!selectedDept || !formData.deptName) return;
        
        setIsSubmitting(true);
        try {
            const response = await departmentsApi.update(selectedDept.deptId, formData);
            if (response.success && response.data) {
                setDepts(depts.map(d => d.deptId === selectedDept.deptId ? { ...d, ...response.data } : d));
                toast.success("Khoa đã được cập nhật thành công");
                setIsViewDialogOpen(false);
            } else {
                toast.error(response.message || "Không thể cập nhật khoa");
            }
        } catch (error) {
            toast.error("Không thể cập nhật khoa");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteDept = (dept: DepartmentDto) => {
        openDeleteDialog(
            { id: dept.deptId, name: dept.deptName },
            async () => {
                try {
                    const response = await departmentsApi.delete(dept.deptId);
                    if (response.success) {
                        setDepts(depts.filter(d => d.deptId !== dept.deptId));
                        toast.success(`Khoa "${dept.deptName}" đã được xóa thành công`);
                    } else {
                        toast.error(response.message || "Không thể xóa khoa");
                    }
                } catch (error) {
                    toast.error("Không thể xóa khoa");
                }
            }
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Các Khoa</h2>
                    <p className="text-muted-foreground">
                        Quản lý các khoa học thuật và cấu trúc tổ chức
                    </p>
                </div>
                <Button onClick={() => {
                    setFormData({ deptId: "", deptName: "" });
                    setIsCreateDialogOpen(true);
                }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm Khoa
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="py-4">
                        <CardDescription>Tổng số Khoa</CardDescription>
                        <CardTitle className="text-2xl">{stats?.totalDepartments || depts.length}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="py-4">
                        <CardDescription>Tổng Giảng viên</CardDescription>
                        <CardTitle className="text-2xl">{stats?.totalTeachers || 0}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="py-4">
                        <CardDescription>Tổng Sinh viên</CardDescription>
                        <CardTitle className="text-2xl">{stats?.totalStudents || 0}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="py-4">
                        <CardDescription>Tổng Môn học</CardDescription>
                        <CardTitle className="text-2xl">{stats?.totalCourses || 0}</CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Tìm kiếm khoa..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Department Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredDepts.map((dept) => (
                    <Card key={dept.deptId} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleViewDept(dept)}>
                        <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                                <div>
                                    <Badge variant="outline" className="font-mono mb-2">{dept.deptId}</Badge>
                                    <CardTitle className="text-lg">{dept.deptName}</CardTitle>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                        <Button variant="ghost" size="icon">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleViewDept(dept); }}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDeleteDept(dept); }} className="text-red-600">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <span>{dept.teacherCount || 0} Giảng viên</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                    <span>{dept.studentCount || 0} Sinh viên</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                                    <span>{dept.courseCount || 0} Môn học</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredDepts.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    {searchTerm ? "Không tìm thấy khoa nào phù hợp với tìm kiếm" : "Không tìm thấy khoa nào"}
                </div>
            )}

            {/* View/Edit Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Chi tiết Khoa</DialogTitle>
                        <DialogDescription>Xem và chỉnh sửa thông tin khoa</DialogDescription>
                    </DialogHeader>
                    {selectedDept && (
                        <div className="grid gap-4 py-4">
                            <div>
                                <Label className="text-muted-foreground text-xs">Code</Label>
                                <p className="font-mono font-medium">{selectedDept.deptId}</p>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="editDeptName">Department Name</Label>
                                <Input 
                                    id="editDeptName" 
                                    value={formData.deptName}
                                    onChange={(e) => setFormData({ ...formData, deptName: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-4 pt-2">
                                <div className="text-center p-3 bg-muted rounded-lg">
                                    <p className="text-2xl font-bold">{selectedDept.teacherCount || 0}</p>
                                    <p className="text-xs text-muted-foreground">Faculty</p>
                                </div>
                                <div className="text-center p-3 bg-muted rounded-lg">
                                    <p className="text-2xl font-bold">{selectedDept.studentCount || 0}</p>
                                    <p className="text-xs text-muted-foreground">Students</p>
                                </div>
                                <div className="text-center p-3 bg-muted rounded-lg">
                                    <p className="text-2xl font-bold">{selectedDept.courseCount || 0}</p>
                                    <p className="text-xs text-muted-foreground">Courses</p>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Hủy</Button>
                        <Button onClick={handleUpdateDept} disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Lưu Thay đổi
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Thêm Khoa Mới</DialogTitle>
                        <DialogDescription>Tạo một khoa học thuật mới</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="deptCode">Mã Khoa *</Label>
                            <Input 
                                id="deptCode" 
                                placeholder="Ví dụ: CS" 
                                className="font-mono"
                                value={formData.deptId}
                                onChange={(e) => setFormData({ ...formData, deptId: e.target.value.toUpperCase() })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="deptName">Tên Khoa *</Label>
                            <Input 
                                id="deptName" 
                                placeholder="Ví dụ: Khoa Khoa học Máy tính"
                                value={formData.deptName}
                                onChange={(e) => setFormData({ ...formData, deptName: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Hủy</Button>
                        <Button onClick={handleCreateDept} disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Tạo Khoa
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <DeleteDialog />
        </div>
    );
}
