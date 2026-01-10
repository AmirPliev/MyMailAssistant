migrate((db) => {
    const dao = new Dao(db);

    // Add user_id field to mail_accounts
    const mail_accounts = dao.findCollectionByNameOrId("mail_accounts");

    mail_accounts.schema.addField(new SchemaField({
        name: "user_id",
        type: "relation",
        required: true,
        options: {
            collectionId: "_pb_users_auth_",
            cascadeDelete: true,
            maxSelect: 1,
        },
    }));

    // Set access rules for mail_accounts
    mail_accounts.listRule = "@request.auth.id != '' && user_id = @request.auth.id";
    mail_accounts.viewRule = "@request.auth.id != '' && user_id = @request.auth.id";
    mail_accounts.createRule = "@request.auth.id != ''";
    mail_accounts.updateRule = "@request.auth.id != '' && user_id = @request.auth.id";
    mail_accounts.deleteRule = "@request.auth.id != '' && user_id = @request.auth.id";

    dao.saveCollection(mail_accounts);

    // Set access rules for messages (filter by account ownership)
    const messages = dao.findCollectionByNameOrId("messages");

    messages.listRule = "@request.auth.id != '' && account_id.user_id = @request.auth.id";
    messages.viewRule = "@request.auth.id != '' && account_id.user_id = @request.auth.id";
    messages.createRule = null; // Only backend can create messages
    messages.updateRule = "@request.auth.id != '' && account_id.user_id = @request.auth.id";
    messages.deleteRule = "@request.auth.id != '' && account_id.user_id = @request.auth.id";

    dao.saveCollection(messages);

}, (db) => {
    const dao = new Dao(db);

    // Revert mail_accounts
    const mail_accounts = dao.findCollectionByNameOrId("mail_accounts");
    mail_accounts.schema.removeField("user_id");
    mail_accounts.listRule = null;
    mail_accounts.viewRule = null;
    mail_accounts.createRule = null;
    mail_accounts.updateRule = null;
    mail_accounts.deleteRule = null;
    dao.saveCollection(mail_accounts);

    // Revert messages
    const messages = dao.findCollectionByNameOrId("messages");
    messages.listRule = null;
    messages.viewRule = null;
    messages.createRule = null;
    messages.updateRule = null;
    messages.deleteRule = null;
    dao.saveCollection(messages);
})
