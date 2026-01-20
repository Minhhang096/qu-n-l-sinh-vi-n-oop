"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Construction } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminPlaceholderPage() {
    const pathname = usePathname();
    const pageTitle = pathname.split("/").pop()?.replace(/-/g, " ").replace(/^\w/, c => c.toUpperCase()) || "Page";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6"
        >
            <div className="p-6 rounded-full bg-accent/50 dark:bg-accent/20">
                <Construction className="w-16 h-16 text-muted-foreground/50" />
            </div>

            <div className="space-y-2 max-w-md">
                <h1 className="text-3xl font-bold tracking-tight capitalize">{pageTitle}</h1>
                <p className="text-muted-foreground">
                    This administrative module is currently under development.
                    Please check back later for updates.
                </p>
                <div className="text-xs font-mono bg-muted p-2 rounded mt-4">
                    Route: {pathname}
                </div>
            </div>

            <Button variant="outline" onClick={() => window.history.back()}>
                Go Back
            </Button>
        </motion.div>
    );
}
