/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
    const mail_accounts = new Collection({
        name: "mail_accounts",
        type: "base",
        schema: [
            {
                name: "email",
                type: "email",
                required: true,
            },
            {
                name: "app_password",
                type: "text",
                required: true,
            },
            {
                name: "imap_server",
                type: "text",
                required: true,
            },
            {
                name: "smtp_server",
                type: "text",
                required: true,
            },
        ],
    });

    const messages = new Collection({
        name: "messages",
        type: "base",
        schema: [
            {
                name: "message_id",
                type: "text",
                required: true,
                unique: true,
            },
            {
                name: "sender",
                type: "text",
                required: true,
            },
            {
                name: "subject",
                type: "text",
            },
            {
                name: "body",
                type: "text",
            },
            {
                name: "status",
                type: "select",
                required: true,
                options: {
                    values: ["new", "attention", "archived"],
                    maxSelect: 1,
                },
            },
            {
                name: "account_id",
                type: "relation",
                required: true,
                options: {
                    collectionId: "mail_accounts",
                    cascadeDelete: true,
                    maxSelect: 1,
                },
            },
            {
                name: "folder",
                type: "text",
            },
        ],
        indexes: [
            "CREATE UNIQUE INDEX `idx_message_id` ON `messages` (`message_id`)"
        ]
    });

    const agent_logs = new Collection({
        name: "agent_logs",
        type: "base",
        schema: [
            {
                name: "action",
                type: "text",
                required: true,
            },
            {
                name: "timestamp",
                type: "date",
                required: true,
            },
            {
                name: "details",
                type: "json",
            },
        ],
    });

    db.saveCollection(mail_accounts);
    db.saveCollection(messages);
    db.saveCollection(agent_logs);
}, (db) => {
    const mail_accounts = db.findCollectionByNameOrId("mail_accounts");
    const messages = db.findCollectionByNameOrId("messages");
    const agent_logs = db.findCollectionByNameOrId("agent_logs");

    if (agent_logs) db.deleteCollection(agent_logs.id);
    if (messages) db.deleteCollection(messages.id);
    if (mail_accounts) db.deleteCollection(mail_accounts.id);
})
