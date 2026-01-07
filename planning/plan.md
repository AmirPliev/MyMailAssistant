# **Project Plan: Unified Mail Assistant (UMA)**

## **1\. Product Description**

UMA is a personal, LLM-powered mail intelligence system designed to decouple the user from their traditional email client. It acts as an autonomous agent that monitors multiple mailboxes, categorizes incoming mail, prepares draft replies, and provides a semantic search (RAG) interface via a web dashboard and Telegram bot. The system follows a "Mirror Strategy," using physical IMAP folders (Attention and AI Archive) to reflect the internal state of the agent.

## **2\. Core Feature List**

* \[ \] **Multi-Mailbox Sync:** Seamlessly monitor and manage multiple IMAP/SMTP accounts.  
* \[ \] **Agentic Triage:** Automatic classification of mail into "Action Required" or "Informational."  
* \[ \] **Draft Orchestration:** LLM-generated draft replies prepared directly in the mail server's Drafts folder.  
* \[ \] **Semantic Mail RAG:** A vector-searchable database (Qdrant) of all processed mail for complex natural language queries.  
* \[ \] **Telegram Command Center:** Real-time notifications and a chat interface to interact with the mail agent on the go.  
* \[ \] **Debug & Control Dashboard:** A Next.js web interface to monitor agent logs, "vibe-check" prompts, and approve drafts.

## **3\. Technology Stack**

* **Frontend:** Next.js (App Router), Tailwind CSS, ShadCN UI, Lucide Icons.  
* **Backend:** FastAPI (Python), aoimaplib or imap\_tools, pydantic.  
* **BaaS/Database:** Pocketbase (Auth, Relational Data, Real-time SDK).  
* **Vector Store:** Qdrant (Containerized).  
* **AI/LLM:** OpenAI (GPT-4o) / Anthropic (Claude 3.5).  
* **Deployment:** Docker Compose, GitHub Actions, Linux VPS.

## **4\. Roadmap**

### **Phase 1: The "Walking Skeleton" (Infrastructure)**

*Focus: Connectivity, CI/CD, and basic data flow.*

* [x] **Sprint 1: Foundations & Sync** (See [sprint_1.md](./sprint_1.md))  
  * Goal: Establish 4-container stack and pull first email to DB.

### **Phase 2: The "Mirror & Brain" (Intelligence)**

* \[ \] **Sprint 2: The Mirror Engine**  
* \[ \] **Sprint 3: LLM Drafting**

### **Phase 4: The "Memory & Voice" (Interaction)**

* \[ \] **Sprint 4: Semantic Memory (RAG)**  
* \[ \] **Sprint 5: Telegram & Final Polish**

## **5\. Deployment & Maintenance**

* [x] **Deployment:** GH Action triggers on push to main.  
* \[ \] **Backups:** Setup a cron job on VPS to run pocketbase backup create.  
* \[ \] **Logs:** Backend logs stored in PB logs collection for remote viewing.