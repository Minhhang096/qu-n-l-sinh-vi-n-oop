"use client";

import Link from "next/link";
import { GraduationCap, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
    const footerLinks = {
        academics: [
            { title: "Đại học", href: "#" },
            { title: "Sau đại học", href: "#" },
            { title: "Chương trình trực tuyến", href: "#" },
        ],
        admissions: [
            { title: "Đăng ký", href: "/register" },
            { title: "Tham quan trường", href: "#" },
            { title: "Hỗ trợ tài chính", href: "#" },
            { title: "Học phí", href: "#" },
        ],
        campus: [
            { title: "Đời sống sinh viên", href: "#" },
            { title: "Ký túc xá", href: "#" },
            { title: "Căn tin", href: "#" },
            { title: "Thể thao", href: "#" },
        ],
        about: [
            { title: "Sứ mệnh", href: "#" },
            { title: "Lãnh đạo", href: "#" },
            { title: "Tin tức & Sự kiện", href: "#" },
            { title: "Tuyển dụng", href: "#" },
        ],
    };

    const socialLinks = [
        { icon: Facebook, href: "#", label: "Facebook" },
        { icon: Twitter, href: "#", label: "Twitter" },
        { icon: Linkedin, href: "#", label: "LinkedIn" },
        { icon: Instagram, href: "#", label: "Instagram" },
    ];

    return (
        <footer className="bg-muted/30 border-t">
            <div className="container px-4 py-12 md:py-16 mx-auto">
                {/* Top Section */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-6 mb-12">
                    {/* Brand Column */}
                    <div className="lg:col-span-2 space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                                <GraduationCap className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <span className="text-lg font-bold">Đại học Apex</span>
                        </Link>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            Xuất sắc trong giáo dục từ năm 1850. Đào tạo lãnh đạo và nhà đổi mới hơn một thế kỷ.
                        </p>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>123 Đường Đại học, Quận 1, TP.HCM</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Phone className="h-4 w-4" />
                                <span>(028) 1234-5678</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="h-4 w-4" />
                                <span>info@apexuniversity.edu.vn</span>
                            </div>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h3 className="font-semibold mb-4">Học thuật</h3>
                        <ul className="space-y-2">
                            {footerLinks.academics.map((link) => (
                                <li key={link.title}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {link.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Tuyển sinh</h3>
                        <ul className="space-y-2">
                            {footerLinks.admissions.map((link) => (
                                <li key={link.title}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {link.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Đời sống</h3>
                        <ul className="space-y-2">
                            {footerLinks.campus.map((link) => (
                                <li key={link.title}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {link.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Giới thiệu</h3>
                        <ul className="space-y-2">
                            {footerLinks.about.map((link) => (
                                <li key={link.title}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {link.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <Separator className="my-8" />

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Đại học Apex. Bản quyền được bảo hộ.
                    </p>

                    {/* Social Links */}
                    <div className="flex items-center gap-2">
                        {socialLinks.map((social) => {
                            const Icon = social.icon;
                            return (
                                <Link
                                    key={social.label}
                                    href={social.href}
                                    className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted transition-colors"
                                    aria-label={social.label}
                                >
                                    <Icon className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                                </Link>
                            );
                        })}
                    </div>

                    {/* Legal Links */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <Link href="#" className="hover:text-foreground transition-colors">
                            Chính sách Bảo mật
                        </Link>
                        <Link href="#" className="hover:text-foreground transition-colors">
                            Điều khoản Dịch vụ
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
