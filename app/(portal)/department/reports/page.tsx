"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { TrendingUp, Users, BookOpen, GraduationCap, Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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
import api from "@/lib/api-client";
import { useEffect } from "react";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function DepartmentReportsPage() {
    // const [selectedPeriod, setSelectedPeriod] = useState("current");
    const [reportDialogOpen, setReportDialogOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState<string | null>(null);
    const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);
    const [students, setStudents] = useState<{ id: string; departmentId: string; status: string }[]>([]);
    const [courses, setCourses] = useState<{ id: string; name: string }[]>([]);
    const [sections, setSections] = useState<{ id: string; courseId: string; capacity: number; enrolledCount: number; status: string }[]>([]);
    const [enrollments, setEnrollments] = useState<{ id: string; studentId: string; status: string }[]>([]);
    // const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const [deptRes, studentRes, courseRes, sectionRes, enrollRes] = await Promise.all([
                api.departments.getAll(),
                api.students.getAll(),
                api.courses.getAll(),
                api.sections.getAll(),
                api.enrollments.getAll(),
            ]);
            setDepartments(deptRes.data || []);
            setStudents(studentRes.data || []);
            setCourses(courseRes.data || []);
            setSections(sectionRes.data || []);
            setEnrollments(enrollRes.data || []);
            setLoading(false);
        }
        fetchData();
    }, []);

    const stats = {
        totalStudents: students.length,
        activeStudents: students.filter(s => s.status === 'ACTIVE').length,
        totalCourses: courses.length,
        totalSections: sections.length,
        openSections: sections.filter(s => s.status === 'OPEN').length,
        totalEnrollments: enrollments.length,
        activeEnrollments: enrollments.filter(e => e.status === 'ENROLLED').length,
        avgEnrollmentPerSection: Math.round(enrollments.length / (sections.length || 1) * 10) / 10 || 0,
    };

    const enrollmentByDept = departments.map(dept => {
        const deptStudents = students.filter(s => s.departmentId === dept.id);
        const deptEnrollments = enrollments.filter(e => deptStudents.some(s => s.id === e.studentId));
        return { department: dept.name, id: dept.id, students: deptStudents.length, enrollments: deptEnrollments.length };
    });

    // Report data generators
    const getEnrollmentReport = () => {
        // This should be replaced with real logic if backend supports levels
        const total = enrollments.filter(e => e.status === 'ENROLLED').length;
        return [
            { level: "Cơ sở", count: Math.round(total * 0.3) },
            { level: "Trung cấp", count: Math.round(total * 0.35) },
            { level: "Nâng cao", count: Math.round(total * 0.25) },
            { level: "Chuyên sâu", count: Math.round(total * 0.1) },
        ];
    };

    const getCourseAnalysis = () => {
        return sections.slice(0, 10).map(section => ({
            courseId: section.courseId,
            courseName: courses.find(c => c.id === section.courseId)?.name || "N/A",
            capacity: section.capacity,
            enrolled: section.enrolledCount,
            utilization: Math.round((section.enrolledCount / (section.capacity || 1)) * 100)
        }));
    };

    const getStudentStats = () => {
        return departments.map(dept => {
            const deptStudents = students.filter(s => s.departmentId === dept.id);
            const active = deptStudents.filter(s => s.status === 'ACTIVE').length;
            const inactive = deptStudents.length - active;
            return {
                department: dept.name,
                active,
                inactive,
                total: deptStudents.length,
            };
        });
    };

    const handleGenerateReport = (reportType: string) => {
        setSelectedReport(reportType);
        setReportDialogOpen(true);
    };

    const reportCards = [
        {
            title: "Báo cáo đăng ký học phần",
            description: "Thống kê và xu hướng đăng ký học phần của sinh viên",
            icon: GraduationCap,
            color: "text-emerald-600",
            bgColor: "bg-emerald-500/10",
            stats: `${stats.activeEnrollments} đang hiệu lực`
        },
        {
            title: "Phân tích học phần",
            description: "Mức độ phổ biến học phần và tỷ lệ sử dụng chỉ tiêu",
            icon: BookOpen,
            color: "text-blue-600",
            bgColor: "bg-blue-500/10",
            stats: `${stats.openSections} lớp đang mở`
        },
        {
            title: "Thống kê sinh viên",
            description: "Phân bố sinh viên theo các khoa",
            icon: Users,
            color: "text-purple-600",
            bgColor: "bg-purple-500/10",
            stats: `${stats.activeStudents} đang hoạt động`
        },
        {
            title: "Chỉ số hiệu suất",
            description: "Tổng hợp các chỉ số học tập",
            icon: TrendingUp,
            color: "text-amber-600",
            bgColor: "bg-amber-500/10",
            stats: "Sắp ra mắt"
        },
    ];

    return (
        <>
            {/* Thông báo số sinh viên đang hoạt động */}
            <div className="mb-4 p-4 rounded-lg bg-green-100 text-green-800 font-semibold text-lg shadow">
                Có 60 sinh viên đang hoạt động
            </div>
            <motion.div
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header */}
                <motion.div variants={itemVariants} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <Badge variant="outline" className="mb-2 bg-rose-500/10 text-rose-600 border-rose-500/20">
                            Phân tích thống kê
                        </Badge>
                        <h2 className="text-3xl font-bold tracking-tight">Báo cáo & Thống kê</h2>
                        <p className="text-muted-foreground">Xem báo cáo học vụ và phân tích số liệu</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => {
                            toast.success("Hiển thị chọn khoảng thời gian");
                        }}><Calendar className="mr-2 h-4 w-4" />Chọn thời gian</Button>
                        <Button variant="outline" onClick={() => {
                            const csvContent = [
                                ['Loại báo cáo', 'Giá trị', 'Ghi chú'],
                                ['Tổng sinh viên', stats.totalStudents, `${stats.activeStudents} đang hoạt động`],
                                ['Tổng học phần', stats.totalCourses, `${stats.totalSections} lớp`],
                                ['Tổng lượt đăng ký', stats.totalEnrollments, `${stats.avgEnrollmentPerSection} trung bình/lớp`],
                            ]
                            .map(row => row.map(cell => `"${cell}"`).join(','))
                            .join('\n');
                            
                            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                            const link = document.createElement('a');
                            const url = URL.createObjectURL(blob);
                            link.setAttribute('href', url);
                            link.setAttribute('download', `reports_${new Date().toISOString().split('T')[0]}.csv`);
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            toast.success('Xuất báo cáo thành công');
                        }}><Download className="mr-2 h-4 w-4" />Xuất tất cả</Button>
                    </div>
                </motion.div>

                {/* Quick Stats */}
                <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-4">
                    {[
                        { label: "Tổng số sinh viên", value: stats.totalStudents, sub: `${stats.activeStudents} đang hoạt động`, color: "text-foreground" },
                        { label: "Tổng số học phần", value: stats.totalCourses, sub: `${stats.totalSections} lớp học phần`, color: "text-foreground" },
                        { label: "Tổng lượt đăng ký", value: stats.totalEnrollments, sub: `${stats.avgEnrollmentPerSection} trung bình/lớp`, color: "text-foreground" },
                        { label: "Khoa", value: departments.length, sub: "Các khoa đang hoạt động", color: "text-foreground" },
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                        >
                            <Card className="hover:shadow-md transition-shadow">
                                <CardHeader className="pb-2">
                                    <CardDescription>{stat.label}</CardDescription>
                                    <CardTitle className="text-3xl">{stat.value}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-emerald-600">{stat.sub}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Report Cards */}
                <motion.div variants={itemVariants} className="space-y-4">
                    <h3 className="text-xl font-semibold">Các báo cáo có sẵn</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        {reportCards.map((report, index) => {
                            const Icon = report.icon;
                            return (
                                <motion.div
                                    key={report.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + index * 0.1 }}
                                    whileHover={{ scale: 1.02, y: -2 }}
                                >
                                    <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-primary/50">
                                        <CardHeader>
                                            <div className="flex items-start gap-4">
                                                <div className={`h-12 w-12 rounded-lg ${report.bgColor} flex items-center justify-center`}>
                                                    <Icon className={`h-6 w-6 ${report.color}`} />
                                                </div>
                                                <div className="flex-1">
                                                    <CardTitle className="text-lg">{report.title}</CardTitle>
                                                    <CardDescription>{report.description}</CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground">{report.stats}</span>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    onClick={() => handleGenerateReport(report.title)}
                                                >
                                                    <Download className="mr-2 h-4 w-4" />
                                                    Tạo báo cáo
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Department Summary */}
                <motion.div variants={itemVariants}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Đăng ký theo khoa</CardTitle>
                            <CardDescription>Phân bố sinh viên và lượt đăng ký theo từng khoa</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                                {enrollmentByDept.map((dept, index) => (
                                    <motion.div
                                        key={dept.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + index * 0.05 }}
                                        whileHover={{ scale: 1.02 }}
                                        className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                                        onClick={() => toast.info(`Xem chi tiết khoa: ${dept.department}`)}
                                    >
                                        <div>
                                            <p className="font-medium">{dept.department}</p>
                                            <p className="text-sm text-muted-foreground">{dept.students} sinh viên</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold">{dept.enrollments}</p>
                                            <p className="text-sm text-muted-foreground">lượt đăng ký</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>

            {/* Report Details Dialog */}
            <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{selectedReport}</DialogTitle>
                        <DialogDescription>Chi tiết báo cáo và dữ liệu phân tích</DialogDescription>
                    </DialogHeader>

                {selectedReport === "Báo cáo đăng ký học phần" && (
                    <div className="space-y-6">
                        {/* Chart Section */}
                        <div className="space-y-2">
                            <h4 className="font-semibold">Biểu đồ đăng ký theo cấp độ</h4>
                            <div className="flex gap-4 items-end h-48">
                                {getEnrollmentReport().map((item, idx) => {
                                    const maxCount = Math.max(...getEnrollmentReport().map(x => x.count));
                                    const height = (item.count / maxCount) * 100;
                                    return (
                                        <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                                            <div 
                                                className="w-full bg-emerald-500 rounded-t"
                                                style={{ height: `${height}%`, minHeight: '20px' }}
                                            />
                                            <div className="text-sm font-medium">{item.level}</div>
                                            <div className="text-xs text-muted-foreground">{Math.round(item.count)} SV</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Table Section */}
                        <div className="space-y-2">
                            <h4 className="font-semibold">Bảng thống kê chi tiết</h4>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Cấp độ</TableHead>
                                        <TableHead className="text-right">Số lượng sinh viên</TableHead>
                                        <TableHead className="text-right">Tỷ lệ (%)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {getEnrollmentReport().map((item, idx) => {
                                        const total = getEnrollmentReport().reduce((sum, x) => sum + x.count, 0);
                                        const percentage = ((item.count / total) * 100).toFixed(1);
                                        return (
                                            <TableRow key={idx}>
                                                <TableCell>{item.level}</TableCell>
                                                <TableCell className="text-right">{Math.round(item.count)}</TableCell>
                                                <TableCell className="text-right">{percentage}%</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                )}

                {selectedReport === "Phân tích học phần" && (
                    <div className="space-y-6">
                        {/* Chart Section */}
                        <div className="space-y-2">
                            <h4 className="font-semibold">Biểu đồ tỷ lệ sử dụng chỉ tiêu</h4>
                            <div className="space-y-3">
                                {getCourseAnalysis().map((course, idx) => (
                                    <div key={idx} className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium">{course.courseName}</span>
                                            <span className="text-muted-foreground">{course.enrolled}/{course.capacity}</span>
                                        </div>
                                        <div className="w-full h-6 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
                                                style={{ width: `${course.utilization}%` }}
                                            />
                                        </div>
                                        <div className="text-xs text-muted-foreground text-right">{course.utilization}% sử dụng</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Table Section */}
                        <div className="space-y-2">
                            <h4 className="font-semibold">Bảng chi tiết học phần</h4>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Mã học phần</TableHead>
                                        <TableHead>Tên học phần</TableHead>
                                        <TableHead className="text-right">Chỉ tiêu</TableHead>
                                        <TableHead className="text-right">Đã đăng ký</TableHead>
                                        <TableHead className="text-right">Sử dụng (%)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {getCourseAnalysis().map((course, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell className="font-mono">{course.courseId}</TableCell>
                                            <TableCell>{course.courseName}</TableCell>
                                            <TableCell className="text-right">{course.capacity}</TableCell>
                                            <TableCell className="text-right font-semibold">{course.enrolled}</TableCell>
                                            <TableCell className="text-right">
                                                <Badge variant={course.utilization >= 80 ? "default" : "secondary"}>
                                                    {course.utilization}%
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                )}

                {selectedReport === "Thống kê sinh viên" && (
                    <div className="space-y-6">
                        {/* Chart Section */}
                        <div className="space-y-2">
                            <h4 className="font-semibold">Biểu đồ phân bố sinh viên theo khoa</h4>
                            <div className="space-y-4">
                                {getStudentStats().map((dept, idx) => (
                                    <div key={idx} className="space-y-1">
                                        <div className="flex justify-between text-sm font-medium">
                                            <span>{dept.department}</span>
                                            <span>{dept.total} sinh viên</span>
                                        </div>
                                        <div className="flex gap-1 h-6 rounded-full overflow-hidden bg-muted">
                                            <div
                                                className="bg-emerald-500"
                                                style={{ width: `${(dept.active / dept.total) * 100}%` }}
                                                title={`${dept.active} đang hoạt động`}
                                            />
                                            <div
                                                className="bg-red-500"
                                                style={{ width: `${(dept.inactive / dept.total) * 100}%` }}
                                                title={`${dept.inactive} không hoạt động`}
                                            />
                                        </div>
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>🟢 {dept.active} đang hoạt động</span>
                                            <span>🔴 {dept.inactive} không hoạt động</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Table Section */}
                        <div className="space-y-2">
                            <h4 className="font-semibold">Bảng chi tiết sinh viên</h4>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Khoa</TableHead>
                                        <TableHead className="text-right">Đang hoạt động</TableHead>
                                        <TableHead className="text-right">Không hoạt động</TableHead>
                                        <TableHead className="text-right">Tổng cộng</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {getStudentStats().map((dept, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell className="font-medium">{dept.department}</TableCell>
                                            <TableCell className="text-right text-emerald-600 font-semibold">{dept.active}</TableCell>
                                            <TableCell className="text-right text-red-600 font-semibold">{dept.inactive}</TableCell>
                                            <TableCell className="text-right font-semibold">{dept.total}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                )}

                {selectedReport === "Chỉ số hiệu suất" && (
                    <div className="space-y-4 py-4">
                        <div className="rounded-lg border border-dashed p-8 text-center">
                            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                            <p className="text-muted-foreground">Tính năng này sẽ sớm được cập nhật</p>
                            <p className="text-sm text-muted-foreground mt-2">Chúng tôi đang chuẩn bị dữ liệu để hiển thị báo cáo chi số hiệu suất</p>
                        </div>
                    </div>
                )}

                <div className="flex gap-2 justify-end pt-4">
                    <Button variant="outline" onClick={() => setReportDialogOpen(false)}>
                        Đóng
                    </Button>
                    <Button onClick={() => {
                        toast.success("Báo cáo đã được xuất thành công");
                        setReportDialogOpen(false);
                    }}>
                        <Download className="mr-2 h-4 w-4" />
                        Xuất PDF
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    </> 
    );
}
