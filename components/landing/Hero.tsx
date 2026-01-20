"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
    return (
        <section className="relative overflow-hidden bg-linear-to-b from-background to-muted/20 w-full items-center">
            {/* Academic Pattern Overlay */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />

            <div className="container relative px-4 py-20 md:py-32 lg:py-40 mx-auto">
                <div className="mx-auto max-w-4xl text-center space-y-8">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex justify-center"
                    >
                        <Badge variant="outline" className="px-4 py-1.5 text-sm border-primary/20 bg-primary/5">
                            <Sparkles className="mr-2 h-3.5 w-3.5" />
                            Xếp hạng #1 về Chất lượng Giáo dục
                        </Badge>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
                    >
                        Xuất sắc trong{" "}
                        <span className="text-primary">Giáo dục</span>
                        <br />
                        Bắt đầu từ đây
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl md:text-2xl"
                    >
                        Tham gia cộng đồng học giả, nhà đổi mới và lãnh đạo đang định hình tương lai thông qua giáo dục và nghiên cứu đẳng cấp thế giới.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
                    >
                        <Button asChild size="lg" className="w-full sm:w-auto group">
                            <Link href="/register">
                                Đăng ký ngay
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                            <Link href="#programs">Khám phá chương trình</Link>
                        </Button>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 pt-12 md:pt-16"
                    >
                        {[
                            { value: "15,000+", label: "Sinh viên" },
                            { value: "1,200+", label: "Giảng viên" },
                            { value: "150+", label: "Chương trình" },
                            { value: "95%", label: "Tỷ lệ việc làm" },
                        ].map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                                className="space-y-2"
                            >
                                <div className="text-3xl md:text-4xl font-bold text-primary">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-muted-foreground">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Bottom Wave */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-background to-transparent" />
        </section>
    );
}
