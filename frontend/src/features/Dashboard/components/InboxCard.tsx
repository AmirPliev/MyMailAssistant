import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

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
    totalUnread?: number;
    onLoadMore?: () => void;
    hasMore?: boolean;
    loadingMore?: boolean;
}

export default function InboxCard({ className, emails, totalUnread = 0, onLoadMore, hasMore, loadingMore, ...props }: InboxCardProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(function () {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer || !onLoadMore || !hasMore) return;

        function handleScroll() {
            if (!scrollContainer) return;
            const { scrollTop, scrollHeight, clientHeight } = scrollContainer;

            // Load more when scrolled to 80% of the content
            if (scrollTop + clientHeight >= scrollHeight * 0.8 && !loadingMore && onLoadMore) {
                onLoadMore();
            }
        }

        scrollContainer.addEventListener('scroll', handleScroll);
        return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }, [onLoadMore, hasMore, loadingMore]);
    return (
        <div
            className={cn(
                "flex flex-col rounded-xl bg-card text-card-foreground p-6 shadow-sm overflow-hidden",
                className
            )}
            {...props}
        >
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold tracking-tight">Inbox Feed</h2>
                    <p className="text-sm text-gray-300 mt-1">{totalUnread} Unread</p>
                </div>
                <div className="h-10 w-1 rounded-full bg-primary/20">
                    <div className="h-1/3 w-full bg-primary rounded-full" />
                </div>
            </div>


            <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden pr-2 -mr-2 custom-scrollbar">
                {emails.map((email) => (
                    <div className="flex items-start gap-4 group cursor-pointer p-3 pl-6 -mx-3 rounded-lg transition-all duration-200 hover:bg-white/5 hover:shadow-sm">
                        <div className="relative mt-1">
                            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-background text-foreground font-semibold text-sm border border-border transition-all duration-200 group-hover:scale-110 group-hover:border-primary/30">
                                {email.initials}
                            </div>
                            {!email.read && (
                                <span
                                    className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary border-2 border-card animate-pulse"
                                    title="Unread message"
                                />
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                                <h4 className={cn(
                                    "text-sm truncate pr-2 transition-colors duration-200 group-hover:text-primary",
                                    email.read ? "font-medium text-zinc-200" : "font-bold text-white"
                                )}>
                                    {email.sender}
                                </h4>
                                {email.tag && (
                                    <span className="text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded ml-auto mr-3 animate-pulse">
                                        {email.tag}
                                    </span>
                                )}
                                <span className="text-xs text-zinc-300 whitespace-nowrap">{email.timestamp}</span>
                            </div>
                            <p className={cn(
                                "text-sm truncate transition-colors duration-200",
                                email.read ? "font-normal text-zinc-200" : "font-semibold text-white"
                            )}>
                                {email.subject}
                            </p>
                            <p className="text-xs text-zinc-300 truncate mt-0.5 group-hover:text-zinc-200 transition-colors duration-200">
                                {email.preview}
                            </p>
                        </div>
                    </div>
                ))}
                {loadingMore && (
                    <div className="flex justify-center py-4">
                        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
                    </div>
                )}
            </div>
        </div>
    );
}
