"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Shield, Plus, MoreVertical, Edit, Trash2, Check, X,
    Users, BookOpen, Settings, BarChart3, FileText
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useDeleteConfirm } from "@/components/ui/delete-confirm-dialog";

interface Permission {
    id: string;
    name: string;
    description: string;
    category: string;
}

interface Role {
    id: string;
    name: string;
    description: string;
    userCount: number;
    permissions: string[];
    isSystem: boolean;
}

const permissions: Permission[] = [
    { id: "users.view", name: "Xem Người dùng", description: "Xem hồ sơ và danh sách người dùng", category: "Người dùng" },
    { id: "users.create", name: "Tạo Người dùng", description: "Thêm người dùng mới vào hệ thống", category: "Người dùng" },
    { id: "users.edit", name: "Chỉnh sửa Người dùng", description: "Sửa thông tin người dùng", category: "Người dùng" },
    { id: "users.delete", name: "Xóa Người dùng", description: "Xóa người dùng khỏi hệ thống", category: "Người dùng" },
    { id: "courses.view", name: "Xem Môn học", description: "Xem thông tin môn học", category: "Môn học" },
    { id: "courses.create", name: "Tạo Môn học", description: "Thêm môn học mới", category: "Môn học" },
    { id: "courses.edit", name: "Chỉnh sửa Môn học", description: "Sửa chi tiết môn học", category: "Môn học" },
    { id: "grades.view", name: "Xem Điểm", description: "Xem điểm sinh viên", category: "Điểm" },
    { id: "grades.edit", name: "Chỉnh sửa Điểm", description: "Sửa điểm sinh viên", category: "Điểm" },
    { id: "reports.view", name: "Xem Báo cáo", description: "Truy cập báo cáo hệ thống", category: "Báo cáo" },
    { id: "settings.view", name: "Xem Cài đặt", description: "Xem cài đặt hệ thống", category: "Cài đặt" },
    { id: "settings.edit", name: "Chỉnh sửa Cài đặt", description: "Sửa cài đặt hệ thống", category: "Cài đặt" },
];

const mockRoles: Role[] = [
    {
        id: "admin",
        name: "Quản trị viên",
        description: "Truy cập toàn bộ hệ thống với tất cả quyền hạn",
        userCount: 3,
        permissions: permissions.map(p => p.id),
        isSystem: true
    },
    {
        id: "teacher",
        name: "Giảng viên",
        description: "Có thể quản lý lớp học và điểm",
        userCount: 45,
        permissions: ["courses.view", "grades.view", "grades.edit", "users.view"],
        isSystem: true
    },
    {
        id: "student",
        name: "Sinh viên",
        description: "Truy cập cơ bản để xem môn học và điểm",
        userCount: 1250,
        permissions: ["courses.view", "grades.view"],
        isSystem: true
    },
    {
        id: "dept_head",
        name: "Trưởng Khoa",
        description: "Quản lý cấp khoa",
        userCount: 8,
        permissions: ["users.view", "courses.view", "courses.edit", "grades.view", "reports.view"],
        isSystem: false
    },
];

export default function RolesPermissionsPage() {
    const [roles, setRoles] = useState<Role[]>(mockRoles);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [newRoleName, setNewRoleName] = useState("");
    const [newRoleDesc, setNewRoleDesc] = useState("");
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { openDeleteDialog, DeleteDialog } = useDeleteConfirm();

    const permissionCategories = [...new Set(permissions.map(p => p.category))];

    // Load roles from API
    useEffect(() => {
        // In production, fetch from: GET /api/roles
        // For now using mock data
    }, []);    const handleEditRole = (role: Role) => {
        setSelectedRole(role);
        setIsEditDialogOpen(true);
    };

    const handleDeleteRole = (role: Role) => {
        openDeleteDialog(
            { id: role.id, name: role.name },
            () => {
                setRoles(roles.filter(r => r.id !== role.id));
                toast.success(`Role "${role.name}" deleted successfully`);
            }
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Vai trò & Quyền hạn</h2>
                    <p className="text-muted-foreground">
                        Quản lý vai trò người dùng và quyền truy cập của họ
                    </p>
                </div>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Tạo Vai trò
                </Button>
            </div>

            {/* Roles List */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {roles.map((role) => (
                    <motion.div
                        key={role.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Card className="h-full">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <Shield className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{role.name}</CardTitle>
                                            {role.isSystem && (
                                                <Badge variant="secondary" className="text-xs mt-1">
                                                    Vai trò Hệ thống
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    {!role.isSystem && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEditRole(role)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Chỉnh sửa Vai trò
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDeleteRole(role)}
                                                    className="text-red-600"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Xóa Vai trò
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <CardDescription className="line-clamp-2">
                                    {role.description}
                                </CardDescription>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Người dùng</span>
                                    <span className="font-medium">{role.userCount}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Quyền hạn</span>
                                    <span className="font-medium">{role.permissions.length}</span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {role.permissions.slice(0, 3).map((permId) => {
                                        const perm = permissions.find(p => p.id === permId);
                                        return perm ? (
                                            <Badge key={permId} variant="outline" className="text-xs">
                                                {perm.name}
                                            </Badge>
                                        ) : null;
                                    })}
                                    {role.permissions.length > 3 && (
                                        <Badge variant="outline" className="text-xs">
                                            +{role.permissions.length - 3} thêm
                                        </Badge>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Permissions Reference Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Tham chiếu Quyền hạn</CardTitle>
                    <CardDescription>Các quyền hạn khả dụng trong hệ thống</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Quyền hạn</TableHead>
                                <TableHead>Danh mục</TableHead>
                                <TableHead>Mô tả</TableHead>
                                <TableHead className="text-center">Vai trò có quyền truy cập</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {permissions.map((perm) => {
                                const rolesWithPerm = roles.filter(r => r.permissions.includes(perm.id));
                                return (
                                    <TableRow key={perm.id}>
                                        <TableCell className="font-medium">{perm.name}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{perm.category}</Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">{perm.description}</TableCell>
                                        <TableCell className="text-center">
                                            <span className="font-medium">{rolesWithPerm.length}</span>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Create Role Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Tạo Vai trò Mới</DialogTitle>
                        <DialogDescription>
                            Xác định một vai trò mới với các quyền hạn cụ thể
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="roleName">Tên Vai trò</Label>
                            <Input 
                                id="roleName" 
                                placeholder="Ví dụ: Hỗ trợ Khoa"
                                value={newRoleName}
                                onChange={(e) => setNewRoleName(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="roleDesc">Mô tả</Label>
                            <Input 
                                id="roleDesc" 
                                placeholder="Mô tả vai trò này có thể làm gì"
                                value={newRoleDesc}
                                onChange={(e) => setNewRoleDesc(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-4">
                            <Label>Quyền hạn</Label>
                            {permissionCategories.map((category) => (
                                <div key={category} className="space-y-2">
                                    <h4 className="font-medium text-sm">{category}</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {permissions.filter(p => p.category === category).map((perm) => (
                                            <div key={perm.id} className="flex items-center space-x-2">
                                                <Checkbox 
                                                    id={perm.id}
                                                    checked={selectedPermissions.includes(perm.id)}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            setSelectedPermissions([...selectedPermissions, perm.id]);
                                                        } else {
                                                            setSelectedPermissions(selectedPermissions.filter(p => p !== perm.id));
                                                        }
                                                    }}
                                                />
                                                <label htmlFor={perm.id} className="text-sm">
                                                    {perm.name}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => {
                            setIsCreateDialogOpen(false);
                            setNewRoleName("");
                            setNewRoleDesc("");
                            setSelectedPermissions([]);
                        }}>
                            Hủy
                        </Button>
                        <Button onClick={async () => {
                            if (!newRoleName.trim()) {
                                toast.error("Vui lòng nhập tên vai trò");
                                return;
                            }
                            
                            setIsLoading(true);
                            try {
                                // API: POST /api/roles
                                const newRole: Role = {
                                    id: Date.now().toString(),
                                    name: newRoleName,
                                    description: newRoleDesc,
                                    userCount: 0,
                                    permissions: selectedPermissions,
                                    isSystem: false
                                };
                                
                                // Simulate API call
                                setTimeout(() => {
                                    setRoles([...roles, newRole]);
                                    toast.success("Vai trò đã được tạo thành công");
                                    setIsCreateDialogOpen(false);
                                    setNewRoleName("");
                                    setNewRoleDesc("");
                                    setSelectedPermissions([]);
                                    setIsLoading(false);
                                }, 500);
                            } catch (error) {
                                toast.error("Lỗi khi tạo vai trò");
                                setIsLoading(false);
                            }
                        }} disabled={isLoading}>
                            {isLoading ? "Đang tạo..." : "Tạo Vai trò"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <DeleteDialog />
        </div>
    );
}
