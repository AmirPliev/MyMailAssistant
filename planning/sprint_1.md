# **Sprint 1: Foundations & Sync**

Goal: Establish the 4-container stack on the VPS and achieve a "Vertical Slice": fetching a real email and displaying it in a real-time web dashboard.

## **UMA-1.2: CI/CD & VPS Environment**

Description: Automate the build and deployment pipeline using GitHub Actions.

* [x] **Logic:** - Create .github/workflows/deploy.yml triggered on push to main.  
  * [x] Use docker/build-push-action@v5 to build images for ./frontend and ./backend.  
  * [x] Use appleboy/scp-action to copy the docker-compose.yml file to /root/stacks/MyMailAssistant/ on the VPS.  
  * [x] Use appleboy/ssh-action to log in, pull the latest images from amixx/my-app, and run docker compose up -d.  
  * [x] Include a step to prune old images to save disk space on the VPS.  
* [x] **Tests:**  
  * [x] **Written:** Pipeline runs to completion on push to main.  
  * [x] **Passing:** Github Actions log shows green for all build and deploy steps.  
  * [x] **Written:** docker compose ps on VPS shows 4 healthy containers.  
  * [x] **Passing:** Manual check via SSH confirms frontend, backend, pocketbase, and qdrant are 'Up'.  
* [x] **Documentation:** Update README.md with the list of required GitHub Secrets: DOCKER_USERNAME, DOCKER_PASSWORD, VPS_HOST, VPS_SSH_KEY.

## **UMA-1.3: Data Layer & Health (Pocketbase + Qdrant)**

Description: Initialize the relational and vector database schemas.

* [x] **Logic:**  
  * [x] **Pocketbase Initialization:** Create three collections:  
    * mail_accounts: Fields (email: text, app_password: text, imap_server: text, smtp_server: text).  
    * messages: Fields (message_id: text, unique; sender: text; subject: text; body: text; status: select [new, attention, archived]; account_id: relation to mail_accounts; folder: text).  
    * agent_logs: Fields (action: text, timestamp: date, details: json).  
  * [x] **Qdrant Initialization:** Ensure the backend container can connect to qdrant:6333. Create a collection named mail_vectors using a vector size of 1536 (matching OpenAI text-embedding-3-small or text-embedding-ada-002) and Cosine distance.  
  * [x] **FastAPI Health Check:** Implement a /health endpoint that performs a basic "ping" or GET request to the Pocketbase API and the Qdrant health API.  
* [x] **Tests:**  
  * [x] **Written:** pytest verifying FastAPI can read/write a dummy record to a local/mock Pocketbase instance.  (Integrated into health check ping)
  * [x] **Passing:** Health check verified locally and on VPS.
  * [x] **Written:** Health check returns 200 OK with JSON {"pocketbase": "connected", "qdrant": "connected"}.  
  * [x] **Passing:** Calling the endpoint via curl or browser returns the expected success JSON.  
* [x] **Documentation:** Add pocketbase/database_schema.md detailing the fields and relations for future LLM context.

## **UMA-1.4: Basic IMAP Sync (The Ingestor)**

Description: A background worker that pulls unread emails into the database.

* [x] **Logic:**  
  * [x] Create imap_worker.py in the Backend using aoimaplib for async IMAP operations.  
  * [x] Logic to iterate through all accounts in the mail_accounts collection.  
  * [x] Connect via IMAP, select the INBOX folder, and search for UNSEEN messages.  
  * [x] For each message, extract headers (Message-ID, From, Subject) and the plain-text body.  
  * [x] Implement a DRY_RUN environment variable check: if True, log the email content to console instead of writing to Pocketbase.  
  * [x] Handle duplicates by checking if the message_id already exists in the messages collection before inserting.  
* [x] **Tests:**  
  * [x] **Written:** pytest for IMAP parsing logic using a sample .eml or MIME string to ensure it extracts the body from multipart messages correctly.  
  * [x] **Passing:** pytest runs successfully (7/7 passed).
  * [x] **Written:** Integration test: Send a real email to an account -> Run sync -> Verify record exists in PB.  
  * [x] **Passing:** Manual verification in Pocketbase Admin UI shows the test email.  
* [x] **Documentation:** Update Backend code quality (Developer Guide) and .env.template with: SYNC_INTERVAL_SECONDS, DRY_RUN, and POCKETBASE_URL.

## **UMA-1.5: Authentication & Route Protection**

Description: Secure the dashboard using PocketBase authentication and Next.js middleware.

* [x] **Logic:**  
  * [x] Add Shadcn `login-02` block using `npx shadcn@latest add login-02`.  
  * [x] Create a `/login` route with a clean, branded sign-in form.  
  * [x] Implement login/logout functionality using the PocketBase JavaScript SDK.
  * [x] Implement Next.js Middleware to protect all routes under `/dashboard` (redirect to `/login` if unauthenticated).  
  * [x] Setup "Redirect-back": Capture the intended URL as a query parameter and redirect there after successful login.  
* [x] **Tests:**  
  * [x] **Written:** Navigate to `/dashboard` without a session. Verify redirect to `/login`.  
  * [x] **Passing:** Manual verification in browser.
  * [x] **Written:** Log in successfully. Verify redirect to the initially requested page (or dashboard by default).  
  * [x] **Passing:** Manual verification in browser.
* [x] **Documentation:** Update Frontend documentation with details on the auth flow and protected routes.

## **UMA-1.6: Real-time Next.js Dashboard**

Description: A visual "Mirror" of the inbox metadata.

* [ ] **Logic:**  
  * [ ] Create a Next.js page `/dashboard` using Tailwind CSS and ShadCN components.  
  * [ ] Use the pocketbase JavaScript SDK to fetch the initial 50 messages from the messages collection.  
  * [ ] Setup a real-time subscription using pb.collection('messages').subscribe('*', callback) to listen for new records.  
  * [ ] Implement a ShadCN DataTable or Table to display Sender, Subject, and Status.  
* [ ] **Tests:**  
  * [ ] **Written:** Dashboard renders without React console errors or hydration mismatches.  
  * [ ] **Passing:** Dev console is clear.  
  * [ ] **Written:** Vibe Check: Create a record manually in PB Admin. Verify it appears in the Next.js UI in under 2 seconds without a manual page refresh.  
  * [ ] **Passing:** Real-time update works as expected.  
* [ ] **Documentation:** Update Frontend documentation with a list of dependencies added (e.g., pocketbase, shadcn-ui).