"use client";

import { motion } from "framer-motion";
import { Microscope, FileText, FlaskConical, Users, Plus, Star, Link as LinkIcon, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

export default function TeacherResearchPage() {
    const projects = [
        {
            title: "AI in Personalized Learning",
            role: "Principal Investigator",
            status: "Active",
            funding: "$150,000",
            agency: "NSF",
            collaborators: 4,
            progress: 65,
            description: "Developing adaptive learning algorithms for undergraduate CS education."
        },
        {
            title: "Quantum Computing Algorithms",
            role: "Co-Investigator",
            status: "Review",
            funding: "Pending",
            agency: "DOE",
            collaborators: 2,
            progress: 100,
            description: "Optimization of error correction codes for qubit stability."
        },
        {
            title: "Sustainable Data Centers",
            role: "Supervisor",
            status: "Planning",
            funding: "$50,000",
            agency: "Internal",
            collaborators: 3,
            progress: 15,
            description: "Energy efficiency analysis of university server infrastructure."
        }
    ];

    const publications = [
        {
            title: "Neural Networks for Pattern Recognition in chaotic systems",
            journal: "Journal of Artificial Intelligence",
            year: 2025,
            citations: 12,
            type: "Journal Article"
        },
        {
            title: "Ethics in Modern Software Engineering",
            journal: "IEEE Software",
            year: 2024,
            citations: 45,
            type: "Conference Paper"
        },
        {
            title: "The Future of Cloud Computing",
            journal: "Tech Press",
            year: 2024,
            citations: 8,
            type: "Book Chapter"
        }
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
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Research Lab</h2>
                    <p className="text-muted-foreground">
                        Manage funded projects, publications, and student research groups
                    </p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Project
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Grants</CardTitle>
                        <FlaskConical className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$450,000</div>
                        <p className="text-xs text-muted-foreground">
                            +12% from last fiscal year
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Publications</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">34</div>
                        <p className="text-xs text-muted-foreground">
                            +3 pending review
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Citations</CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,245</div>
                        <p className="text-xs text-muted-foreground">
                            h-index: 18
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Research Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">8</div>
                        <p className="text-xs text-muted-foreground">
                            2 PhD, 6 Masters
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="projects" className="w-full">
                <TabsList>
                    <TabsTrigger value="projects">Active Projects</TabsTrigger>
                    <TabsTrigger value="publications">Publications</TabsTrigger>
                    <TabsTrigger value="grants">Grant Applications</TabsTrigger>
                </TabsList>
                <TabsContent value="projects" className="space-y-4 pt-4">
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                    >
                        {projects.map((project) => (
                            <motion.div key={project.title} variants={item}>
                                <Card className="h-full flex flex-col">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <Badge variant={project.status === "Active" ? "default" : "secondary"}>
                                                {project.status}
                                            </Badge>
                                            <Button variant="ghost" size="icon">
                                                <LinkIcon className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <CardTitle className="text-lg mt-2">{project.title}</CardTitle>
                                        <CardDescription>{project.role}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-1 space-y-4">
                                        <p className="text-sm text-muted-foreground">
                                            {project.description}
                                        </p>
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-xs">
                                                <span>Progress</span>
                                                <span>{project.progress}%</span>
                                            </div>
                                            <Progress value={project.progress} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div>
                                                <span className="text-muted-foreground block text-xs">Funding</span>
                                                <span className="font-medium">{project.funding}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground block text-xs">Agency</span>
                                                <span className="font-medium">{project.agency}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="border-t pt-4">
                                        <div className="flex -space-x-2">
                                            {[...Array(project.collaborators)].map((_, i) => (
                                                <div key={i} className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium">
                                                    {String.fromCharCode(65 + i)}
                                                </div>
                                            ))}
                                        </div>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </TabsContent>
                <TabsContent value="publications" className="space-y-4 pt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Publications</CardTitle>
                            <CardDescription>
                                Published works and conference proceedings
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {publications.map((pub, i) => (
                                    <div key={i} className="flex items-start justify-between border-b last:border-0 pb-4 last:pb-0">
                                        <div className="space-y-1">
                                            <h3 className="font-semibold">{pub.title}</h3>
                                            <div className="text-sm text-muted-foreground">
                                                {pub.journal} • {pub.year} • <span className="text-primary font-medium">{pub.type}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-sm text-right">
                                                <span className="font-bold">{pub.citations}</span>
                                                <span className="text-muted-foreground block text-xs">Citations</span>
                                            </div>
                                            <Button variant="outline" size="icon">
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
