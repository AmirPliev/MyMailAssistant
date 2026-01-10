import { PenSquare, Calendar, Filter } from "lucide-react";
import Button from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ComposeCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "flex flex-col p-6 rounded-3xl bg-secondary text-secondary-foreground shadow-sm",
                className
            )}
            {...props}
        >
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Quick Actions</h3>
            <div className="flex flex-col gap-3">
                <Button
                    className="w-full justify-start gap-3 bg-white hover:bg-white/80 text-foreground border-none font-medium h-12 rounded-xl shadow-sm"
                    variant="secondary"
                >
                    <PenSquare className="h-4 w-4 text-primary" />
                    Compose
                </Button>
                <Button
                    className="w-full justify-start gap-3 bg-white/50 hover:bg-white/80 text-foreground border-none font-medium h-12 rounded-xl"
                    variant="ghost"
                >
                    <Calendar className="h-4 w-4" />
                    Schedule
                </Button>
            </div>
        </div>
    );
}
