import { Inbox, Send, FileText, Archive } from "lucide-react";

export function useSidebar(activeItem: string = "inbox") {
    const navItems = [
        { name: "Inbox", icon: Inbox, id: "inbox", href: "/dashboard" },
        { name: "Sent", icon: Send, id: "sent", href: "/dashboard?view=sent" },
        { name: "Drafts", icon: FileText, id: "drafts", href: "/dashboard?view=drafts" },
        { name: "Archive", icon: Archive, id: "archive", href: "/dashboard?view=archive" },
    ];

    return {
        navItems,
        activeItem
    };
}
