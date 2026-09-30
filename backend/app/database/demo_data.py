"""
FINCHECK AI - Realistic Enterprise Demo Dataset for Acme Industries
Matches the exact metrics, documents, facts, and findings from the specification.
"""
from typing import List, Dict, Any

def get_demo_documents() -> List[Dict[str, Any]]:
    return [
        {
            "documentId": "doc_001",
            "companyId": "company_001",
            "fileName": "Annual_Report_2026.pdf",
            "documentType": "Annual Report",
            "period": "FY2026",
            "fileSize": 14500000,
            "pages": 148,
            "pageCount": 148,
            "status": "analyzed",
            "progress": 100,
            "factCount": 142,
            "findingCount": 18,
            "createdAt": "2026-09-15T09:30:00Z"
        },
        {
            "documentId": "doc_002",
            "companyId": "company_001",
            "fileName": "Management_Commentary.pdf",
            "documentType": "Commentary",
            "period": "FY2026",
            "fileSize": 3800000,
            "pages": 32,
            "pageCount": 32,
            "status": "analyzed",
            "progress": 100,
            "factCount": 64,
            "findingCount": 14,
            "createdAt": "2026-09-18T14:15:00Z"
        },
        {
            "documentId": "doc_003",
            "companyId": "company_001",
            "fileName": "Q4_Financials.pdf",
            "documentType": "Quarterly Report",
            "period": "Q4 2026",
            "fileSize": 5200000,
            "pages": 24,
            "pageCount": 24,
            "status": "analyzed",
            "progress": 100,
            "factCount": 88,
            "findingCount": 10,
            "createdAt": "2026-09-20T11:00:00Z"
        },
        {
            "documentId": "doc_004",
            "companyId": "company_001",
            "fileName": "Auditor_Report_2026.pdf",
            "documentType": "Audit Report",
            "period": "FY2026",
            "fileSize": 4100000,
            "pages": 18,
            "pageCount": 18,
            "status": "analyzed",
            "progress": 100,
            "factCount": 72,
            "findingCount": 8,
            "createdAt": "2026-09-25T16:45:00Z"
        },
        {
            "documentId": "doc_005",
            "companyId": "company_001",
            "fileName": "Segment_Reporting_FY26.pdf",
            "documentType": "Notes & Schedules",
            "period": "FY2026",
            "fileSize": 2100000,
            "pages": 14,
            "pageCount": 14,
            "status": "analyzed",
            "progress": 100,
            "factCount": 34,
            "findingCount": 4,
            "createdAt": "2026-09-26T10:10:00Z"
        },
        {
            "documentId": "doc_006",
            "companyId": "company_001",
            "fileName": "Cash_Flow_Schedule_2026.xlsx",
            "documentType": "Spreadsheet",
            "period": "FY2026",
            "fileSize": 1850000,
            "pages": 4,
            "pageCount": 4,
            "status": "analyzed",
            "progress": 100,
            "factCount": 26,
            "findingCount": 3,
            "createdAt": "2026-09-26T12:00:00Z"
        },
        {
            "documentId": "doc_007",
            "companyId": "company_001",
            "fileName": "Debt_Disclosures_FY26.pdf",
            "documentType": "Notes & Schedules",
            "period": "FY2026",
            "fileSize": 1900000,
            "pages": 12,
            "pageCount": 12,
            "status": "analyzed",
            "progress": 100,
            "factCount": 18,
            "findingCount": 2,
            "createdAt": "2026-09-27T08:20:00Z"
        },
        {
            "documentId": "doc_008",
            "companyId": "company_001",
            "fileName": "Board_Presentation_Q4.pdf",
            "documentType": "Presentation",
            "period": "Q4 2026",
            "fileSize": 6700000,
            "pages": 28,
            "pageCount": 28,
            "status": "analyzed",
            "progress": 100,
            "factCount": 21,
            "findingCount": 3,
            "createdAt": "2026-09-27T15:30:00Z"
        },
        {
            "documentId": "doc_009",
            "companyId": "company_001",
            "fileName": "Accounting_Policies_FY26.pdf",
            "documentType": "Policy Disclosure",
            "period": "FY2026",
            "fileSize": 1400000,
            "pages": 16,
            "pageCount": 16,
            "status": "analyzed",
            "progress": 100,
            "factCount": 7,
            "findingCount": 1,
            "createdAt": "2026-09-28T09:15:00Z"
        }
    ]

def get_demo_facts() -> List[Dict[str, Any]]:
    return [
        {
            "factId": "fact_001",
            "companyId": "company_001",
            "documentId": "doc_001",
            "fileName": "Annual_Report_2026.pdf",
            "metric": "Revenue",
            "value": 10000.0,
            "currency": "INR",
            "unit": "crore",
            "period": "FY2026",
            "scope": "consolidated",
            "statement": "income_statement",
            "page": 42,
            "section": "Statement of Profit and Loss",
            "evidence": "Revenue from operations: ₹10,000 crore (Note 24: Segment Revenue ₹9,820 Cr from manufacturing, ₹180 Cr from services)",
            "verificationStatus": "verified",
            "confidence": 0.99,
            "normalizedValue": 10000.0,
            "normalizedUnit": "crore",
            "notes": "Corroborated by Note 24 and statutory auditor signed schedule."
        },
        {
            "factId": "fact_002",
            "companyId": "company_001",
            "documentId": "doc_002",
            "fileName": "Management_Commentary.pdf",
            "metric": "Revenue",
            "value": 10500.0,
            "currency": "INR",
            "unit": "crore",
            "period": "FY2026",
            "scope": "consolidated",
            "statement": "management_discussion",
            "page": 8,
            "section": "Operating Performance & Revenue Highlights",
            "evidence": "Total consolidated revenue reached ₹10,500 Cr across all operating territories reflecting robust 12% expansion.",
            "verificationStatus": "verified",
            "confidence": 0.96,
            "normalizedValue": 10500.0,
            "normalizedUnit": "crore",
            "notes": "Narrative in CEO review cites ₹10,500 Cr; statutory schedule lists ₹10,000 Cr."
        },
        {
            "factId": "fact_003",
            "companyId": "company_001",
            "documentId": "doc_001",
            "fileName": "Annual_Report_2026.pdf",
            "metric": "EBITDA",
            "value": 2100.0,
            "currency": "INR",
            "unit": "crore",
            "period": "FY2026",
            "scope": "consolidated",
            "statement": "income_statement",
            "page": 43,
            "section": "Operating Metrics & Notes",
            "evidence": "Earnings before interest, taxes, depreciation and amortisation (EBITDA) is ₹2,100 crore.",
            "verificationStatus": "verified",
            "confidence": 0.98,
            "normalizedValue": 2100.0,
            "normalizedUnit": "crore"
        },
        {
            "factId": "fact_004",
            "companyId": "company_001",
            "documentId": "doc_002",
            "fileName": "Management_Commentary.pdf",
            "metric": "EBITDA",
            "value": 2100.0,
            "currency": "INR",
            "unit": "crore",
            "period": "FY2026",
            "scope": "consolidated",
            "statement": "management_discussion",
            "page": 9,
            "section": "EBITDA Margin Summary",
            "evidence": "Consolidated EBITDA delivered ₹2,100 Cr at a 20.0% operating margin.",
            "verificationStatus": "verified",
            "confidence": 0.98,
            "normalizedValue": 2100.0,
            "normalizedUnit": "crore"
        },
        {
            "factId": "fact_005",
            "companyId": "company_001",
            "documentId": "doc_001",
            "fileName": "Annual_Report_2026.pdf",
            "metric": "Net Profit",
            "value": 1200.0,
            "currency": "INR",
            "unit": "crore",
            "period": "FY2026",
            "scope": "consolidated",
            "statement": "income_statement",
            "page": 42,
            "section": "Statement of Profit and Loss",
            "evidence": "Profit for the period (PAT): ₹1,200 crore",
            "verificationStatus": "verified",
            "confidence": 0.99,
            "normalizedValue": 1200.0,
            "normalizedUnit": "crore"
        },
        {
            "factId": "fact_006",
            "companyId": "company_001",
            "documentId": "doc_003",
            "fileName": "Q4_Financials.pdf",
            "metric": "Net Profit",
            "value": 1200.0,
            "currency": "INR",
            "unit": "crore",
            "period": "FY2026",
            "scope": "consolidated",
            "statement": "income_statement",
            "page": 5,
            "section": "Annual Summary in Q4 Financials",
            "evidence": "Consolidated Net Profit for full fiscal year closed at ₹1,200 Cr.",
            "verificationStatus": "verified",
            "confidence": 0.99,
            "normalizedValue": 1200.0,
            "normalizedUnit": "crore"
        },
        {
            "factId": "fact_007",
            "companyId": "company_001",
            "documentId": "doc_001",
            "fileName": "Annual_Report_2026.pdf",
            "metric": "Total Assets",
            "value": 18450.0,
            "currency": "INR",
            "unit": "crore",
            "period": "FY2026",
            "scope": "consolidated",
            "statement": "balance_sheet",
            "page": 40,
            "section": "Balance Sheet",
            "evidence": "Total Assets: ₹18,450 crore comprising ₹11,200 Cr non-current and ₹7,250 Cr current.",
            "verificationStatus": "verified",
            "confidence": 0.99,
            "normalizedValue": 18450.0,
            "normalizedUnit": "crore"
        },
        {
            "factId": "fact_008",
            "companyId": "company_001",
            "documentId": "doc_004",
            "fileName": "Auditor_Report_2026.pdf",
            "metric": "Total Assets",
            "value": 18450.0,
            "currency": "INR",
            "unit": "crore",
            "period": "FY2026",
            "scope": "consolidated",
            "statement": "audit_report",
            "page": 12,
            "section": "Independent Auditor's Report",
            "evidence": "Total consolidated balance sheet assets verified at ₹18,450 crore.",
            "verificationStatus": "verified",
            "confidence": 0.99,
            "normalizedValue": 18450.0,
            "normalizedUnit": "crore"
        },
        {
            "factId": "fact_009",
            "companyId": "company_001",
            "documentId": "doc_001",
            "fileName": "Annual_Report_2026.pdf",
            "metric": "Operating Cash Flow",
            "value": 1820.0,
            "currency": "INR",
            "unit": "crore",
            "period": "FY2026",
            "scope": "consolidated",
            "statement": "cash_flow",
            "page": 44,
            "section": "Cash Flow Statement",
            "evidence": "Net Cash flows from operating activities ₹1,820 crore.",
            "verificationStatus": "verified",
            "confidence": 0.97,
            "normalizedValue": 1820.0,
            "normalizedUnit": "crore"
        },
        {
            "factId": "fact_010",
            "companyId": "company_001",
            "documentId": "doc_006",
            "fileName": "Cash_Flow_Schedule_2026.xlsx",
            "metric": "Operating Cash Flow",
            "value": 1820.0,
            "currency": "INR",
            "unit": "crore",
            "period": "FY2026",
            "scope": "consolidated",
            "statement": "cash_flow",
            "page": 2,
            "section": "Operational Cash Schedule",
            "evidence": "Consolidated Cash Flow from Operating Activities total: ₹1,820 crore.",
            "verificationStatus": "verified",
            "confidence": 0.98,
            "normalizedValue": 1820.0,
            "normalizedUnit": "crore"
        },
        {
            "factId": "fact_011",
            "companyId": "company_001",
            "documentId": "doc_001",
            "fileName": "Annual_Report_2026.pdf",
            "metric": "EPS",
            "value": 24.50,
            "currency": "INR",
            "unit": "per_share",
            "period": "FY2026",
            "scope": "consolidated",
            "statement": "income_statement",
            "page": 42,
            "section": "Earnings Per Equity Share",
            "evidence": "Basic and Diluted EPS for the year ₹24.50 per share.",
            "verificationStatus": "verified",
            "confidence": 0.99,
            "normalizedValue": 24.50,
            "normalizedUnit": "per_share"
        },
        {
            "factId": "fact_012",
            "companyId": "company_001",
            "documentId": "doc_003",
            "fileName": "Q4_Financials.pdf",
            "metric": "EPS",
            "value": 24.50,
            "currency": "INR",
            "unit": "per_share",
            "period": "FY2026",
            "scope": "consolidated",
            "statement": "income_statement",
            "page": 6,
            "section": "Consolidated Per Share Data",
            "evidence": "Annualized Basic EPS: ₹24.50.",
            "verificationStatus": "verified",
            "confidence": 0.99,
            "normalizedValue": 24.50,
            "normalizedUnit": "per_share"
        }
    ]
    for f in facts:
        f.setdefault("id", f["factId"])
        f.setdefault("document_id", f["documentId"])
        f.setdefault("document_name", f["fileName"])
        f.setdefault("originalValue", f.get("value", 0.0))
        f.setdefault("originalUnit", f.get("unit", "crore"))
        f.setdefault("normalizedValue", f.get("normalizedValue", f.get("value", 0.0)))
        f.setdefault("normalizedUnit", f.get("normalizedUnit", "crore"))
        f.setdefault("source_type", "financial_statement")
        f.setdefault("created_at", "2026-09-28T14:20:00Z")
        f.setdefault("updated_at", "2026-09-28T14:20:00Z")
        f.setdefault("extracted_by", "nemotron")
        f.setdefault("verified_by", "gemma")
        f.setdefault("verification_status", "verified")
        f.setdefault("verification_confidence", f.get("confidence", 0.98))
        f.setdefault("conflict_detected", False)
    return facts

def get_demo_findings() -> List[Dict[str, Any]]:
    findings = [
        {
            "findingId": "F-024",
            "companyId": "company_001",
            "metric": "Revenue",
            "period": "FY2026",
            "scope": "consolidated",
            "currency": "INR",
            "sourceA": {
                "documentId": "doc_001",
                "fileName": "Annual_Report_2026.pdf",
                "page": 42,
                "section": "Statement of Profit and Loss",
                "value": 10000.0,
                "unit": "crore",
                "currency": "INR",
                "evidence": "Revenue from operations: ₹10,000 crore (Note 24)"
            },
            "sourceB": {
                "documentId": "doc_002",
                "fileName": "Management_Commentary.pdf",
                "page": 8,
                "section": "Operating Performance & Highlights",
                "value": 10500.0,
                "unit": "crore",
                "currency": "INR",
                "evidence": "Total consolidated revenue reached ₹10,500 Cr across all operating territories."
            },
            "valueA": 10000.0,
            "valueB": 10500.0,
            "difference": 500.0,
            "percentageDifference": 5.0,
            "status": "potential_issue",
            "priority": "high",
            "hasExplanatoryDisclosure": False,
            "explanation": "The values differ by ₹500 Cr (5%). Both documents refer to the same reporting period (FY2026) and consolidated scope. No explanatory disclosure was identified in the supplied documents.",
            "recommendation": "Review revenue reconciliation between the Annual Report (Page 42) and Management Commentary (Page 8) with the corporate financial controller.",
            "evidence": [
                {
                    "evidenceId": "ev_001",
                    "documentId": "doc_001",
                    "fileName": "Annual_Report_2026.pdf",
                    "page": 42,
                    "section": "Statement of Profit and Loss",
                    "quote": "Revenue from operations ₹10,000 crore",
                    "relevance": "primary"
                },
                {
                    "evidenceId": "ev_002",
                    "documentId": "doc_002",
                    "fileName": "Management_Commentary.pdf",
                    "page": 8,
                    "section": "Operating Performance",
                    "quote": "Total consolidated revenue reached ₹10,500 Cr across all operating territories.",
                    "relevance": "comparison"
                }
            ],
            "createdAt": "2026-09-28T14:20:00Z"
        },
        {
            "findingId": "F-025",
            "companyId": "company_001",
            "metric": "EBITDA",
            "period": "FY2026",
            "scope": "consolidated",
            "currency": "INR",
            "sourceA": {
                "documentId": "doc_001",
                "fileName": "Annual_Report_2026.pdf",
                "page": 43,
                "section": "Operating Metrics & Notes",
                "value": 2100.0,
                "unit": "crore",
                "currency": "INR",
                "evidence": "EBITDA is ₹2,100 crore."
            },
            "sourceB": {
                "documentId": "doc_002",
                "fileName": "Management_Commentary.pdf",
                "page": 9,
                "section": "Operating Performance",
                "value": 2100.0,
                "unit": "crore",
                "currency": "INR",
                "evidence": "Consolidated EBITDA delivered ₹2,100 Cr at a 20.0% operating margin."
            },
            "valueA": 2100.0,
            "valueB": 2100.0,
            "difference": 0.0,
            "percentageDifference": 0.0,
            "status": "consistent",
            "priority": "low",
            "hasExplanatoryDisclosure": True,
            "explanation": "Consolidated EBITDA matches exactly at ₹2,100 Cr between the Annual Report (Page 43) and Management Commentary (Page 9).",
            "recommendation": "No discrepancy identified. Core operating profitability metrics align completely across publications.",
            "evidence": [
                {
                    "evidenceId": "ev_003",
                    "documentId": "doc_001",
                    "fileName": "Annual_Report_2026.pdf",
                    "page": 43,
                    "section": "Operating Metrics",
                    "quote": "Earnings before interest, taxes, depreciation and amortisation (EBITDA) is ₹2,100 crore.",
                    "relevance": "primary"
                }
            ],
            "createdAt": "2026-09-28T14:22:00Z"
        },
        {
            "findingId": "F-026",
            "companyId": "company_001",
            "metric": "Net Profit",
            "period": "FY2026",
            "scope": "consolidated",
            "currency": "INR",
            "sourceA": {
                "documentId": "doc_001",
                "fileName": "Annual_Report_2026.pdf",
                "page": 42,
                "section": "Statement of Profit and Loss",
                "value": 1200.0,
                "unit": "crore",
                "currency": "INR",
                "evidence": "Profit for the period (PAT): ₹1,200 crore"
            },
            "sourceB": {
                "documentId": "doc_003",
                "fileName": "Q4_Financials.pdf",
                "page": 5,
                "section": "Annual Summary in Q4 Financials",
                "value": 1200.0,
                "unit": "crore",
                "currency": "INR",
                "evidence": "Cumulative full-year consolidated PAT registered at ₹1,200 Cr."
            },
            "valueA": 1200.0,
            "valueB": 1200.0,
            "difference": 0.0,
            "percentageDifference": 0.0,
            "status": "consistent",
            "priority": "low",
            "hasExplanatoryDisclosure": True,
            "explanation": "Net Profit of ₹1,200 Cr is mathematically consistent across both the audited Annual Report and the Q4 full-year consolidation release.",
            "recommendation": "Documented consistency verified for bottom-line earnings.",
            "evidence": [
                {
                    "evidenceId": "ev_004",
                    "documentId": "doc_001",
                    "fileName": "Annual_Report_2026.pdf",
                    "page": 42,
                    "section": "Profit and Loss",
                    "quote": "Profit for the period (PAT): ₹1,200 crore",
                    "relevance": "primary"
                }
            ],
            "createdAt": "2026-09-28T14:23:00Z"
        },
        {
            "findingId": "F-027",
            "companyId": "company_001",
            "metric": "Operating Cash Flow",
            "period": "FY2026",
            "scope": "consolidated",
            "currency": "INR",
            "sourceA": {
                "documentId": "doc_001",
                "fileName": "Annual_Report_2026.pdf",
                "page": 44,
                "section": "Cash Flow Statement",
                "value": 1820.0,
                "unit": "crore",
                "currency": "INR",
                "evidence": "Net Cash flows from operating activities ₹1,820 crore."
            },
            "sourceB": {
                "documentId": "doc_006",
                "fileName": "Cash_Flow_Schedule_2026.xlsx",
                "page": 2,
                "section": "Operational Cash Schedule",
                "value": 1820.0,
                "unit": "crore",
                "currency": "INR",
                "evidence": "Consolidated Cash Flow from Operating Activities total: ₹1,820 crore."
            },
            "valueA": 1820.0,
            "valueB": 1820.0,
            "difference": 0.0,
            "percentageDifference": 0.0,
            "status": "consistent",
            "priority": "low",
            "hasExplanatoryDisclosure": True,
            "explanation": "Operating cash flow verified at ₹1,820 Cr in statutory cash flow statement and internal schedule.",
            "recommendation": "Confirmed consistent.",
            "evidence": [],
            "createdAt": "2026-09-28T14:25:00Z"
        },
        {
            "findingId": "F-028",
            "companyId": "company_001",
            "metric": "Borrowings",
            "period": "FY2026",
            "scope": "consolidated",
            "currency": "INR",
            "sourceA": {
                "documentId": "doc_001",
                "fileName": "Annual_Report_2026.pdf",
                "page": 48,
                "section": "Note 19: Long-term Borrowings",
                "value": 3400.0,
                "unit": "crore",
                "currency": "INR",
                "evidence": "Non-current term borrowings ₹3,400 crore."
            },
            "sourceB": {
                "documentId": "doc_007",
                "fileName": "Debt_Disclosures_FY26.pdf",
                "page": 4,
                "section": "Total Debt Profile",
                "value": 3650.0,
                "unit": "crore",
                "currency": "INR",
                "evidence": "Total consolidated indebtedness including lease liabilities: ₹3,650 Cr."
            },
            "valueA": 3400.0,
            "valueB": 3650.0,
            "difference": 250.0,
            "percentageDifference": 7.35,
            "status": "explained_difference",
            "priority": "low",
            "hasExplanatoryDisclosure": True,
            "explanation": "Values differ by ₹250 Cr (7.35%). Document Note 19 specifically details ₹250 Cr under IFRS 16 lease liability obligations excluded from standard bank term loans.",
            "recommendation": "Reconciliation established through Note 19 lease accounting disclosure.",
            "evidence": [],
            "createdAt": "2026-09-28T14:26:00Z"
        },
        {
            "findingId": "F-029",
            "companyId": "company_001",
            "metric": "Trade Receivables",
            "period": "FY2026",
            "scope": "consolidated",
            "currency": "INR",
            "sourceA": {
                "documentId": "doc_007",
                "fileName": "Debt_Disclosures_FY26.pdf",
                "page": 4,
                "section": "Note 11: Trade Receivables",
                "value": 4250.0,
                "unit": "crore",
                "currency": "INR",
                "evidence": "Total audited gross trade receivables: ₹4,250 crore."
            },
            "sourceB": {
                "documentId": "doc_008",
                "fileName": "Board_Presentation_Q4.pdf",
                "page": 9,
                "section": "Working Capital & Collections",
                "value": 4600.0,
                "unit": "crore",
                "currency": "INR",
                "evidence": "Total outstanding customer billings and trade receivables ₹4,600 Cr."
            },
            "valueA": 4250.0,
            "valueB": 4600.0,
            "difference": 350.0,
            "percentageDifference": 8.24,
            "direction": "higher",
            "status": "unresolved_discrepancy",
            "priority": "high",
            "hasExplanatoryDisclosure": False,
            "explanation": "Gross trade receivables reported in the Q4 Board presentation exceed the statutory note disclosure by ₹350 Cr (8.24%). No explanatory aging schedule was identified in the presentation.",
            "recommendation": "Request detailed customer aging schedule and expected credit loss (ECL) reconciliation from corporate controllership.",
            "evidence": [
                {
                    "evidenceId": "ev_029_1",
                    "documentId": "doc_007",
                    "fileName": "Debt_Disclosures_FY26.pdf",
                    "page": 4,
                    "section": "Note 11: Trade Receivables",
                    "quote": "Total audited gross trade receivables: ₹4,250 crore.",
                    "relevance": "primary"
                },
                {
                    "evidenceId": "ev_029_2",
                    "documentId": "doc_008",
                    "fileName": "Board_Presentation_Q4.pdf",
                    "page": 9,
                    "section": "Working Capital",
                    "quote": "Total outstanding customer billings and trade receivables ₹4,600 Cr.",
                    "relevance": "comparison"
                }
            ],
            "createdAt": "2026-09-28T14:30:00Z"
        },
        {
            "findingId": "F-030",
            "companyId": "company_001",
            "metric": "Corporate Guarantee Obligations",
            "period": "FY2026",
            "scope": "consolidated",
            "currency": "INR",
            "sourceA": {
                "documentId": "doc_001",
                "fileName": "Annual_Report_2026.pdf",
                "page": 58,
                "section": "Note 28: Contingent Liabilities & Commitments",
                "value": 850.0,
                "unit": "crore",
                "currency": "INR",
                "evidence": "Corporate guarantees extended on behalf of overseas manufacturing joint ventures total ₹850 crore."
            },
            "sourceB": {
                "documentId": "doc_002",
                "fileName": "Management_Commentary.pdf",
                "page": 1,
                "section": "General Risk Review",
                "value": 0.0,
                "unit": "crore",
                "currency": "INR",
                "evidence": "No corresponding contingent liability disclosure or commitment breakdown identified."
            },
            "valueA": 850.0,
            "valueB": 0.0,
            "difference": 850.0,
            "percentageDifference": 100.0,
            "direction": "unmatched",
            "status": "unmatched_case",
            "priority": "medium",
            "hasExplanatoryDisclosure": False,
            "explanation": "Off-balance sheet corporate guarantee obligations of ₹850 Cr disclosed in Note 28 have no corresponding disclosure in Management Commentary or presentations.",
            "recommendation": "Request cross-document exposure reconciliation from legal and corporate secretarial teams.",
            "evidence": [],
            "createdAt": "2026-09-28T14:32:00Z"
        },
        {
            "findingId": "F-031",
            "companyId": "company_001",
            "metric": "R&D Intangible Capitalization",
            "period": "FY2026",
            "scope": "consolidated",
            "currency": "INR",
            "sourceA": {
                "documentId": "doc_001",
                "fileName": "Annual_Report_2026.pdf",
                "page": 52,
                "section": "Note 14: Intangible Assets under Development",
                "value": 320.0,
                "unit": "crore",
                "currency": "INR",
                "evidence": "Internal development costs capitalized under Ind AS 38: ₹320 crore."
            },
            "sourceB": {
                "documentId": "doc_008",
                "fileName": "Board_Presentation_Q4.pdf",
                "page": 14,
                "section": "Capex Summary",
                "value": 0.0,
                "unit": "crore",
                "currency": "INR",
                "evidence": "Capital expenditure schedules omit specific capitalization of R&D intangibles."
            },
            "valueA": 320.0,
            "valueB": 0.0,
            "difference": 320.0,
            "percentageDifference": 100.0,
            "direction": "unmatched",
            "status": "unmatched_case",
            "priority": "medium",
            "hasExplanatoryDisclosure": False,
            "explanation": "R&D capitalization of ₹320 Cr is reported exclusively in statutory Note 14 with no cross-document verification in Board or investor summaries.",
            "recommendation": "Confirm whether R&D capitalization is included in gross physical capex figures.",
            "evidence": [],
            "createdAt": "2026-09-28T14:35:00Z"
        }
    ]
    for fd in findings:
        val_a = fd.get("valueA", 0.0)
        val_b = fd.get("valueB", 0.0)
        fd.setdefault("id", fd["findingId"])
        fd.setdefault("originalValueA", val_a)
        fd.setdefault("originalValueB", val_b)
        fd.setdefault("normalizedValueA", val_a)
        fd.setdefault("normalizedValueB", val_b)
        fd.setdefault("direction", "higher" if val_b > val_a else ("lower" if val_b < val_a else "equal"))
        fd.setdefault("calculated_by", "python_deterministic_engine")
        fd.setdefault("extracted_by", "nemotron")
        fd.setdefault("verified_by", "gemma")
        fd.setdefault("explained_by", "groq")
        fd.setdefault("verification_confidence", 0.96)
        
        # Section 7: Complete Evidence Chain
        src_a = fd.get("sourceA", {})
        src_b = fd.get("sourceB", {})
        diff = fd.get("difference", 0.0)
        pct = fd.get("percentageDifference", 0.0)
        metric = fd.get("metric", "Metric")
        
        fd.setdefault("evidenceChain", [
            {
                "step": 1,
                "title": "Source Documents Ingestion",
                "detail": f"{src_a.get('fileName', 'Doc A')} (Page {src_a.get('page', 1)}) & {src_b.get('fileName', 'Doc B')} (Page {src_b.get('page', 1)})"
            },
            {
                "step": 2,
                "title": "Verbatim Evidence Extraction",
                "detail": f"Extracted: '{src_a.get('evidence', '')[:65]}...' vs '{src_b.get('evidence', '')[:65]}...'"
            },
            {
                "step": 3,
                "title": "Unit & Currency Normalization",
                "detail": f"Both normalized to INR (Base Unit: Crore). Values: ₹{val_a:,.2f} Cr vs ₹{val_b:,.2f} Cr"
            },
            {
                "step": 4,
                "title": "Deterministic Calculation",
                "detail": f"Absolute variance: ₹{diff:,.2f} Cr | Percentage difference: {pct}% ({fd.get('direction', 'variance')})"
            },
            {
                "step": 5,
                "title": "Contextual Footnote Audit (Gemma)",
                "detail": "Explanatory disclosure substantiated" if fd.get("hasExplanatoryDisclosure") else "No reconciling disclosure identified in supplied records"
            },
            {
                "step": 6,
                "title": "Audit Classification Verdict",
                "detail": f"Classified as {fd.get('status', 'potential_issue').replace('_', ' ').title()} (Priority: {fd.get('priority', 'medium').upper()})"
            }
        ])

        # Section 13: Finding History / Audit Trail
        fd.setdefault("history", [
            {
                "timestamp": fd.get("createdAt", "2026-09-28T14:20:00Z"),
                "previousStatus": None,
                "newStatus": fd.get("status"),
                "reason": f"Automated dual-layer audit check generated: {metric} discrepancy of ₹{diff} Cr ({pct}%)",
                "document": src_b.get("fileName"),
                "actor": "System (Nemotron + Deterministic Engine)"
            }
        ])

        # Section 14: Analyst Comments
        fd.setdefault("comments", [
            {
                "commentId": f"com_{fd['findingId']}_1",
                "author": "Alex Mercer, CPA",
                "role": "Lead Auditor",
                "timestamp": "2026-09-28T15:00:00Z",
                "text": f"Reviewed {metric} comparison. Source citations verified on page {src_a.get('page')} and {src_b.get('page')}."
            }
        ])
    return findings
