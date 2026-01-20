"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
    Search, Plus, MoreVertical, Mail, Key,
    Lock, Unlock, Users, UserCheck, UserX, ChevronDown, Trash2
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useDeleteConfirm } from "@/components/ui/delete-confirm-dialog";
import api from "@/lib/api-client";
import { useEffect } from "react";
import type { UserDto, Role, StudentDto, TeacherDto, DepartmentDto } from "@/lib/api-client";

const roleColors: Record<Role, string> = {
    ADMIN: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    DEPARTMENT: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    TEACHER: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    STUDENT: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

export default function AdminUsersPage() {
    const router = useRouter();
    const [users, setUsers] = useState<UserDto[]>([]);
    const [students, setStudents] = useState<StudentDto[]>([]);
    const [teachers, setTeachers] = useState<TeacherDto[]>([]);
    const [departments, setDepartments] = useState<DepartmentDto[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);
    const { isOpen: isDeleteDialogOpen, itemToDelete, openDeleteDialog, handleConfirm: handleDeleteConfirm, handleClose: handleDeleteClose, DeleteDialog } = useDeleteConfirm();

    useEffect(() => {
        async function fetchAll() {
            const [userRes, studentRes, teacherRes, deptRes] = await Promise.all([
                api.auth.getAllUsers(),
                api.students.getAll(),
                api.teachers && api.teachers.getAll ? api.teachers.getAll() : Promise.resolve({ data: [] }),
                api.departments.getAll(),
            ]);
            setUsers(userRes.data ? (Array.isArray(userRes.data) ? userRes.data : [userRes.data]) : []);
            setStudents(studentRes.data || []);
            setTeachers(teacherRes.data || []);
            setDepartments(deptRes.data || []);
        }
        fetchAll();
    }, []);

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = (user.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (user.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (user.id + "").toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRole = roleFilter === "all" || user.role === roleFilter;
            const matchesStatus = statusFilter === "all" ||
                (statusFilter === "active" && !user.isLocked) ||
                (statusFilter === "locked" && user.isLocked);
            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [users, searchTerm, roleFilter, statusFilter]);

    // Get department for user
    const getUserDepartment = (user: UserDto): string => {
        if (user.role === 'STUDENT') {
            const student = students.find(s => s.accountId === user.id);
            if (student) {
                const dept = departments.find(d => d.deptId === student.deptId);
                return dept?.deptName || '-';
            }
        }
        if (user.role === 'TEACHER') {
            const teacher = teachers.find(t => t.accountId === user.id);
            if (teacher) {
                const dept = departments.find(d => d.deptId === teacher.deptId);
                return dept?.deptName || '-';
            }
        }
        if (user.role === 'DEPARTMENT') {
            return 'Quản lý Khoa';
        }
        return 'Quản trị';
    };

    // Stats
    const stats = {
        total: users.length,
        active: users.filter(u => !u.isLocked).length,
        locked: users.filter(u => u.isLocked).length,
        byRole: {
            ADMIN: users.filter(u => u.role === 'ADMIN').length,
            DEPARTMENT: users.filter(u => u.role === 'DEPARTMENT').length,
            TEACHER: users.filter(u => u.role === 'TEACHER').length,
            STUDENT: users.filter(u => u.role === 'STUDENT').length,
        }
    };

    const handleLockUser = async (userId: string) => {
        try {
            // API: POST /api/users/{userId}/lock
            setUsers(users.map(u => u.id === userId ? { ...u, isLocked: true } : u));
            toast.success("Tài khoản người dùng đã bị khóa");
        } catch (error) {
            toast.error("Lỗi khi khóa tài khoản");
        }
    };

    const handleUnlockUser = async (userId: string) => {
        try {
            // API: POST /api/users/{userId}/unlock
            setUsers(users.map(u => u.id === userId ? { ...u, isLocked: false } : u));
            toast.success("Tài khoản người dùng đã được mở khóa");
        } catch (error) {
            toast.error("Lỗi khi mở khóa tài khoản");
        }
    };

    const handleResetPassword = (user: UserDto) => {
        setSelectedUser(user);
        setIsResetPasswordDialogOpen(true);
    };

    const confirmResetPassword = async () => {
        if (selectedUser) {
            try {
                // API: POST /api/users/{userId}/reset-password
                toast.success(`Email đặt lại mật khẩu đã được gửi đến ${selectedUser.email}`);
                setIsResetPasswordDialogOpen(false);
                setSelectedUser(null);
            } catch (error) {
                toast.error("Lỗi khi đặt lại mật khẩu");
            }
        }
    };

    // Navigate to add user page with role
    const handleAddUser = (role: Role) => {
        router.push(`/admin/users/new?role=${role}`);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Quản lý Người dùng</h2>
                    <p className="text-muted-foreground">
                        Quản lý tài khoản người dùng, vai trò và quyền hạn
                    </p>
                </div>
                {/* Dropdown to select role and navigate to add user page */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tạo Người dùng
                            <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                        <DropdownMenuItem onClick={() => handleAddUser('ADMIN')}>
                            <Badge variant="outline" className={`${roleColors.ADMIN} mr-3`}>Admin</Badge>
                            Quản trị viên
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAddUser('DEPARTMENT')}>
                            <Badge variant="outline" className={`${roleColors.DEPARTMENT} mr-3`}>Khoa</Badge>
                            Trưởng Khoa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAddUser('TEACHER')}>
                            <Badge variant="outline" className={`${roleColors.TEACHER} mr-3`}>GV</Badge>
                            Giảng viên
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAddUser('STUDENT')}>
                            <Badge variant="outline" className={`${roleColors.STUDENT} mr-3`}>SV</Badge>
                            Sinh viên
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="py-4">
                        <CardDescription>Tổng Người dùng</CardDescription>
                        <CardTitle className="text-2xl flex items-center gap-2">
                            <Users className="h-5 w-5 text-muted-foreground" />
                            {stats.total}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="py-4">
                        <CardDescription>Người dùng Hoạt động</CardDescription>
                        <CardTitle className="text-2xl text-emerald-600 flex items-center gap-2">
                            <UserCheck className="h-5 w-5" />
                            {stats.active}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="py-4">
                        <CardDescription>Tài khoản Bị Khóa</CardDescription>
                        <CardTitle className="text-2xl text-red-600 flex items-center gap-2">
                            <UserX className="h-5 w-5" />
                            {stats.locked}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="py-4">
                        <CardDescription>Theo Vai trò</CardDescription>
                        <div className="flex gap-2 mt-1">
                            <Badge variant="outline" className={roleColors.ADMIN}>{stats.byRole.ADMIN}</Badge>
                            <Badge variant="outline" className={roleColors.DEPARTMENT}>{stats.byRole.DEPARTMENT}</Badge>
                            <Badge variant="outline" className={roleColors.TEACHER}>{stats.byRole.TEACHER}</Badge>
                            <Badge variant="outline" className={roleColors.STUDENT}>{stats.byRole.STUDENT}</Badge>
                        </div>
                    </CardHeader>
                </Card>
            </div>

            {/* Filters & Table */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, email, ID..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Vai trò" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả Vai trò</SelectItem>
                                    <SelectItem value="ADMIN">Quản trị viên</SelectItem>
                                    <SelectItem value="DEPARTMENT">Khoa</SelectItem>
                                    <SelectItem value="TEACHER">Giảng viên</SelectItem>
                                    <SelectItem value="STUDENT">Sinh viên</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả Trạng thái</SelectItem>
                                    <SelectItem value="active">Hoạt động</SelectItem>
                                    <SelectItem value="locked">Bị Khóa</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Người dùng</TableHead>
                                <TableHead>Vai trò</TableHead>
                                <TableHead>Khoa</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead className="w-[100px]">Hành động</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id} style={{ cursor: "pointer" }}
                                    onClick={() => router.push(`/admin/users/${user.id}`)}
                                >
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={user.avatarUrl} />
                                                <AvatarFallback>{user.fullName.substring(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{user.fullName}</div>
                                                <div className="text-xs text-muted-foreground">{user.email}</div>
                                                <div className="text-xs text-muted-foreground font-mono">ID: {user.id}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={roleColors[user.role]}>
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {getUserDepartment(user)}
                                    </TableCell>
                                    <TableCell>
                                        {user.isLocked ? (
                                            <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20">
                                                <Lock className="h-3 w-3 mr-1" />
                                                Bị Khóa
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                                                Hoạt động
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>
                                                    <Mail className="mr-2 h-4 w-4" />
                                                    Gửi Email
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleResetPassword(user);
                                                }}>
                                                    <Key className="mr-2 h-4 w-4" />
                                                    Đặt lại Mật khẩu
                                                </DropdownMenuItem>
                                                {user.isLocked ? (
                                                    <DropdownMenuItem onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleUnlockUser(user.id);
                                                    }}>
                                                        <Unlock className="mr-2 h-4 w-4" />
                                                        Mở Khóa Tài khoản
                                                    </DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleLockUser(user.id);
                                                    }} className="text-red-600">
                                                        <Lock className="mr-2 h-4 w-4" />
                                                        Khóa Tài khoản
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openDeleteDialog(
                                                            { id: user.id, name: user.fullName },
                                                            () => {
                                                                setUsers(users.filter(u => u.id !== user.id));
                                                                toast.success(`Người dùng ${user.fullName} đã bị xóa`);
                                                            }
                                                        );
                                                    }}
                                                    className="text-red-600"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Xóa Người dùng
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Reset Password Dialog */}
            <Dialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Đặt lại Mật khẩu</DialogTitle>
                        <DialogDescription>
                            Gửi email đặt lại mật khẩu cho {selectedUser?.fullName}?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsResetPasswordDialogOpen(false)}>Hủy</Button>
                        <Button onClick={confirmResetPassword}>Gửi Email Đặt lại</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <DeleteDialog />
        </div>
    );
}
