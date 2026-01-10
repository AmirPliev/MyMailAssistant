import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import Separator from "@/components/ui/separator";

interface Email {
    id: string;
    sender: string;
    subject: string;
    preview: string;
    timestamp: string;
    read: boolean;
    avatar?: string;
    initials: string;
    tag?: string;
}

interface InboxCardProps extends React.HTMLAttributes<HTMLDivElement> {
    emails: Email[];
}

export default function InboxCard({ className, emails, ...props }: InboxCardProps) {
    return (
        <div
            className={cn(
                "flex flex-col rounded-3xl bg-card text-card-foreground p-6 shadow-sm overflow-hidden",
                className
            )}
            {...props}
        >
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold tracking-tight">Inbox Feed</h2>
                    <p className="text-sm text-gray-300 mt-1">{emails.length} New Emails</p>
                </div>
                <div className="h-10 w-1 rounded-full bg-primary/20">
                    <div className="h-1/3 w-full bg-primary rounded-full" />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-4 custom-scrollbar">
                {emails.map((email, i) => (
                    <div key={email.id}>
                        <div className="flex items-start gap-4 group cursor-pointer">
                            <div className="relative mt-1">
                                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-zinc-800 text-zinc-300 font-medium text-sm border border-zinc-700">
                                    {email.initials}
                                </div>
                                {!email.read && (
                                    <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary border-2 border-card" />
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                    <h4 className="font-semibold text-sm text-zinc-100 truncate pr-2">{email.sender}</h4>
                                    {email.tag && (
                                        <span className="text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded ml-auto mr-3">
                                            {email.tag}
                                        </span>
                                    )}
                                    <span className="text-xs text-zinc-400 whitespace-nowrap">{email.timestamp}</span>
                                </div>
                                <p className="text-sm font-medium text-zinc-300 truncate">{email.subject}</p>
                                <p className="text-xs text-zinc-500 truncate mt-0.5">{email.preview}</p>
                            </div>
                        </div>
                        {i < emails.length - 1 && (
                            <Separator className="my-4 bg-zinc-800/50" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
