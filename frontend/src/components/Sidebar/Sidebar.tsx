import Link from "next/link";
import { Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./useSidebar";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    activeItem?: string;
    onLogout?: () => void;
}

export default function Sidebar({ className, activeItem = "inbox", onLogout, ...props }: SidebarProps) {
    const { navItems } = useSidebar(activeItem);

    return (
        <div className={cn("hidden md:flex flex-col w-56 p-6 h-screen sticky top-0", className)} {...props}>
            <div className="mb-10 pl-2">
                <h1 className="text-xl font-bold tracking-tight text-foreground">MyMailAssistant</h1>
            </div>

            <nav className="flex-1 space-y-2">
                {navItems.map((item) => {
                    const isActive = activeItem === item.id;
                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer",
                                isActive
                                    ? "bg-secondary text-foreground"
                                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                            )}
                        >
                            <item.icon className="h-4 w-4" strokeWidth={2} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto pt-6 border-t border-border">
                <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground rounded-md transition-colors mb-1 cursor-pointer"
                >
                    <Settings className="h-4 w-4" strokeWidth={2} />
                    Settings
                </Link>
                <button
                    onClick={onLogout}
                    className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-md transition-colors cursor-pointer"
                >
                    <LogOut className="h-4 w-4" strokeWidth={2} />
                    Logout
                </button>
            </div>
        </div>
    );
}
