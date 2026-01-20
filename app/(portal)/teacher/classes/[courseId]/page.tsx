"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Search, Save, Download, Lock, Unlock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getToken } from "@/lib/api-client";

interface Section {
    sectionId: number;
    courseId: string;
    courseName: string;
    semester: string;
    schedule: string;
    capacity: number;
    enrolledCount: number;
    status: string;
    isGradeLocked: boolean;
    room?: string;
}

interface Enrollment {
    enrollmentId: number;
    studentId: string;
    studentName: string;
    sectionId: number;
    grade?: {
        gradeId: number;
        midterm: number | null;
        final: number | null;
        other: number | null;
        letterGrade: string;
    };
}

interface StudentWithGrade extends Enrollment {
    studentEmail?: string;
    total?: number;
}

export default function ClassDetailsPage() {
    const params = useParams();
    const sectionId = params.courseId ? parseInt(params.courseId as string) : 1;

    const [section, setSection] = useState<Section | null>(null);
    const [students, setStudents] = useState<StudentWithGrade[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isLocking, setIsLocking] = useState(false);

    // Load section and enrollments data
    useEffect(() => {
        async function loadData() {
            const token = getToken();
            if (!token) {
                toast.error("Vui lòng đăng nhập lại");
                setIsLoading(false);
                return;
            }

            try {
                // Fetch section info
                const sectionRes = await fetch(`http://localhost:5000/api/sections/${sectionId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                const sectionData = await sectionRes.json();
                if (sectionData.success && sectionData.data) {
                    setSection(sectionData.data);
                }

                // Fetch enrollments for this section
                const enrollRes = await fetch(`http://localhost:5000/api/enrollments?sectionId=${sectionId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                const enrollData = await enrollRes.json();
                
                if (enrollData.success && enrollData.data) {
                    // Fetch grades for each enrollment
                    const enrollmentsWithGrades = await Promise.all(
                        enrollData.data.map(async (enrollment: any) => {
                            try {
                                const gradeRes = await fetch(
                                    `http://localhost:5000/api/grades/enrollment/${enrollment.enrollmentId}`,
                                    {
                                        headers: {
                                            Authorization: `Bearer ${token}`,
                                            "Content-Type": "application/json",
                                        },
                                    }
                                );
                                const gradeData = await gradeRes.json();
                                const grade = gradeData.success ? gradeData.data : null;
                                
                                const total = grade && grade.midterm && grade.final
                                    ? (grade.midterm * 0.4) + (grade.final * 0.6)
                                    : 0;

                                return {
                                    ...enrollment,
                                    grade,
                                    total,
                                };
                            } catch (err) {
                                console.error("Lỗi tải điểm:", err);
                                return enrollment;
                            }
                        })
                    );
                    setStudents(enrollmentsWithGrades);
                } else {
                    setStudents([]);
                }
            } catch (error) {
                console.error("Lỗi tải dữ liệu lớp học:", error);
                toast.error("Không tải được dữ liệu lớp học");
            } finally {
                setIsLoading(false);
            }
        }

        loadData();
    }, [sectionId]);

    const calculateGrade = (midterm: number | null, final: number | null) => {
        if (!midterm || !final) return "—";
        const score = (midterm * 0.4) + (final * 0.6);
        if (score >= 90) return "A";
        if (score >= 85) return "B+";
        if (score >= 80) return "B";
        if (score >= 75) return "C+";
        if (score >= 70) return "C";
        if (score >= 60) return "D";
        return "F";
    };

    const handleGradeChange = (enrollmentId: number, field: "midterm" | "final", value: string) => {
        const numValue = Math.min(100, Math.max(0, Number(value) || 0));
        setStudents(students.map(s =>
            s.enrollmentId === enrollmentId
                ? {
                    ...s,
                    grade: {
                        ...s.grade,
                        [field]: numValue,
                        gradeId: s.grade?.gradeId || 0,
                        other: s.grade?.other || 0,
                        letterGrade: s.grade?.letterGrade || "",
                    },
                    total: (field === "midterm" ? numValue : (s.grade?.midterm || 0)) * 0.4 +
                        (field === "final" ? numValue : (s.grade?.final || 0)) * 0.6,
                }
                : s
        ));
    };

    const handleSave = async () => {
        setIsSaving(true);
        const token = getToken();

        try {
            // Save all grades that have been edited
            for (const student of students) {
                if (student.grade && (student.grade.midterm || student.grade.final)) {
                    const res = await fetch("http://localhost:5000/api/grades", {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            enrollmentId: student.enrollmentId,
                            midterm: student.grade.midterm,
                            final: student.grade.final,
                            other: student.grade.other || 0,
                        }),
                    });
                    const data = await res.json();
                    if (!data.success) {
                        toast.error(`Lỗi lưu điểm cho ${student.studentName}: ${data.message}`);
                        return;
                    }
                }
            }
            setIsEditing(false);
            toast.success("Lưu điểm thành công!");
        } catch (error) {
            console.error("Lỗi lưu điểm:", error);
            toast.error("Lỗi lưu điểm");
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggleLock = async () => {
        if (!section) return;
        setIsLocking(true);
        const token = getToken();

        try {
            const res = await fetch(`http://localhost:5000/api/sections/${section.sectionId}/lock-grade`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();
            if (data.success) {
                setSection({ ...section, isGradeLocked: !section.isGradeLocked });
                toast.success(data.message);
            } else {
                toast.error(data.message || "Lỗi khóa điểm");
            }
        } catch (error) {
            console.error("Lỗi khóa điểm:", error);
            toast.error("Lỗi khóa điểm");
        } finally {
            setIsLocking(false);
        }
    };

    const handleDownloadCSV = () => {
        if (!section || students.length === 0) {
            toast.error("Không có dữ liệu để xuất");
            return;
        }

        const csvContent = [
            ["Mã sinh viên", "Tên sinh viên", "Giữa kỳ", "Cuối kỳ", "Tổng điểm", "Xếp loại"],
            ...students.map(s => [
                s.studentId,
                s.studentName,
                s.grade?.midterm || "—",
                s.grade?.final || "—",
                s.total ? Math.round(s.total) : "—",
                calculateGrade(s.grade?.midterm || null, s.grade?.final || null),
            ]),
        ]
            .map(row => row.map(cell => `"${cell}"`).join(","))
            .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${section.courseName}_${section.semester}_grades.csv`;
        link.click();
        toast.success("Xuất CSV thành công!");
    };

    const filteredStudents = students.filter(s =>
        s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.studentId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        avg: students.length > 0 
            ? Math.round(students.reduce((acc, s) => acc + (s.total || 0), 0) / students.length)
            : 0,
        highest: students.length > 0
            ? Math.round(Math.max(...students.map(s => s.total || 0)))
            : 0,
        passRate: students.length > 0
            ? Math.round((students.filter(s => (s.total || 0) >= 60).length / students.length) * 100)
            : 0,
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
                    <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{section?.semester || "—"}</Badge>
                        <Badge className={section?.isGradeLocked ? "bg-red-500" : "bg-emerald-500"}>
                            {section?.isGradeLocked ? "🔒 Đã khóa" : "Đang mở"}
                        </Badge>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight">{section?.courseName || "Lớp học phần"}</h2>
                    <p className="text-muted-foreground">
                        {section?.schedule || "—"} • {section?.room || "—"}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button 
                        variant="outline" 
                        onClick={handleDownloadCSV}
                        disabled={isLoading}
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Xuất CSV
                    </Button>
                    <Button
                        variant={section?.isGradeLocked ? "destructive" : "outline"}
                        onClick={handleToggleLock}
                        disabled={isLocking}
                    >
                        {isLocking ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : section?.isGradeLocked ? (
                            <Unlock className="mr-2 h-4 w-4" />
                        ) : (
                            <Lock className="mr-2 h-4 w-4" />
                        )}
                        {section?.isGradeLocked ? "Mở khóa" : "Khóa điểm"}
                    </Button>
                    {isEditing ? (
                        <Button 
                            onClick={handleSave} 
                            className="bg-emerald-600 hover:bg-emerald-700"
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="mr-2 h-4 w-4" />
                            )}
                            Lưu điểm
                        </Button>
                    ) : (
                        <Button 
                            onClick={() => setIsEditing(true)}
                            disabled={section?.isGradeLocked}
                        >
                            Sửa điểm
                        </Button>
                    )}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="py-4">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Điểm trung bình lớp</CardTitle>
                        <div className="text-2xl font-bold">{stats.avg}</div>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="py-4">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Điểm cao nhất</CardTitle>
                        <div className="text-2xl font-bold">{stats.highest}</div>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="py-4">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Tỷ lệ đạt</CardTitle>
                        <div className="text-2xl font-bold text-emerald-600">{stats.passRate}%</div>
                    </CardHeader>
                </Card>
            </div>

            {/* Roster & Grades */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Danh sách sinh viên & Điểm</CardTitle>
                            <CardDescription>Quản lý điểm cho {students.length} sinh viên đã đăng ký</CardDescription>
                        </div>
                        <div className="relative w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Tìm sinh viên..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    {filteredStudents.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            Chưa có sinh viên đăng ký
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Sinh viên</TableHead>
                                    <TableHead className="text-center w-[110px]">Giữa kỳ (40%)</TableHead>
                                    <TableHead className="text-center w-[110px]">Cuối kỳ (60%)</TableHead>
                                    <TableHead className="text-center">Tổng</TableHead>
                                    <TableHead className="text-center">Xếp loại</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {filteredStudents.map((student) => (
                                    <TableRow key={student.enrollmentId}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.studentName}`} />
                                                    <AvatarFallback>{student.studentName.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium">{student.studentName}</div>
                                                    <div className="text-xs text-muted-foreground">{student.studentId}</div>
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell className="text-center">
                                            {isEditing ? (
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    className="w-16 h-8 text-center mx-auto"
                                                    value={student.grade?.midterm || ""}
                                                    onChange={(e) => handleGradeChange(student.enrollmentId, "midterm", e.target.value)}
                                                    disabled={section?.isGradeLocked}
                                                />
                                            ) : (
                                                student.grade?.midterm || "—"
                                            )}
                                        </TableCell>

                                        <TableCell className="text-center">
                                            {isEditing ? (
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    className="w-16 h-8 text-center mx-auto"
                                                    value={student.grade?.final || ""}
                                                    onChange={(e) => handleGradeChange(student.enrollmentId, "final", e.target.value)}
                                                    disabled={section?.isGradeLocked}
                                                />
                                            ) : (
                                                student.grade?.final || "—"
                                            )}
                                        </TableCell>

                                        <TableCell className="text-center font-medium">
                                            {student.total ? Math.round(student.total) : "—"}
                                        </TableCell>

                                        <TableCell className="text-center">
                                            <span
                                                className={`font-bold ${
                                                    calculateGrade(student.grade?.midterm || null, student.grade?.final || null).startsWith("A")
                                                        ? "text-emerald-600"
                                                        : calculateGrade(student.grade?.midterm || null, student.grade?.final || null).startsWith("F")
                                                        ? "text-red-600"
                                                        : "text-foreground"
                                                }`}
                                            >
                                                {calculateGrade(student.grade?.midterm || null, student.grade?.final || null)}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
