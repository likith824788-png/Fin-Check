import urllib.request
import json

def run_tests():
    print("=== Testing FinCheck AI Endpoints ===")
    
    # 1. Download Test
    url = "http://127.0.0.1:8000/api/documents/doc_001/download"
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200, f"Expected 200, got {resp.status}"
        ctype = resp.headers.get("Content-Type", "")
        disp = resp.headers.get("Content-Disposition", "")
        body = resp.read()
        print(f" [PASS] Download doc_001: Status {resp.status}, Content-Type: {ctype}, Size: {len(body)} bytes")
        assert "application/pdf" in ctype, f"Expected pdf, got {ctype}"
        assert body.startswith(b"%PDF"), "Response is not a valid PDF binary"

    # 2. Document Page Accuracy
    url = "http://127.0.0.1:8000/api/documents"
    with urllib.request.urlopen(url) as resp:
        docs = json.loads(resp.read().decode())
        print(f" [PASS] Retrieved {len(docs)} documents")
        for d in docs:
            p = d.get("pages")
            fn = d.get("fileName")
            assert p is not None and p > 0, f"Document {fn} has invalid page count: {p}"
            print(f"       -> {fn}: {p} pages")

    # 3. Facts Accuracy & Clamping
    url = "http://127.0.0.1:8000/api/facts"
    with urllib.request.urlopen(url) as resp:
        facts = json.loads(resp.read().decode())
        print(f" [PASS] Retrieved {len(facts)} financial facts")
        for f in facts:
            p = f.get("page")
            doc_id = f.get("documentId")
            assert p is not None and p > 0, f"Fact has invalid page: {p}"
        print(f"       -> All {len(facts)} facts have valid positive pages")

    # 4. Findings Categorization (4 distinct categories)
    url = "http://127.0.0.1:8000/api/findings"
    with urllib.request.urlopen(url) as resp:
        findings = json.loads(resp.read().decode())
        statuses = set(f.get("status") for f in findings)
        print(f" [PASS] Retrieved {len(findings)} findings with statuses: {statuses}")
        assert "unresolved_discrepancy" in statuses or "inconsistent" in statuses, "Missing inconsistent status"
        assert "explained_difference" in statuses, "Missing explained difference status"
        assert "potential_issue" in statuses, "Missing potential issue status"
        assert "unmatched_case" in statuses, "Missing unmatched case status"

    print("\nALL FEATURE CHECKS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    run_tests()
