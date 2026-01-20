"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff, Building, Briefcase, GraduationCap, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { departments } from "@/lib/mock-db";
import type { Role } from "@/lib/db-types";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const roleColors: Record<Role, string> = {
    ADMIN: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    DEPARTMENT: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    TEACHER: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    STUDENT: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

const roleDescriptions: Record<Role, string> = {
    ADMIN: "Full system access, user management, and configuration",
    DEPARTMENT: "Manage courses, sections, enrollments, and academic reports",
    TEACHER: "Manage classes, grades, and student progress",
    STUDENT: "Access courses, view grades, and manage enrollments",
};

const validRoles: Role[] = ["ADMIN", "DEPARTMENT", "TEACHER", "STUDENT"];

export default function AddUserPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const roleFromUrl = searchParams.get("role") as Role | null;

    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        role: (roleFromUrl && validRoles.includes(roleFromUrl) ? roleFromUrl : "") as Role | "",
        firstName: "",
        lastName: "",
        phone: "",
        departmentId: "",
        // Student specific
        dateOfBirth: "",
        classId: "",
        // Teacher/Staff specific
        officeLocation: "",
    });

    // Update role if URL param changes
    useEffect(() => {
        if (roleFromUrl && validRoles.includes(roleFromUrl)) {
            setFormData(prev => ({ ...prev, role: roleFromUrl }));
        }
    }, [roleFromUrl]);

    const handleRoleChange = (role: Role) => {
        setFormData({ ...formData, role });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email || !formData.password || !formData.role) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (formData.password.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            toast.success(`User ${formData.email} created successfully!`);
            router.push("/admin/users");
        } catch (error) {
            toast.error("Failed to create user");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex items-center gap-4">
                <Link href="/admin/users">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Add New User</h1>
                    <p className="text-muted-foreground">Create a new user account in the system</p>
                </div>
            </motion.div>

            <form onSubmit={handleSubmit}>
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Role Selection */}
                    <motion.div variants={itemVariants} className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Select Role</CardTitle>
                                <CardDescription>Choose the user's role in the system</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {(["ADMIN", "DEPARTMENT", "TEACHER", "STUDENT"] as Role[]).map((role) => (
                                    <motion.div
                                        key={role}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => handleRoleChange(role)}
                                            className={`w-full p-4 rounded-lg border-2 text-left transition-all ${formData.role === role
                                                ? "border-primary bg-primary/5"
                                                : "border-muted hover:border-muted-foreground/30"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Badge variant="outline" className={roleColors[role]}>
                                                    {role}
                                                </Badge>
                                                {formData.role === role && (
                                                    <span className="text-xs text-primary font-medium">Selected</span>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-2">
                                                {roleDescriptions[role]}
                                            </p>
                                        </button>
                                    </motion.div>
                                ))}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* User Details */}
                    <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
                        {/* Account Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Mail className="h-5 w-5" />
                                    Account Information
                                </CardTitle>
                                <CardDescription>Login credentials for the new user</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address *</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="user@university.edu"
                                            className="pl-10"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password *</Label>
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
                                                disabled={isSubmitting}
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
                                        <Label htmlFor="confirmPassword">Confirm Password *</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="confirmPassword"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                className="pl-10"
                                                value={formData.confirmPassword}
                                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                required
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Personal Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Personal Information
                                </CardTitle>
                                <CardDescription>Basic profile details</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name *</Label>
                                        <Input
                                            id="firstName"
                                            placeholder="John"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name *</Label>
                                        <Input
                                            id="lastName"
                                            placeholder="Doe"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="+1 555-0123"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="department">Department</Label>
                                        <Select
                                            value={formData.departmentId}
                                            onValueChange={(value) => setFormData({ ...formData, departmentId: value })}
                                            disabled={isSubmitting}
                                        >
                                            <SelectTrigger id="department">
                                                <SelectValue placeholder="Select department" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {departments.map(dept => (
                                                    <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Role-specific fields */}
                                {formData.role === "STUDENT" && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="space-y-4"
                                    >
                                        <Separator />
                                        <div className="flex items-center gap-2">
                                            <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm font-medium">Student Details</span>
                                        </div>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                                                <Input
                                                    id="dateOfBirth"
                                                    type="date"
                                                    value={formData.dateOfBirth}
                                                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="classId">Class/Cohort</Label>
                                                <Input
                                                    id="classId"
                                                    placeholder="e.g., CS2024A"
                                                    value={formData.classId}
                                                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {(formData.role === "TEACHER" || formData.role === "DEPARTMENT") && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="space-y-4"
                                    >
                                        <Separator />
                                        <div className="flex items-center gap-2">
                                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm font-medium">Staff Details</span>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="officeLocation">Office Location</Label>
                                            <Input
                                                id="officeLocation"
                                                placeholder="e.g., Science Building, Room 301"
                                                value={formData.officeLocation}
                                                onChange={(e) => setFormData({ ...formData, officeLocation: e.target.value })}
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <motion.div variants={itemVariants} className="flex justify-end gap-3">
                            <Link href="/admin/users">
                                <Button type="button" variant="outline" disabled={isSubmitting}>
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={isSubmitting || !formData.role}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating User...
                                    </>
                                ) : (
                                    "Create User"
                                )}
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </form>
        </motion.div>
    );
}
