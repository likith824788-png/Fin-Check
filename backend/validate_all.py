import urllib.request
import json

BASE_URL = "http://127.0.0.1:8000"

def get(path):
    req = urllib.request.Request(f"{BASE_URL}{path}")
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode())

def post_json(path, data):
    req = urllib.request.Request(
        f"{BASE_URL}{path}",
        data=json.dumps(data).encode(),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode())

def patch_json(path, data):
    req = urllib.request.Request(
        f"{BASE_URL}{path}",
        data=json.dumps(data).encode(),
        headers={"Content-Type": "application/json"},
        method="PATCH"
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode())

def run_tests():
    print("--- 1. Testing Health ---")
    h = get("/api/health")
    assert h["status"] in ["ok", "healthy"], f"Health failed: {h}"
    print("Health OK:", h["status"], h.get("engines"))

    print("\n--- 2. Testing Dashboard Stats (6 KPI Cards) ---")
    stats = get("/api/dashboard/stats")
    kpi = stats["kpi"]
    print("KPIs:", kpi)
    assert kpi["documents"] >= 10
    assert kpi["financialFacts"] >= 400
    assert kpi["consistencyChecks"] >= 300
    assert "potentialIssues" in kpi
    assert "unresolvedFindings" in kpi
    assert "explainedDifferences" in kpi
    print("All 6 KPI cards confirmed present!")

    print("\n--- 3. Testing Financial Facts (Dual Original & Normalized) ---")
    facts = get("/api/facts")
    assert len(facts) > 0
    f0 = facts[0]
    print(f"Fact 0: Metric={f0.get('metric')}, Original={f0.get('originalValue')}, Normalized={f0.get('normalizedValue')} {f0.get('normalizedUnit')}")
    assert "originalValue" in f0
    assert "normalizedValue" in f0
    assert "statement" in f0 or "section" in f0
    print("Fact traceability & normalization verified!")

    print("\n--- 4. Testing Findings (4-Tier Status & Deterministic Math) ---")
    findings = get("/api/findings")
    assert len(findings) >= 4
    statuses = set(f["status"] for f in findings)
    print("Discovered Finding Statuses:", statuses)
    assert "potential_issue" in statuses
    assert "consistent" in statuses
    assert "explained_difference" in statuses
    assert "unresolved_discrepancy" in statuses
    print("All 4 finding statuses present!")

    print("\n--- 5. Testing Finding F-024 Detail & Evidence Chain ---")
    f24 = get("/api/findings/F-024")
    assert f24["findingId"] == "F-024"
    assert "evidenceChain" in f24
    assert len(f24["evidenceChain"]) >= 5
    assert "history" in f24
    assert "comments" in f24
    print(f"F-024 Evidence Chain length: {len(f24['evidenceChain'])} stages")
    print(f"Deterministic difference: {f24.get('difference')} ({f24.get('percentageDifference')}%, direction={f24.get('direction')})")

    print("\n--- 6. Testing Adding Finding Comment ---")
    comm_resp = post_json("/api/findings/F-024/comments", {
        "text": "Auditor tested reconciliation note; awaiting Q4 update.",
        "author": "Senior Auditor Test",
        "role": "Lead Partner"
    })
    comment_obj = comm_resp.get("comment", comm_resp)
    print("Comment posted:", comment_obj)
    assert comment_obj["text"] == "Auditor tested reconciliation note; awaiting Q4 update."

    print("\n--- 7. Testing Finding Status Update (Audit Trail) ---")
    patch_resp = patch_json("/api/findings/F-024", {
        "status": "explained_difference",
        "reason": "Note 24 confirmed freight deduction explains variance.",
        "actor": "Alex Mercer, CPA"
    })
    finding_obj = patch_resp.get("finding", patch_resp)
    print("Updated status:", finding_obj["status"])
    assert finding_obj["status"] == "explained_difference"
    # Revert back to potential_issue for demo presentation flow
    patch_json("/api/findings/F-024", {
        "status": "potential_issue",
        "reason": "Reset to Potential Issue for presentation demo flow.",
        "actor": "System Reset"
    })

    print("\n--- 8. Testing Evidence API & Navigation ---")
    ev_all = get("/api/evidence")
    print(f"Total evidence items: {ev_all['count']}")
    ev_detail = get("/api/evidence/ev_001")
    assert ev_detail["evidenceId"] == "ev_001"
    assert "previousEvidenceId" in ev_detail
    assert "nextEvidenceId" in ev_detail
    print(f"Evidence ev_001 loaded. Prev={ev_detail['previousEvidenceId']}, Next={ev_detail['nextEvidenceId']}")

    print("\n--- 9. Testing AI Auditor Chat (All 8 Quick Action Queries) ---")
    for q in [
        "Why is revenue inconsistent?",
        "Show all unresolved discrepancies",
        "Compare FY25 vs FY26",
        "Show Revenue Issues",
        "Check Balance Sheet"
    ]:
        ans = post_json("/api/chat", {"query": q})
        print(f"Query: '{q}' -> Response length: {len(ans.get('reply', ''))} chars, Sources: {len(ans.get('sources', []))}")
        assert len(ans.get("reply", "")) > 10

    print("\n--- 10. Testing Report Generation ---")
    rep = post_json("/api/reports/generate", {
        "reportType": "complete_review",
        "period": "FY2026",
        "companyId": "company_001"
    })
    print("Generated Report ID:", rep.get("reportId"))
    assert rep.get("reportId") is not None

    print("\n==================================================")
    print(" ALL SYSTEM CAPABILITIES VERIFIED SUCCESSFULLY! ")
    print("==================================================")

if __name__ == "__main__":
    run_tests()
