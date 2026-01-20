"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  BookOpen,
  ClipboardList,
  CheckCircle,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useAuth, getUserDisplayName } from "@/lib/auth-context";
import { sectionsApi, SectionDto } from "@/lib/api-client";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const sectionStatusLabels: Record<string, string> = {
  Open: "Đang mở",
  Closed: "Đã đóng",
  Canceled: "Đã hủy",
};

export default function TeacherDashboard() {
  const { user } = useAuth();
  const displayName = user ? getUserDisplayName(user) : "Giảng viên";
  const teacherId = user?.teacher?.teacherId;

  const [sections, setSections] = useState<SectionDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!teacherId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await sectionsApi.getAll({ teacherId });
        if (response.success && response.data) {
          setSections(response.data);
        } else {
          setSections([]);
        }
      } catch (error) {
        console.error("Không thể tải danh sách lớp học phần", error);
        setSections([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [teacherId]);

  const totalStudents = sections.reduce(
    (sum, s) => sum + (s.enrolledCount || 0),
    0
  );

  const stats = [
    {
      title: "Lớp giảng dạy",
      value: sections.length.toString(),
      icon: BookOpen,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Tổng sinh viên",
      value: totalStudents.toString(),
      icon: Users,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Lớp đang mở",
      value: sections.filter((s) => s.status === "Open").length.toString(),
      icon: ClipboardList,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      title: "Đã khóa điểm",
      value: sections.filter((s) => s.isGradeLocked).length.toString(),
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Không có teacherId (chưa map user->teacher hoặc login sai role)
  if (!teacherId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-muted-foreground">
          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Không tìm thấy thông tin giảng viên.</p>
          <p className="text-sm mt-1">
            Vui lòng đăng nhập đúng tài khoản giảng viên hoặc kiểm tra dữ liệu.
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={container}
      className="space-y-8"
    >
      <motion.div variants={item} className="space-y-2">
        <Badge
          variant="outline"
          className="bg-primary/10 text-primary border-primary/20"
        >
          Cổng Giảng viên
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Chào mừng, <span className="text-primary">{displayName}</span>
        </h1>
        <p className="text-muted-foreground mt-2 text-base md:text-lg">
          Quản lý lớp học và tiến độ của sinh viên.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.title} variants={item}>
              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] relative overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <div
                    className={`h-10 w-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}
                  >
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold ${stat.color}`}>
                    {stat.value}
                  </div>
                </CardContent>
                <div className={`absolute inset-x-0 bottom-0 h-1 ${stat.bgColor}`} />
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* My Sections */}
      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Lớp giảng dạy</CardTitle>
              <CardDescription>Các lớp học phần được phân công</CardDescription>
            </div>
            <Link href="/teacher/classes">
              <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                Xem tất cả <ArrowRight className="ml-1 h-3 w-3" />
              </Badge>
            </Link>
          </CardHeader>

          <CardContent>
            {sections.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Chưa có lớp được phân công</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sections.slice(0, 5).map((section) => {
                  const statusText =
                    sectionStatusLabels[section.status] ?? section.status;

                  return (
                    <Link
                      key={section.sectionId}
                      href={`/teacher/classes/${section.sectionId}`}
                    >
                      <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{section.courseName}</p>
                            <p className="text-sm text-muted-foreground">
                              {section.semester} • {section.schedule}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-medium">
                              {section.enrolledCount}/{section.capacity}
                            </p>
                            <p className="text-xs text-muted-foreground">Sinh viên</p>
                          </div>

                          <Badge
                            variant="outline"
                            className={
                              section.status === "Open"
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                : section.status === "Closed"
                                ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                : "bg-red-500/10 text-red-600 border-red-500/20"
                            }
                          >
                            {statusText}
                          </Badge>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>Thao tác nhanh</CardTitle>
            <CardDescription>Quản lý lớp học và chấm điểm</CardDescription>
          </CardHeader>

          <CardContent className="text-muted-foreground">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Link href="/teacher/classes">
                <div className="p-4 border rounded-lg hover:bg-accent hover:border-primary/50 transition-all cursor-pointer">
                  <h3 className="font-medium mb-2">Quản lý lớp học</h3>
                  <p className="text-sm text-muted-foreground">
                    Xem và quản lý các lớp học phần
                  </p>
                </div>
              </Link>

              {/* Đổi route này theo màn hình chấm điểm của bạn */}
              <Link href="/teacher/grades">
                <div className="p-4 border rounded-lg hover:bg-accent hover:border-primary/50 transition-all cursor-pointer">
                  <h3 className="font-medium mb-2">Chấm điểm</h3>
                  <p className="text-sm text-muted-foreground">
                    Xem và nhập/sửa điểm cho sinh viên
                  </p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
