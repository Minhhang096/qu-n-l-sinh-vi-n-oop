"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Mail, Lock, Eye, EyeOff, User, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import type { UserRole } from "@/lib/types";

export default function RegisterPage() {
    const router = useRouter();
    const { register } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        role: "" as UserRole | "",
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        // Student specific
        major: "",
        enrollmentYear: new Date().getFullYear(),
        // Staff specific
        department: "",
        officeLocation: "",
    });

    const handleNext = () => {
        if (step === 1) {
            if (!formData.email || !formData.password || !formData.confirmPassword) {
                toast.error("Vui lòng điền đầy đủ thông tin");
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                toast.error("Mật khẩu không khớp");
                return;
            }
            if (formData.password.length < 8) {
                toast.error("Mật khẩu phải có ít nhất 8 ký tự");
                return;
            }
        }
        if (step === 2 && !formData.role) {
            toast.error("Vui lòng chọn vai trò");
            return;
        }
        setStep(step + 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.firstName || !formData.lastName || !formData.dateOfBirth) {
            toast.error("Vui lòng điền đầy đủ thông tin hồ sơ");
            return;
        }

        setIsSubmitting(true);

        try {
            const profile =
                formData.role === "Student"
                    ? {
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        dateOfBirth: formData.dateOfBirth,
                        major: formData.major,
                        enrollmentYear: formData.enrollmentYear,
                        gpa: 0,
                    }
                    : {
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        dateOfBirth: formData.dateOfBirth,
                        department: formData.department,
                        officeLocation: formData.officeLocation,
                        hireDate: new Date().toISOString().split("T")[0],
                    };

            const result = await register({
                email: formData.email,
                password: formData.password,
                role: formData.role as UserRole,
                profile,
            });

            if (result.success) {
                toast.success(result.message || "Đăng ký thành công!");
                setTimeout(() => {
                    router.push("/login");
                }, 1500);
            } else {
                toast.error(result.message || "Đăng ký thất bại");
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi đăng ký");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="border-2 shadow-xl">
            <CardHeader className="space-y-3 text-center">
                <div className="flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                        <GraduationCap className="h-7 w-7 text-primary-foreground" />
                    </div>
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight">
                    Tạo tài khoản
                </CardTitle>
                <CardDescription className="text-base">
                    Tham gia Đại học Apex - Bước {step} / 3
                </CardDescription>
            </CardHeader>

            <CardContent>
                {/* Step Indicators */}
                <div className="flex items-center justify-center mb-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center">
                            <div
                                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${i < step
                                    ? "bg-primary text-primary-foreground"
                                    : i === step
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground"
                                    }`}
                            >
                                {i < step ? <Check className="h-4 w-4" /> : i}
                            </div>
                            {i < 3 && (
                                <div
                                    className={`h-0.5 w-12 mx-1 ${i < step ? "bg-primary" : "bg-muted"
                                        }`}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Step 1: Account Details */}
                {step === 1 && (
                    <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Địa chỉ Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="nguyen.van.a@university.edu"
                                    className="pl-10"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Mật khẩu</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="pl-10 pr-10"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="pl-10"
                                    value={formData.confirmPassword}
                                    onChange={(e) =>
                                        setFormData({ ...formData, confirmPassword: e.target.value })
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full" size="lg">
                            Tiếp tục
                        </Button>
                    </form>
                )}

                {/* Step 2: Role Selection */}
                {step === 2 && (
                    <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="role">Chọn vai trò của bạn</Label>
                            <Select
                                value={formData.role}
                                onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
                            >
                                <SelectTrigger id="role">
                                    <SelectValue placeholder="Chọn vai trò" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Student">Sinh viên</SelectItem>
                                    <SelectItem value="Teacher">Giảng viên</SelectItem>
                                    <SelectItem value="Department">Nhân viên Khoa</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground mt-2">
                                Lưu ý: Tài khoản Quản trị viên được tạo bởi quản trị viên hiện có
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                                Quay lại
                            </Button>
                            <Button type="submit" className="flex-1">
                                Tiếp tục
                            </Button>
                        </div>
                    </form>
                )}

                {/* Step 3: Profile Information */}
                {step === 3 && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">Họ</Label>
                                <Input
                                    id="firstName"
                                    placeholder="Nguyễn"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Tên</Label>
                                <Input
                                    id="lastName"
                                    placeholder="Văn A"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                            <Input
                                id="dateOfBirth"
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        {formData.role === "Student" && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="major">Ngành học</Label>
                                    <Input
                                        id="major"
                                        placeholder="VD: Công nghệ Thông tin"
                                        value={formData.major}
                                        onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </>
                        )}

                        {(formData.role === "Teacher" || formData.role === "Department") && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="department">Khoa</Label>
                                    <Input
                                        id="department"
                                        placeholder="VD: Công nghệ Thông tin"
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="officeLocation">Văn phòng</Label>
                                    <Input
                                        id="officeLocation"
                                        placeholder="VD: Tòa nhà Khoa học, Phòng 301"
                                        value={formData.officeLocation}
                                        onChange={(e) => setFormData({ ...formData, officeLocation: e.target.value })}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </>
                        )}

                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setStep(2)}
                                className="flex-1"
                                disabled={isSubmitting}
                            >
                                Quay lại
                            </Button>
                            <Button type="submit" className="flex-1" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Đang tạo...
                                    </>
                                ) : (
                                    "Tạo tài khoản"
                                )}
                            </Button>
                        </div>
                    </form>
                )}
            </CardContent>

            <CardFooter className="flex-col space-y-2">
                <Separator />
                <p className="text-sm text-muted-foreground text-center pt-2">
                    Đã có tài khoản?{" "}
                    <Link href="/login" className="text-primary hover:underline font-medium">
                        Đăng nhập
                    </Link>
                </p>
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                    ← Về trang chủ
                </Link>
            </CardFooter>
        </Card>
    );
}
