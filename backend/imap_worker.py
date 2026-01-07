import os
import asyncio
import logging
import httpx
import email
from email.message import Message
from email.header import decode_header
import aioimaplib
from datetime import datetime
from typing import List, Dict, Any, Optional, Tuple

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

POCKETBASE_URL: str = os.getenv("POCKETBASE_URL", "http://pocketbase:8080")
SYNC_INTERVAL: int = int(os.getenv("SYNC_INTERVAL_SECONDS", 60))
DRY_RUN: bool = os.getenv("DRY_RUN", "false").lower() == "true"
PB_ADMIN_EMAIL: str = os.getenv("PB_ADMIN_EMAIL", "admin@example.com")
PB_ADMIN_PASSWORD: str = os.getenv("PB_ADMIN_PASSWORD", "password123")

class IMAPWorker:
    def __init__(self) -> None:
        self._stop_event = asyncio.Event()
        self._admin_token: Optional[str] = None

    async def _authenticate(self) -> bool:
        """Authenticate with PocketBase as an admin to get a token."""
        try:
            async with httpx.AsyncClient() as client:
                url = f"{POCKETBASE_URL}/api/admins/auth-with-password"
                data = {"identity": PB_ADMIN_EMAIL, "password": PB_ADMIN_PASSWORD}
                resp = await client.post(url, json=data)
                if resp.status_code == 200:
                    self._admin_token = resp.json().get("token")
                    return True
                logger.error(f"Admin auth failed: {resp.status_code}")
                return False
        except Exception as e:
            logger.error(f"Error during admin auth: {e}")
            return False

    async def _get_mail_accounts(self) -> List[Dict[str, Any]]:
        """Fetch all mail accounts from PocketBase."""
        if not self._admin_token and not await self._authenticate():
            return []

        try:
            async with httpx.AsyncClient() as client:
                url = f"{POCKETBASE_URL}/api/collections/mail_accounts/records"
                headers = {"Authorization": self._admin_token}
                resp = await client.get(url, headers=headers)
                
                if resp.status_code == 401:  # Token might be expired
                    self._admin_token = None
                    return await self._get_mail_accounts()

                if resp.status_code == 200:
                    return resp.json().get("items", [])
                logger.error(f"Failed to fetch accounts: {resp.status_code}")
                return []
        except Exception as e:
            logger.error(f"Error fetching mail accounts: {e}")
            return []

    async def _check_message_exists(self, message_id: str) -> bool:
        """Check if a message with the given ID exists in PocketBase."""
        if not self._admin_token and not await self._authenticate():
            return False

        try:
            async with httpx.AsyncClient() as client:
                url = f"{POCKETBASE_URL}/api/collections/messages/records"
                params = {"filter": f'message_id="{message_id}"'}
                headers = {"Authorization": self._admin_token}
                resp = await client.get(url, params=params, headers=headers)
                return resp.json().get("totalItems", 0) > 0 if resp.status_code == 200 else False
        except Exception as e:
            logger.error(f"Error checking message: {e}")
            return False

    async def _save_message(self, data: Dict[str, Any]) -> bool:
        """Save a message record to PocketBase."""
        if DRY_RUN:
            logger.info(f"[DRY RUN] Would save: {data['subject']}")
            return True

        if not self._admin_token and not await self._authenticate():
            return False

        try:
            async with httpx.AsyncClient() as client:
                url = f"{POCKETBASE_URL}/api/collections/messages/records"
                headers = {"Authorization": self._admin_token}
                resp = await client.post(url, json=data, headers=headers)
                return resp.status_code in (200, 201)
        except Exception as e:
            logger.error(f"Error saving message: {e}")
            return False

    def _decode_header(self, value: Optional[str]) -> str:
        """Decode MIME encoded headers."""
        if not value:
            return ""
        fragments = decode_header(value)
        decoded = []
        for fragment, encoding in fragments:
            if isinstance(fragment, bytes):
                decoded.append(fragment.decode(encoding or "utf-8", errors="replace"))
            else:
                decoded.append(fragment)
        return "".join(decoded)

    def _extract_body(self, msg: Message) -> str:
        """Extract plain-text body from an email message."""
        if not msg.is_multipart():
            payload = msg.get_payload(decode=True)
            return payload.decode(errors="replace").strip() if payload else ""

        for part in msg.walk():
            if part.get_content_type() == "text/plain":
                disposition = str(part.get("Content-Disposition"))
                if "attachment" not in disposition:
                    payload = part.get_payload(decode=True)
                    return payload.decode(errors="replace").strip() if payload else ""
        return ""

    async def _process_single_message(self, imap: aioimaplib.IMAP4_SSL, msg_id: str, account_id: str) -> None:
        """Fetch, parse, and save a single message."""
        res, data = await imap.fetch(msg_id, "RFC822")
        if res != "OK":
            return

        msg = email.message_from_bytes(data[1])
        msg_id_hdr = msg.get("Message-ID", f"gen-{datetime.now().timestamp()}")
        # Strip RFC angle brackets for cleaner storage
        if msg_id_hdr.startswith("<") and msg_id_hdr.endswith(">"):
            msg_id_hdr = msg_id_hdr[1:-1]
        
        if await self._check_message_exists(msg_id_hdr):
            return

        await self._save_message({
            "message_id": msg_id_hdr,
            "sender": self._decode_header(msg.get("From")),
            "subject": self._decode_header(msg.get("Subject")),
            "body": self._extract_body(msg),
            "status": "new",
            "account_id": account_id,
            "folder": "INBOX"
        })

    async def _sync_account(self, account: Dict[str, Any]) -> None:
        """Sync a single mail account."""
        email_addr, password = account.get("email"), account.get("app_password")
        server, account_id = account.get("imap_server"), account.get("id")

        try:
            imap = aioimaplib.IMAP4_SSL(server)
            await imap.wait_hello_from_server()
            await imap.login(email_addr, password)
            await imap.select("INBOX")

            res, data = await imap.search("UNSEEN")
            if res == "OK":
                for msg_id in data[0].split():
                    await self._process_single_message(imap, msg_id.decode(), account_id)
            
            await imap.logout()
        except Exception as e:
            logger.error(f"Account sync failed for {email_addr}: {e}")

    async def run(self) -> None:
        """Main loop for the background worker."""
        logger.info("IMAP Worker started.")
        while not self._stop_event.is_set():
            accounts = await self._get_mail_accounts()
            for account in accounts:
                await self._sync_account(account)

            logger.info(f"Sync complete. Next run in {SYNC_INTERVAL}s.")
            try:
                await asyncio.wait_for(self._stop_event.wait(), timeout=SYNC_INTERVAL)
            except asyncio.TimeoutError:
                continue

    def stop(self) -> None:
        self._stop_event.set()

if __name__ == "__main__":
    worker = IMAPWorker()
    try:
        asyncio.run(worker.run())
    except KeyboardInterrupt:
        worker.stop()
