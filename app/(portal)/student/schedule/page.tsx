"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function StudentSchedulePage() {
    const [currentWeek, setCurrentWeek] = useState(0);

    const handlePreviousWeek = () => {
        setCurrentWeek(currentWeek - 1);
        toast.success("Hiện thị tuần trước");
    };

    const handleNextWeek = () => {
        setCurrentWeek(currentWeek + 1);
        toast.success("Hiện thị tuần sau");
    };
    const timeSlots = [
        "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
        "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"
    ];

    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];

    const classes = [
        {
            id: "CS101",
            title: "Intro to Computer Science",
            day: "Mon",
            startTime: "10:00 AM",
            duration: 2, // hours (visual height)
            location: "Science Bldg 101",
            color: "bg-blue-100 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300",
            startIndex: 2 // 08:00 is 0, 09:00 is 1, 10:00 is 2
        },
        {
            id: "CS101",
            title: "Intro to Computer Science",
            day: "Wed",
            startTime: "10:00 AM",
            duration: 2,
            location: "Science Bldg 101",
            color: "bg-blue-100 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300",
            startIndex: 2
        },
        {
            id: "MATH201",
            title: "Calculus II",
            day: "Tue",
            startTime: "02:00 PM",
            duration: 1.5,
            location: "Math Hall 204",
            color: "bg-purple-100 border-purple-200 text-purple-700 dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-300",
            startIndex: 6
        },
        {
            id: "MATH201",
            title: "Calculus II",
            day: "Thu",
            startTime: "02:00 PM",
            duration: 1.5,
            location: "Math Hall 204",
            color: "bg-purple-100 border-purple-200 text-purple-700 dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-300",
            startIndex: 6
        },
        {
            id: "ENG102",
            title: "Adv. Composition",
            day: "Fri",
            startTime: "09:00 AM",
            duration: 1.5,
            location: "Humanities 305",
            color: "bg-amber-100 border-amber-200 text-amber-700 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-300",
            startIndex: 1
        },
        {
            id: "PHYS150",
            title: "Physics",
            day: "Mon",
            startTime: "01:00 PM",
            duration: 1.5,
            location: "Science Bldg 105",
            color: "bg-red-100 border-red-200 text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300",
            startIndex: 5
        },
        {
            id: "PHYS150",
            title: "Physics",
            day: "Wed",
            startTime: "01:00 PM",
            duration: 1.5,
            location: "Science Bldg 105",
            color: "bg-red-100 border-red-200 text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300",
            startIndex: 5
        },
        {
            id: "HIST110",
            title: "World History",
            day: "Tue",
            startTime: "11:00 AM",
            duration: 1.5,
            location: "Arts Center 201",
            color: "bg-emerald-100 border-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-300",
            startIndex: 3
        },
        {
            id: "ART105",
            title: "Art Appreciation",
            day: "Thu",
            startTime: "04:00 PM",
            duration: 2,
            location: "Arts Center 102",
            color: "bg-pink-100 border-pink-200 text-pink-700 dark:bg-pink-900/30 dark:border-pink-800 dark:text-pink-300",
            startIndex: 8
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Schedule</h2>
                    <p className="text-muted-foreground">
                        Weekly class schedule for Fall 2025
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={handlePreviousWeek}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-2 px-4 py-2 border rounded-md bg-muted/30">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Oct 14 - Oct 18, 2025</span>
                    </div>
                    <Button variant="outline" size="icon" onClick={handleNextWeek}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
                {/* Main Calendar Grid */}
                <Card className="overflow-hidden">
                    <CardHeader className="py-4 border-b">
                        <div className="grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr] text-sm font-medium text-center text-muted-foreground">
                            <div></div> {/* Time col */}
                            {weekDays.map(day => (
                                <div key={day} className="py-2">{day}</div>
                            ))}
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 relative h-[800px] overflow-y-auto">
                        <div className="grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr] h-full min-w-[600px]">
                            {/* Time Column */}
                            <div className="border-r bg-muted/10">
                                {timeSlots.map((time, i) => (
                                    <div key={time} className="h-20 border-b text-xs text-muted-foreground p-2 text-right">
                                        {time}
                                    </div>
                                ))}
                            </div>

                            {/* Days Columns */}
                            {weekDays.map((day) => (
                                <div key={day} className="relative border-r last:border-r-0">
                                    {/* Grid Lines */}
                                    {timeSlots.map((time) => (
                                        <div key={`${day}-${time}`} className="h-20 border-b border-dashed border-muted/50" />
                                    ))}

                                    {/* Classes */}
                                    {classes
                                        .filter(c => c.day === day)
                                        .map((c, i) => (
                                            <motion.div
                                                key={`${c.id}-${day}`}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: i * 0.1 }}
                                                className={`absolute left-1 right-1 rounded-md p-2 border text-xs overflow-hidden hover:brightness-95 transition-all cursor-pointer ${c.color}`}
                                                style={{
                                                    top: `${c.startIndex * 80 + 2}px`, // 80px per hour row
                                                    height: `${c.duration * 80 - 4}px`
                                                }}
                                            >
                                                <div className="font-bold truncate">{c.id}</div>
                                                <div className="font-medium truncate line-clamp-1">{c.title}</div>
                                                <div className="mt-1 flex items-center gap-1 opacity-80">
                                                    <MapPin className="h-3 w-3" />
                                                    <span className="truncate">{c.location}</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Upcoming Events</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { title: "Guest Lecture: AI Ethics", date: "Oct 16, 2:00 PM", loc: "Main Auditorium" },
                                { title: "Career Fair", date: "Oct 20, 10:00 AM", loc: "Student Center" },
                                { title: "Midterm Exams Begin", date: "Oct 25, All Day", loc: "Campus Wide" }
                            ].map((event, i) => (
                                <div key={i} className="flex gap-3 items-start pb-4 border-b last:border-0 last:pb-0">
                                    <div className="bg-primary/10 text-primary p-2 rounded-md">
                                        <CalendarIcon className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-sm">{event.title}</div>
                                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                            <Clock className="h-3 w-3" /> {event.date}
                                        </div>
                                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                            <MapPin className="h-3 w-3" /> {event.loc}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="bg-primary text-primary-foreground">
                        <CardContent className="p-6">
                            <h3 className="font-bold text-lg mb-2">Need to reschedule?</h3>
                            <p className="text-sm opacity-90 mb-4">
                                Contact your academic advisor to discuss course changes.
                            </p>
                            <Button variant="secondary" className="w-full text-primary" onClick={() => {
                                toast.success("Liên hệ giảng viên hướng dẫn");
                            }}>
                                Contact Advisor
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
