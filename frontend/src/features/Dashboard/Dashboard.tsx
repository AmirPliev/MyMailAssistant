"use client";

import * as React from "react";
import { useDashboard } from "./useDashboard";
import Sidebar from "@/components/Sidebar/Sidebar";
import InboxCard from "./components/InboxCard";
import StatCard from "./components/StatCard";
import ComposeCard from "./components/ComposeCard";
import { Activity, Database, Zap } from "lucide-react";

export default function Dashboard() {
    const { user, handleLogout, mockData, loading, error, loadMore, hasMore, loadingMore } = useDashboard();

    if (!user) {
        return <div className="flex h-screen items-center justify-center font-medium bg-background text-foreground">Checking session...</div>;
    }

    if (loading) {
        return <div className="flex h-screen items-center justify-center font-medium bg-background text-foreground">Loading messages...</div>;
    }

    return (
        <div className="flex min-h-screen bg-background">
            {/* Minimal Sticky Sidebar */}
            <Sidebar onLogout={handleLogout} />

            {/* Main Content Area */}
            <main className="flex-1 p-6 md:p-10">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Email Dashboard</h1>
                    </div>
                    {/* Mobile Menu trigger could go here */}
                </header>

                {error && (
                    <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive">
                        <p className="font-medium">Failed to load messages</p>
                        <p className="text-sm mt-1 opacity-80">{error}</p>
                    </div>
                )}

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 auto-rows-[180px]">

                    {/* Large Inbox Feed - Spans 2 cols, 3 rows */}
                    <div className="md:col-span-2 lg:col-span-2 row-span-3">
                        <InboxCard
                            emails={mockData.emails}
                            totalUnread={mockData.stats.unread}
                            className="h-full"
                            onLoadMore={loadMore}
                            hasMore={hasMore}
                            loadingMore={loadingMore}
                        />
                    </div>

                    {/* AI Summaries / Insight - Spans 1 col, 2 rows */}
                    <div className="md:col-span-1 lg:col-span-1 row-span-2 bg-secondary rounded-3xl p-6 text-secondary-foreground flex flex-col justify-between">
                        <div className="flex justify-between">
                            <h3 className="font-medium text-sm opacity-80">AI Summaries</h3>
                            <Zap className="h-4 w-4 opacity-60" />
                        </div>
                        <div>
                            <p className="text-lg font-medium leading-snug">Smart Reply Suggestions & Insights</p>
                            <p className="text-sm mt-2 opacity-70">3 urgent tasks identified from your recent emails.</p>
                        </div>
                        <div className="mt-4">
                            <div className="bg-background/50 p-3 rounded-xl backdrop-blur-sm text-xs">
                                "Review contract draft by 5 PM"
                            </div>
                        </div>
                    </div>

                    {/* Stats Column 2 (Top Right) */}
                    <StatCard
                        title="Email Stats"
                        value="2,500"
                        label="Emails Processed"
                        variant="dark"
                        icon={<Activity className="h-4 w-4" />}
                        trend="+12% this week"
                    />

                    {/* Unread Count */}
                    <StatCard
                        title="Unread Count"
                        value={mockData.stats.unread}
                        variant="dark"
                        className="bg-[#4A1817]" /* Even darker accent if needed, or keeping standard dark */
                    />

                    {/* Storage */}
                    <StatCard
                        title="Storage Used"
                        value={`${mockData.stats.storage.used}%`}
                        label={`of ${mockData.stats.storage.total}${mockData.stats.storage.unit}`}
                        variant="secondary"
                        icon={<Database className="h-4 w-4" />}
                    />

                    {/* Quick Actions / Compose */}
                    <ComposeCard className="row-span-1 md:col-span-1" />

                    {/* System Healthy Graph placeholder */}
                    <div className="md:col-span-1 lg:col-span-1 bg-secondary rounded-3xl p-6 flex flex-col justify-between">
                        <h3 className="font-medium text-sm text-muted-foreground">System</h3>
                        <div className="flex items-end gap-1 h-12 mt-2">
                            {[40, 70, 50, 90, 60, 80].map((h, i) => (
                                <div key={i} className="flex-1 bg-primary/40 rounded-t-sm" style={{ height: `${h}%` }} />
                            ))}
                        </div>
                        <p className="text-sm font-bold text-foreground mt-2">All Systems Operational</p>
                    </div>

                </div>
            </main>
        </div>
    );
}
