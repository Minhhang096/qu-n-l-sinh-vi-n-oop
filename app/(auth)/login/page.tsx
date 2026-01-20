"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GraduationCap, User, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth, getRoleDashboardPath } from "@/lib/auth-context";
import { toast } from "sonner";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const result = await login({
                username: formData.username,
                password: formData.password,
            });

            console.log('Login result:', result);
            console.log('User:', result.user);

            if (result.success && result.user) {
                toast.success("Đăng nhập thành công!");
                const dashboardPath = getRoleDashboardPath(result.user.role);
                console.log('Redirecting to:', dashboardPath);
                setTimeout(() => {
                    router.push(dashboardPath);
                }, 500);
            } else {
                toast.error(result.message || "Đăng nhập không thành công");
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra trong quá trình đăng nhập");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const fillDemoCredentials = (role: string) => {
        const credentials: Record<string, { username: string; password: string }> = {
            student: { username: "alice", password: "password123" },
            teacher: { username: "T001", password: "password123" },
            department: { username: "dept_cs", password: "password123" },
            admin: { username: "admin", password: "password123" },
        };

        const roleNames: Record<string, string> = {
            student: "Sinh viên",
            teacher: "Giảng viên",
            department: "Khoa",
            admin: "Quản trị viên",
        };

        const cred = credentials[role];
        if (cred) {
            setFormData(cred);
            toast.info(`Đã điền tài khoản demo cho ${roleNames[role]}`);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="border-2 shadow-xl">
                <CardHeader className="space-y-3 text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                            duration: 0.5,
                            delay: 0.2,
                            type: "spring",
                        }}
                        className="flex justify-center"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                            <GraduationCap className="h-7 w-7 text-primary-foreground" />
                        </div>
                    </motion.div>

                    <CardTitle className="text-2xl font-bold tracking-tight">
                        Chào mừng quay trở lại
                    </CardTitle>

                    <CardDescription className="text-base">
                        Đăng nhập để truy cập hệ thống Đại học Apex
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Tên đăng nhập</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="Nhập tên đăng nhập"
                                    className="pl-10"
                                    value={formData.username}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            username: e.target.value,
                                        })
                                    }
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Mật khẩu</Label>
                                <Link
                                    href="/forgot-password"
                                    className="text-xs text-primary hover:underline"
                                >
                                    Quên mật khẩu?
                                </Link>
                            </div>

                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="pl-10 pr-10"
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            password: e.target.value,
                                        })
                                    }
                                    required
                                    disabled={isSubmitting}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang xử lý đăng nhập...
                                </>
                            ) : (
                                "Đăng nhập"
                            )}
                        </Button>
                    </form>

                    <div className="mt-6">
                        <Separator className="my-4" />
                        <p className="text-center text-sm text-muted-foreground mb-3">
                            Chọn  loại tài khoản
                        </p>

                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    fillDemoCredentials("student")
                                }
                                disabled={isSubmitting}
                                className="transition-all hover:scale-105"
                            >
                                Sinh viên
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    fillDemoCredentials("teacher")
                                }
                                disabled={isSubmitting}
                                className="transition-all hover:scale-105"
                            >
                                Giảng viên
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    fillDemoCredentials("department")
                                }
                                disabled={isSubmitting}
                                className="transition-all hover:scale-105"
                            >
                                Ban đào tạo
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    fillDemoCredentials("admin")
                                }
                                disabled={isSubmitting}
                                className="transition-all hover:scale-105"
                            >
                               Quản trị viên
                            </Button>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="flex-col space-y-2">
                    <Separator />
                    <p className="text-sm text-muted-foreground text-center pt-2">
                        Chưa có tài khoản?{" "}
                        <Link
                            href="/register"
                            className="text-primary hover:underline font-medium"
                        >
                            Đăng ký tại đây
                        </Link>
                    </p>

                    <Link
                        href="/"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        ← Quay về trang chủ
                    </Link>
                </CardFooter>
            </Card>
        </motion.div>
    );
}
