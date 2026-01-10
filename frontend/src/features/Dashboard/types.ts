export interface PBMessage {
    id: string;
    message_id: string;
    sender: string;
    subject: string;
    body: string;
    status: 'new' | 'attention' | 'archived';
    account_id: string;
    folder: string;
    created: string;
    updated: string;
}

export interface UIEmail {
    id: string;
    sender: string;
    subject: string;
    preview: string;
    timestamp: string;
    read: boolean;
    initials: string;
    tag?: string;
}

export function transformMessageToEmail(message: PBMessage): UIEmail {
    // Extract initials from sender email
    const senderName = message.sender.split('@')[0] || message.sender;
    const initials = senderName
        .split(/[\s._-]/)
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    // Create preview from body (first 60 chars)
    const preview = message.body.replace(/\s+/g, ' ').trim().slice(0, 60) + '...';

    // Format timestamp
    const messageDate = new Date(message.created);
    const now = new Date();
    const isToday = messageDate.toDateString() === now.toDateString();

    const timestamp = isToday
        ? messageDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
        : messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return {
        id: message.id,
        sender: message.sender,
        subject: message.subject,
        preview,
        timestamp,
        read: message.status !== 'new',
        initials,
        tag: message.status === 'attention' ? 'URGENT' : undefined,
    };
}
