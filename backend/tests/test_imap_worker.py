import pytest
import email
from email.message import Message
from imap_worker import IMAPWorker

@pytest.fixture
def worker():
    return IMAPWorker()

def test_decode_header_simple(worker):
    assert worker._decode_header("Simple Header") == "Simple Header"

def test_decode_header_utf8(worker):
    # MIME encoded "Subject: こんにちは" (Hello in Japanese)
    encoded = "=?UTF-8?B?44GT44KT44Gr44Gh44Gv?="
    assert worker._decode_header(encoded) == "こんにちは"

def test_decode_header_mixed(worker):
    encoded = "Hello =?UTF-8?B?44GT44KT44Gr44Gh44Gv?="
    assert worker._decode_header(encoded) == "Hello こんにちは"

def test_extract_body_simple(worker):
    msg = email.message_from_string("This is a simple body")
    assert worker._extract_body(msg) == "This is a simple body"

def test_extract_body_multipart(worker):
    payload = """Content-Type: multipart/alternative; boundary="boundary"

--boundary
Content-Type: text/plain; charset=utf-8

This is the plain text body.
--boundary
Content-Type: text/html; charset=utf-8

<html><body>This is HTML</body></html>
--boundary--"""
    msg = email.message_from_string(payload)
    assert worker._extract_body(msg) == "This is the plain text body."

def test_extract_body_with_attachment(worker):
    payload = """Content-Type: multipart/mixed; boundary="boundary"

--boundary
Content-Type: text/plain; charset=utf-8

Relevant body.
--boundary
Content-Type: application/pdf; name="test.pdf"
Content-Disposition: attachment; filename="test.pdf"

(binary data)
--boundary--"""
    msg = email.message_from_string(payload)
    assert worker._extract_body(msg) == "Relevant body."

def test_extract_body_empty(worker):
    msg = Message()
    assert worker._extract_body(msg) == ""
