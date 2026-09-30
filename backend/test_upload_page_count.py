import urllib.request
import uuid
import json

def test_file(path, fname, expected_pages):
    boundary = "----WebKitFormBoundary" + uuid.uuid4().hex
    with open(path, "rb") as f:
        pdf_bytes = f.read()

    body = (
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="file"; filename="{fname}"\r\n'
        f"Content-Type: application/pdf\r\n\r\n"
    ).encode() + pdf_bytes + f"\r\n--{boundary}--\r\n".encode()

    req = urllib.request.Request(
        "http://127.0.0.1:8000/api/documents/upload",
        data=body,
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"}
    )

    resp = json.loads(urllib.request.urlopen(req).read().decode())
    print(f"File: {fname} -> Extracted pages: {resp.get('pages')}, Expected: {expected_pages}")
    assert resp.get("pages") == expected_pages, f"Expected {expected_pages}, got {resp.get('pages')}"

test_file("backend/uploads/doc_5675cd73_ABC_Ltd_Annual_Report_FY2025-26.pdf", "ABC_Annual_Report.pdf", 6)
test_file("backend/uploads/doc_38769ba9_99240041335 (1).pdf", "Single_Page_Statement.pdf", 1)
test_file("backend/uploads/doc_1184a37c_FINCHECK_AI_Sample_Financial_Report_02.pdf", "Sample_Financial_Report_02.pdf", 8)
print("ALL REAL PDF PAGE COUNTS EXTRACTED WITH 100% ACCURACY!")
