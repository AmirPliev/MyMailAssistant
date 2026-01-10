import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import pb from "@/lib/pocketbase";

export function useDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    // Mock Data for UI Development
    const mockData = {
        stats: {
            unread: 24,
            storage: { used: 75, total: 100, unit: "GB" },
            health: "98%"
        },
        emails: [
            { id: "1", sender: "New Bente", subject: "MyMailAssistant <oan.com>", preview: "Project update...", timestamp: "#edc41f", read: false, initials: "NB", tag: "#edc41f" },
            { id: "2", sender: "Sparish Inverement", subject: "nm.t.oomailing.com", preview: "Your invoice is ready...", timestamp: "#edc41f", read: false, initials: "SI", tag: "#edc41f" },
            { id: "3", sender: "Coptornity", subject: "MyMailAssistant@nars.com", preview: "Login alert for your account", timestamp: "7:30 PM", read: true, initials: "CO" },
            { id: "4", sender: "How Bun Isioating", subject: "Email from t/ Email", preview: "Weekly newsletter...", timestamp: "7:00 AM", read: true, initials: "HB" },
            { id: "5", sender: "Connect with/ttowky", subject: "gmail.com", preview: "Invitation to connect", timestamp: "7:00 AM", read: true, initials: "CW" },
            { id: "6", sender: "Moniting unoeacent", subject: "Issue year 11", preview: "Subscription renewal reminder", timestamp: "7:00 PM", read: true, initials: "MU" },
            { id: "7", sender: "Talrfte onr", subject: "Hello Ahmandojf@gmail.com", preview: "Checking in on the project status", timestamp: "9:00 PM", read: true, initials: "TO" }
        ]
    };

    useEffect(function () {
        if (pb.authStore.isValid) {
            setUser(pb.authStore.model);
        } else {
            router.push("/login?callbackUrl=/dashboard");
        }
    }, [router]);

    function handleLogout() {
        pb.authStore.clear();
        router.push("/login");
    }

    return {
        user,
        handleLogout,
        mockData
    };
}
