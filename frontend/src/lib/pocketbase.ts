import PocketBase from 'pocketbase';

// Use different URLs for server-side (Docker network) and client-side (browser)
const getBaseUrl = () => {
    // Server-side (SSR/API routes) - use Docker service name
    if (typeof window === 'undefined') {
        return process.env.POCKETBASE_URL || 'http://pocketbase:8080';
    }
    // Client-side (browser) - use public URL
    return process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8202';
};

const pb = new PocketBase(getBaseUrl());

// Load auth state from cookies if they exist (browser side only)
if (typeof window !== 'undefined') {
    pb.authStore.loadFromCookie(document.cookie);
    pb.authStore.onChange(() => {
        document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
    });
}

export default pb;
