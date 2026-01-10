import { cn } from "@/lib/utils";

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    value: string | number;
    label?: string;
    icon?: React.ReactNode;
    trend?: string;
    variant?: "primary" | "secondary" | "dark";
}

export default function StatCard({
    className,
    title,
    value,
    label,
    icon,
    trend,
    variant = "secondary",
    ...props
}: StatCardProps) {
    return (
        <div
            className={cn(
                "flex flex-col justify-between p-6 rounded-xl shadow-sm transition-all hover:shadow-md",
                variant === "dark" && "bg-card text-card-foreground",
                variant === "secondary" && "bg-secondary text-secondary-foreground",
                variant === "primary" && "bg-primary text-primary-foreground",
                className
            )}
            {...props}
        >
            <div className="flex justify-between items-start mb-4">
                <h3 className={cn("text-sm font-medium opacity-80", variant === "dark" ? "text-gray-300" : "text-muted-foreground")}>
                    {title}
                </h3>
                {icon && <div className="text-current opacity-80">{icon}</div>}
            </div>

            <div>
                <div className="text-4xl font-bold tracking-tight">{value}</div>
                {label && (
                    <p className={cn("text-sm mt-1 opacity-70", variant === "dark" ? "text-gray-400" : "text-muted-foreground")}>
                        {label}
                    </p>
                )}
                {trend && (
                    <p className="text-xs font-medium mt-2 opacity-90">{trend}</p>
                )}
            </div>
        </div>
    );
}
