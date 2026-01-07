"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import pb from "@/lib/pocketbase";

export function useDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

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
        handleLogout
    };
}
