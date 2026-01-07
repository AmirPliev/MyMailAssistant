"use client";

import * as React from "react";
import { useDashboard } from "./useDashboard";
import Button from "@/components/ui/button";

export default function Dashboard() {
    const { user, handleLogout } = useDashboard();

    if (!user) {
        return <div className="flex h-screen items-center justify-center font-medium">Checking session...</div>;
    }

    return (
        <div className="p-8">
            <div className="max-w-4xl mx-auto">
                <header className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                        <p className="text-muted-foreground mt-1 text-lg">Welcome back, {user.email}</p>
                    </div>
                    <Button variant="outline" onClick={handleLogout}>
                        Logout
                    </Button>
                </header>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="bg-card border rounded-xl p-6 shadow-sm">
                        <h3 className="font-semibold text-lg mb-2 text-foreground">Authenticated View</h3>
                        <p className="text-sm text-muted-foreground">
                            You are seeing this because you are successfully logged in.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
