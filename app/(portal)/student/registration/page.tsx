"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Plus, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { enrollmentsApi, EnrollmentDto, sectionsApi, SectionDto, CourseDto } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";

type CourseWithSections = CourseDto & {
    sections?: SectionDto[];
};

export default function CourseRegistrationPage() {
    const { user, isLoading: authLoading } = useAuth();
    const studentId = user?.student?.studentId;
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDept, setSelectedDept] = useState("all");
    const [availableCourses, setAvailableCourses] = useState<CourseWithSections[]>([]);
    const [enrolledCourses, setEnrolledCourses] = useState<number[]>([]);
    const [currentCredits, setCurrentCredits] = useState(0);
    const maxCredits = 22;
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchData() {
            if (authLoading || !studentId) {
                console.log("Waiting for auth to load or studentId missing", { authLoading, studentId });
                return;
            }
            setLoading(true);
            try {
                // Lấy danh sách học phần từ backend
                const resCourses = await fetch(`/api/courses/available?studentId=${studentId}`);
                if (!resCourses.ok) {
                    console.error("Failed to fetch courses:", resCourses.status);
                    toast.error("Lỗi khi tải danh sách học phần");
                    setLoading(false);
                    return;
                }
                
                const dataCourses = await resCourses.json();
                console.log("Raw courses response:", dataCourses);
                
                // Backend trả về {success, data: [...]}
                const courses: CourseWithSections[] = dataCourses.data || dataCourses || [];
                console.log("Parsed courses:", courses);
                
                if (!Array.isArray(courses) || courses.length === 0) {
                    console.warn("No courses found or invalid format");
                    setAvailableCourses([]);
                    setLoading(false);
                    return;
                }
                
                // Lấy sections cho từng course
                const sectionsData = await Promise.all(
                    courses.map(async (course) => {
                        try {
                            const resSections = await sectionsApi.getAll({ courseId: course.courseId });
                            return { 
                                courseId: course.courseId, 
                                sections: resSections.success ? resSections.data : [] 
                            };
                        } catch (err) {
                            console.error(`Error fetching sections for ${course.courseId}:`, err);
                            return { 
                                courseId: course.courseId, 
                                sections: [] 
                            };
                        }
                    })
                );
                
                const coursesWithSections = courses.map(course => {
                    const sectionData = sectionsData.find(s => s.courseId === course.courseId);
                    return { ...course, sections: sectionData?.sections || [] };
                });
                console.log("Courses with sections:", coursesWithSections);
                setAvailableCourses(coursesWithSections);

                // Lấy danh sách học phần đã đăng ký
                const resEnroll = await enrollmentsApi.getAll({ studentId });
                console.log("Enrollments response:", resEnroll);
                if (resEnroll.success && resEnroll.data) {
                    const enrolledSectionIds = resEnroll.data.map((e: EnrollmentDto) => e.sectionId);
                    setEnrolledCourses(enrolledSectionIds);
                    console.log("Enrolled section IDs:", enrolledSectionIds);
                    
                    // Tính tổng tín chỉ bằng cách tìm courses của các sections đã đăng ký
                    const totalCredits = resEnroll.data.reduce((sum, enrollment) => {
                        // Tìm course dựa trên section
                        const course = coursesWithSections.find(c => 
                            c.sections?.some(s => s.sectionId === enrollment.sectionId)
                        );
                        const credits = course?.credits || 0;
                        console.log(`Enrollment ${enrollment.enrollmentId}: section ${enrollment.sectionId} -> course ${course?.courseId} (${credits} credits)`);
                        return sum + credits;
                    }, 0);
                    console.log("Total credits calculated:", totalCredits);
                    setCurrentCredits(totalCredits);
                }
            } catch (error) {
                console.error("Error in fetchData:", error);
                toast.error("Không thể tải dữ liệu học phần");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [studentId, authLoading]);

    const handleRegister = async (courseId: string, courseName: string, section?: SectionDto) => {
        if (!studentId) {
            toast.error("Không xác định được sinh viên");
            return;
        }
        if (!section) {
            toast.error("Không xác định được lớp học phần");
            return;
        }
        
        const course = availableCourses.find(c => c.courseId === courseId);
        const credits = course?.credits || 0;
        
        if (currentCredits + credits > maxCredits) {
            toast.error("Vượt quá giới hạn tín chỉ!");
            return;
        }
        
        setLoading(true);
        try {
            // Gọi API đăng ký học phần
            const res = await enrollmentsApi.create({ studentId, sectionId: section.sectionId });
            if (res.success) {
                setEnrolledCourses((prev) => [...prev, section.sectionId]);
                setCurrentCredits((prev) => prev + credits);
                toast.success(`Đăng ký thành công: ${courseName}`);
            } else {
                toast.error(res.message || "Đăng ký thất bại");
            }
        } catch {
            toast.error("Lỗi khi đăng ký học phần");
        } finally {
            setLoading(false);
        }
    };

    // Hủy học phần
    const handleDrop = async (sectionId?: number) => {
        if (!studentId || typeof sectionId !== "number") {
            toast.error("Thiếu thông tin để hủy học phần");
            return;
        }
        setLoading(true);
        try {
            console.log("handleDrop called with sectionId:", sectionId);
            
            // Tìm enrollmentId từ enrollmentsApi.getAll
            const resEnroll = await enrollmentsApi.getAll({ studentId });
            console.log("Fetch enrollments result:", resEnroll);
            
            if (resEnroll.success && resEnroll.data) {
                const enrollment = resEnroll.data.find((e: EnrollmentDto) => e.sectionId === sectionId);
                console.log("Found enrollment:", enrollment);
                
                if (!enrollment) {
                    toast.error("Không tìm thấy đăng ký học phần");
                    setLoading(false);
                    return;
                }
                
                // Gọi API cập nhật trạng thái hủy
                console.log("Calling updateStatus with enrollmentId:", enrollment.enrollmentId, "status: Cancelled");
                const res = await enrollmentsApi.updateStatus(enrollment.enrollmentId, "Cancelled");
                console.log("UpdateStatus result:", res);
                
                if (res.success) {
                    setEnrolledCourses((prev) => prev.filter((id) => id !== sectionId));
                    // Tính lại tín chỉ
                    const course = availableCourses.find(c => 
                        c.sections?.some(s => s.sectionId === sectionId)
                    );
                    setCurrentCredits((prev) => Math.max(0, prev - (course?.credits || 0)));
                    toast.success("Đã hủy học phần thành công");
                } else {
                    toast.error(res.message || "Hủy học phần thất bại");
                }
            }
        } catch {
            toast.error("Lỗi khi hủy học phần");
        } finally {
            setLoading(false);
        }
    };

    const filteredCourses = availableCourses.filter(course => {
        const matchesSearch = !searchTerm || 
            course.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.courseId?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = selectedDept === "all" || course.deptName === selectedDept;
        return matchesSearch && matchesDept;
    });

    console.log("filteredCourses:", { 
        total: availableCourses.length, 
        filtered: filteredCourses.length, 
        searchTerm, 
        selectedDept 
    });

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Đăng ký học phần</h2>
                    <p className="text-muted-foreground">
                        Tìm kiếm và đăng ký học phần cho học kỳ Spring 2026
                    </p>
                </div>

                {/* Credit Limit Widget */}
                <Card className="w-full md:w-64 bg-secondary/50 border-none shadow-none">
                    <CardContent className="p-4 py-3">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium">Tải tín chỉ</span>
                            <span className={currentCredits > 18 ? "text-amber-600 font-bold" : ""}>
                                {currentCredits} / {maxCredits}
                            </span>
                        </div>
                        <Progress value={(currentCredits / maxCredits) * 100} className="h-2" />
                    </CardContent>
                </Card>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm theo tên môn hoặc mã môn..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={selectedDept} onValueChange={setSelectedDept}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Khoa" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả khoa</SelectItem>
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                        <SelectItem value="English Literature">English Literature</SelectItem>
                        <SelectItem value="Biology">Biology</SelectItem>
                        <SelectItem value="Physics">Physics</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Course List */}
            {loading ? (
                <div className="text-center py-12 text-muted-foreground">
                    Đang tải dữ liệu...
                </div>
            ) : availableCourses.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    Không có học phần nào. Vui lòng thử lại sau.
                </div>
            ) : (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid gap-4"
                >
                    {filteredCourses && filteredCourses.length > 0 ? (
                        filteredCourses.map((course) => {
                            const courseSection = course.sections?.[0];
                            const isEnrolled = courseSection ? enrolledCourses.includes(courseSection.sectionId) : false;
                            const isFull = courseSection ? courseSection.enrolledCount >= courseSection.capacity : false;
                            const availableSeats = courseSection ? courseSection.capacity - courseSection.enrolledCount : 0;
                            const hasSection = !!courseSection;
                            
                            return (
                                <motion.div key={course.courseId} variants={item}>
                                    <Card className="overflow-hidden hover:shadow-md transition-shadow">
                                        <CardContent className="p-0">
                                            <div className="flex flex-col md:flex-row">
                                                {/* Status Strip */}
                                                <div
                                                    className={`w-full md:w-2 h-2 md:h-auto ${isEnrolled ? "bg-emerald-500" :
                                                        isFull ? "bg-red-500" : "bg-blue-500"
                                                        }`}
                                                />

                                                <div className="flex-1 p-6 flex flex-col md:flex-row justify-between gap-4">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="outline" className="font-mono text-xs">
                                                                {course.courseId}
                                                            </Badge>
                                                            <Badge variant="secondary" className="text-xs">
                                                                {course.deptName}
                                                            </Badge>
                                                        </div>
                                                        <h3 className="text-xl font-semibold">{course.courseName}</h3>
                                                        {course.description && (
                                                            <p className="text-sm text-muted-foreground">{course.description}</p>
                                                        )}
                                                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
                                                            {courseSection?.teacherName && (
                                                                <span className="flex items-center">
                                                                    <Info className="w-3 h-3 mr-1" />
                                                                    {courseSection.teacherName}
                                                                </span>
                                                            )}
                                                            {courseSection?.schedule && (
                                                                <span className="flex items-center">
                                                                    <AlertCircle className="w-3 h-3 mr-1" />
                                                                    {courseSection.schedule}
                                                                </span>
                                                            )}
                                                            <span className="font-medium text-foreground">
                                                                {course.credits} tín chỉ
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col items-end gap-3 min-w-[140px]">
                                                        {isEnrolled ? (
                                                            <Button
                                                                variant="destructive"
                                                                onClick={() => handleDrop(courseSection?.sectionId)}
                                                                disabled={loading}
                                                                className="w-full border-red-500 text-red-600 bg-red-50 dark:bg-red-900/10"
                                                            >
                                                                Hủy đăng ký
                                                            </Button>
                                                        ) : isFull ? (
                                                            <Button variant="ghost" disabled className="w-full text-red-500">
                                                                Hết chỗ
                                                            </Button>
                                                        ) : hasSection ? (
                                                            <div className="flex flex-col gap-2 w-full">
                                                                <div className="text-xs text-right text-muted-foreground">
                                                                    Còn {availableSeats} chỗ
                                                                </div>
                                                                <Button onClick={() => handleRegister(course.courseId, course.courseName, courseSection)} disabled={loading}>
                                                                    <Plus className="mr-2 h-4 w-4" />
                                                                    Đăng ký
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <Button variant="outline" disabled className="w-full text-amber-600">
                                                                Chưa có lớp
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            Không tìm thấy học phần phù hợp với tiêu chí của bạn.
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
}
