import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import pb from "@/lib/pocketbase";
import { PBMessage, UIEmail, transformMessageToEmail } from "./types";

interface User {
    id: string;
    email?: string;
    name?: string;
    [key: string]: any; // Allow additional PocketBase fields
}

export function useDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [emails, setEmails] = useState<UIEmail[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [totalUnread, setTotalUnread] = useState(0);

    // Stats data
    const stats = {
        unread: totalUnread, // Use total unread count from server
        storage: { used: 75, total: 100, unit: "GB" },
        health: "98%"
    };

    const mockData = {
        stats,
        emails
    };

    useEffect(function () {
        if (pb.authStore.isValid) {
            setUser(pb.authStore.model as User);
        } else {
            router.push("/login?callbackUrl=/dashboard");
        }
    }, [router]);

    // Fetch total unread count
    async function fetchTotalUnread() {
        try {
            const result = await pb.collection('messages').getList<PBMessage>(1, 1, {
                filter: 'status = "new"',
            });
            setTotalUnread(result.totalItems);
        } catch (err) {
            console.error('Failed to fetch unread count:', err);
        }
    }

    // Fetch initial messages
    useEffect(function () {
        if (!user) return;

        async function fetchMessages() {
            try {
                setLoading(true);
                const records = await pb.collection('messages').getList<PBMessage>(1, 50, {
                    sort: '-created',
                });

                const transformedEmails = records.items.map(transformMessageToEmail);
                setEmails(transformedEmails);
                setHasMore(records.totalPages > 1);
                setError(null);

                // Fetch total unread count
                await fetchTotalUnread();
            } catch (err: any) {
                console.error('Failed to fetch messages:', err);
                setError(err.message || 'Failed to load messages');
            } finally {
                setLoading(false);
            }
        }

        fetchMessages();
    }, [user]);

    // Load more messages (infinite scroll)
    const loadMore = useCallback(async function () {
        if (loadingMore || !hasMore) return;

        try {
            setLoadingMore(true);
            const nextPage = page + 1;
            const records = await pb.collection('messages').getList<PBMessage>(nextPage, 50, {
                sort: '-created',
            });

            const transformedEmails = records.items.map(transformMessageToEmail);
            setEmails(prev => [...prev, ...transformedEmails]);
            setPage(nextPage);
            setHasMore(nextPage < records.totalPages);
        } catch (err: any) {
            console.error('Failed to load more messages:', err);
        } finally {
            setLoadingMore(false);
        }
    }, [page, loadingMore, hasMore]);

    // Set up real-time subscription
    useEffect(function () {
        if (!user) return;

        const unsubscribe = pb.collection('messages').subscribe<PBMessage>('*', function (e) {
            if (e.action === 'create') {
                const newEmail = transformMessageToEmail(e.record);
                setEmails(prev => [newEmail, ...prev]);
                // Update unread count
                if (e.record.status === 'new') {
                    setTotalUnread(prev => prev + 1);
                }
            } else if (e.action === 'update') {
                const updatedEmail = transformMessageToEmail(e.record);
                setEmails(prev => prev.map(email =>
                    email.id === updatedEmail.id ? updatedEmail : email
                ));
                // Refresh unread count
                fetchTotalUnread();
            } else if (e.action === 'delete') {
                setEmails(prev => prev.filter(email => email.id !== e.record.id));
                // Refresh unread count
                fetchTotalUnread();
            }
        });

        return function () {
            unsubscribe.then(unsub => unsub());
        };
    }, [user]);

    function handleLogout() {
        pb.authStore.clear();
        router.push("/login");
    }

    return {
        user,
        handleLogout,
        mockData,
        loading,
        loadingMore,
        error,
        loadMore,
        hasMore
    };
}
