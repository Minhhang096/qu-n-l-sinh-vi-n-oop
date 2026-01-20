"use client";

import { motion } from "framer-motion";
import { BookOpen, Users, FlaskConical, Building2, Lightbulb, Globe } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const programs = [
    {
        icon: BookOpen,
        title: "Khoa học Xã hội & Nhân văn",
        description: "Khám phá nhân văn, khoa học xã hội và khoa học tự nhiên với giảng viên uy tín.",
        courses: "45+ Ngành",
    },
    {
        icon: FlaskConical,
        title: "Kỹ thuật & Công nghệ",
        description: "Chương trình tiên tiến về kỹ thuật, khoa học máy tính và khoa học ứng dụng.",
        courses: "30+ Chuyên ngành",
    },
    {
        icon: Building2,
        title: "Kinh doanh & Kinh tế",
        description: "Chuẩn bị cho vai trò lãnh đạo với các chương trình kinh doanh và kinh tế nổi tiếng.",
        courses: "20+ Chuyên ngành",
    },
    {
        icon: Users,
        title: "Y khoa & Sức khỏe",
        description: "Giáo dục và nghiên cứu y tế đẳng cấp thế giới về chăm sóc sức khỏe và khoa học sự sống.",
        courses: "15+ Chương trình",
    },
    {
        icon: Lightbulb,
        title: "Đổi mới & Thiết kế",
        description: "Nuôi dưỡng sáng tạo và khởi nghiệp thông qua các chương trình liên ngành.",
        courses: "25+ Chương trình",
    },
    {
        icon: Globe,
        title: "Nghiên cứu Quốc tế",
        description: "Tham gia vào quan hệ quốc tế, ngôn ngữ và nghiên cứu đa văn hóa.",
        courses: "35+ Chương trình",
    },
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 }
};

export function Programs() {
    return (
        <section id="programs" className="py-16 md:py-24 bg-background">
            <div className="container px-4 md:px-6 lg:px-8 mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center space-y-4 mb-12 md:mb-16"
                >
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                        Chương trình Học thuật Đẳng cấp
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                        Lựa chọn từ hơn 150 chương trình đại học và sau đại học được thiết kế để chuẩn bị cho bạn thành công.
                    </p>
                </motion.div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {programs.map((program) => {
                        const Icon = program.icon;
                        return (
                            <motion.div key={program.title} variants={item}>
                                <Card className="h-full group hover:shadow-xl hover:border-primary/50 hover:scale-105 transition-all duration-300">
                                    <CardHeader>
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                                            <Icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <CardTitle className="text-xl">{program.title}</CardTitle>
                                        <CardDescription className="text-xs text-primary font-medium">
                                            {program.courses}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {program.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
