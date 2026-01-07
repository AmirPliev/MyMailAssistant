import PocketBase from 'pocketbase';

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8202');

// Load auth state from cookies if they exist (browser side only here, for SSR we handle it differently)
if (typeof document !== 'undefined') {
    pb.authStore.loadFromCookie(document.cookie);
    pb.authStore.onChange(() => {
        document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
    });
}

export default pb;
