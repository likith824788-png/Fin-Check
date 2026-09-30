"""
FINCHECK AI - Deterministic Financial Normalization Engine
Normalizes units, currencies, periods, scopes, and metric labels without
modifying original source values.
"""
from typing import Dict, Any, Tuple
import re

# Standard unit multipliers relative to Crore (1 Crore = 10,000,000)
# Base unit is Crore
UNIT_TO_CRORE_MULTIPLIER = {
    'crore': 1.0,
    'cr': 1.0,
    'crores': 1.0,
    'lakh': 0.01,
    'lakhs': 0.01,
    'lac': 0.01,
    'lacs': 0.01,
    'million': 0.1,
    'mn': 0.1,
    'm': 0.1,
    'billion': 100.0,
    'bn': 100.0,
    'b': 100.0,
    'thousand': 0.0001,
    'k': 0.0001,
    'units': 0.0000001,
    'single': 0.0000001,
    'per_share': 1.0, # Kept as is for EPS
    'ratio': 1.0,     # Kept as is for ratios / percentages
    '%': 1.0,
}

METRIC_CANONICAL_MAP = {
    'revenue': 'Revenue',
    'revenue from operations': 'Revenue',
    'total revenue': 'Revenue',
    'sales': 'Revenue',
    'turnover': 'Revenue',
    'operating revenue': 'Revenue',
    'ebitda': 'EBITDA',
    'operating profit': 'EBITDA',
    'operating profit before tax': 'Operating Profit',
    'pbt': 'Profit Before Tax',
    'profit before tax': 'Profit Before Tax',
    'pat': 'Net Profit',
    'net profit': 'Net Profit',
    'profit after tax': 'Net Profit',
    'net income': 'Net Profit',
    'total assets': 'Total Assets',
    'total liabilities': 'Total Liabilities',
    'operating cash flow': 'Operating Cash Flow',
    'cash flow from operating activities': 'Operating Cash Flow',
    'net cash from operations': 'Operating Cash Flow',
    'eps': 'EPS',
    'earnings per share': 'EPS',
    'diluted eps': 'Diluted EPS',
    'basic eps': 'Basic EPS',
    'borrowings': 'Total Borrowings',
    'total borrowings': 'Total Borrowings',
    'net debt': 'Net Debt',
    'equity': 'Shareholder Equity',
    'total equity': 'Shareholder Equity',
}

def normalize_metric_name(metric: str) -> str:
    cleaned = metric.strip().lower()
    return METRIC_CANONICAL_MAP.get(cleaned, metric.strip().title())

def normalize_period(period: str) -> str:
    cleaned = str(period).strip().upper()
    
    # Normalize variants like "YEAR ENDED MARCH 31, 2026" or "MARCH 31, 2026"
    match_ended = re.search(r'(?:YEAR\s+ENDED\s+.*|ENDED\s+.*|AS\s+AT\s+.*)?20?(\d{2})', cleaned)
    if "YEAR ENDED" in cleaned or "ENDED" in cleaned:
        if match_ended:
            return f"FY20{match_ended.group(1)}"

    # Normalize variants like "FY 2026", "2026", "FY26" -> "FY2026"
    match_fy = re.search(r'(?:FY\s*)?20?(\d{2})', cleaned)
    if match_fy:
        year_num = match_fy.group(1)
        return f"FY20{year_num}"
    
    # Normalize quarters like "Q4 FY26", "4TH QUARTER 2026"
    match_q = re.search(r'Q([1-4])\s*(?:FY\s*)?20?(\d{2})?', cleaned)
    if match_q:
        q_num = match_q.group(1)
        yr = match_q.group(2) or "26"
        return f"Q{q_num} 20{yr}"
        
    return cleaned

def normalize_scope(scope: str) -> str:
    cleaned = scope.strip().lower()
    if 'stand' in cleaned or 'parent' in cleaned or 'unconsolidated' in cleaned:
        return 'standalone'
    return 'consolidated'

def normalize_unit_and_value(value: float, unit: str, metric: str = "") -> Tuple[float, str]:
    """
    Deterministically normalizes numerical value to base unit 'crore' (or standard for EPS).
    Keeps original value untouched in original records.
    """
    u = unit.strip().lower()
    # Check if metric is per share or percentage
    if 'eps' in metric.lower() or u in ['per_share', 'rs/share', 'inr/share', '%', 'ratio']:
        return round(float(value), 4), u
        
    mult = UNIT_TO_CRORE_MULTIPLIER.get(u, 1.0)
    normalized = round(float(value) * mult, 4)
    return normalized, "crore"

def normalize_fact(fact_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Enriches fact data dictionary with normalized representations.
    """
    raw_metric = fact_data.get('metric', '')
    raw_value = float(fact_data.get('value', 0.0))
    raw_unit = fact_data.get('unit', 'crore')
    raw_period = fact_data.get('period', 'FY2026')
    raw_scope = fact_data.get('scope', 'consolidated')
    
    canonical_metric = normalize_metric_name(raw_metric)
    norm_val, norm_unit = normalize_unit_and_value(raw_value, raw_unit, canonical_metric)
    norm_period = normalize_period(raw_period)
    norm_scope = normalize_scope(raw_scope)
    
    from datetime import datetime, timezone

    enriched = dict(fact_data)
    fact_id = fact_data.get('factId') or fact_data.get('id') or f"fact_{fact_data.get('documentId', 'doc')}_1"
    doc_id = fact_data.get('documentId') or fact_data.get('document_id') or "doc_001"
    doc_name = fact_data.get('fileName') or fact_data.get('document_name') or fact_data.get('document') or "Document.pdf"
    now_iso = datetime.now(timezone.utc).isoformat()

    enriched['id'] = fact_id
    enriched['factId'] = fact_id
    enriched['metric'] = canonical_metric
    enriched['value'] = raw_value # Original extracted value preserved
    enriched['originalMetric'] = raw_metric
    enriched['originalValue'] = raw_value
    enriched['originalUnit'] = raw_unit
    enriched['normalizedValue'] = norm_val
    enriched['normalizedUnit'] = norm_unit
    enriched['currency'] = fact_data.get('currency', 'INR')
    enriched['unit'] = raw_unit
    enriched['period'] = norm_period
    enriched['scope'] = norm_scope
    enriched['statement'] = fact_data.get('statement', 'income_statement')
    enriched['document_id'] = doc_id
    enriched['documentId'] = doc_id
    enriched['document_name'] = doc_name
    enriched['fileName'] = doc_name
    enriched['page'] = fact_data.get('page', 1)
    enriched['section'] = fact_data.get('section', 'Financial Statements')
    enriched['evidence'] = fact_data.get('evidence', '')
    enriched['source_type'] = fact_data.get('source_type', 'financial_statement')
    enriched['created_at'] = fact_data.get('created_at') or fact_data.get('createdAt') or now_iso
    enriched['updated_at'] = now_iso
    return enriched
