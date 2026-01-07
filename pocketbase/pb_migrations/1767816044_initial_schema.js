/// <reference path="../pb_data/types.d.ts" />
migrate((dao) => {
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

    dao.saveCollection(mail_accounts);
    dao.saveCollection(messages);
    dao.saveCollection(agent_logs);
}, (dao) => {
    const mail_accounts = dao.findCollectionByNameOrId("mail_accounts");
    const messages = dao.findCollectionByNameOrId("messages");
    const agent_logs = dao.findCollectionByNameOrId("agent_logs");

    if (agent_logs) dao.deleteCollection(agent_logs.id);
    if (messages) dao.deleteCollection(messages.id);
    if (mail_accounts) dao.deleteCollection(mail_accounts.id);
})
