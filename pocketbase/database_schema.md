# Database Schema Documentation

This document describes the relational schema in PocketBase and the vector schema in Qdrant.

## PocketBase (Relational DB)

### `mail_accounts`
Stores connection details for synced email accounts.

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `email` | `email` | Yes | The email address of the account. |
| `app_password` | `text` | Yes | The application-specific password. |
| `imap_server` | `text` | Yes | IMAP server address (e.g., imap.gmail.com). |
| `smtp_server` | `text` | Yes | SMTP server address (e.g., smtp.gmail.com). |

### `messages`
Stores email metadata and content.

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `message_id` | `text` | Yes | Unique IMAP Message-ID (Unique Index). |
| `sender` | `text` | Yes | The sender's email/name. |
| `subject` | `text` | No | Email subject line. |
| `body` | `text` | No | Plain-text body of the email. |
| `status` | `select` | Yes | Lifecycle status: `new`, `attention`, `archived`. |
| `account_id` | `relation` | Yes | Links to `mail_accounts`. |
| `folder` | `text` | No | The IMAP folder where the message was found. |

### `agent_logs`
Stores audit logs for AI agent actions.

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `action` | `text` | Yes | High-level description of the action. |
| `timestamp` | `date` | Yes | When the action occurred. |
| `details` | `json` | No | Structured metadata about the action result. |

---

## Qdrant (Vector DB)

### `mail_vectors`
Stores semantic embeddings of email content for RAG.

| Parameter | Value | Description |
| :--- | :--- | :--- |
| **Vector Size** | `1536` | Optimized for OpenAI models. |
| **Distance Metric** | `Cosine` | Standard for semantic similarity. |
| **Payload Schema** | `id` (PB ID) | Links back to the `messages` collection in PocketBase. |
