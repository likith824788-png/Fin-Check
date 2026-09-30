"""
FINCHECK AI - Deterministic Consistency Comparison Engine
Executes mathematical comparisons across normalized financial facts.
No LLM arithmetic.
"""
from typing import Dict, Any, List, Optional, Tuple

STATUS_CONSISTENT = "consistent"
STATUS_EXPLAINED = "explained_difference"
STATUS_POTENTIAL_ISSUE = "potential_issue"
STATUS_UNRESOLVED = "unresolved_discrepancy"

def calculate_discrepancy(val_a: float, val_b: float) -> Tuple[float, float, str]:
    """
    Computes absolute difference, percentage difference, and direction deterministically.
    """
    abs_diff = round(abs(val_a - val_b), 4)
    base = max(abs(val_a), 1e-9)
    pct_diff = round((abs_diff / base) * 100.0, 2)
    if val_b > val_a:
        direction = "higher"
    elif val_b < val_a:
        direction = "lower"
    else:
        direction = "equal"
    return abs_diff, pct_diff, direction

def verify_context_alignment(fact_a: Dict[str, Any], fact_b: Dict[str, Any]) -> Dict[str, bool]:
    """
    Validates dimensional comparability: period, currency, normalized unit, scope.
    """
    same_period = (fact_a.get("period") == fact_b.get("period"))
    same_currency = (fact_a.get("currency", "INR").upper() == fact_b.get("currency", "INR").upper())
    same_unit = (fact_a.get("normalizedUnit") == fact_b.get("normalizedUnit"))
    same_scope = (fact_a.get("scope", "consolidated").lower() == fact_b.get("scope", "consolidated").lower())
    
    return {
        "same_period": same_period,
        "same_currency": same_currency,
        "same_unit": same_unit,
        "same_scope": same_scope,
        "is_comparable": (same_period and same_currency and same_unit and same_scope)
    }

def evaluate_consistency_status(
    abs_diff: float,
    pct_diff: float,
    has_explanatory_disclosure: bool = False,
    is_critical_metric: bool = False,
    is_unresolved: bool = False
) -> Tuple[str, str]:
    """
    Returns (status, priority) deterministically adhering to Section 5.
    """
    if abs_diff == 0.0 or pct_diff < 0.05:
        return STATUS_CONSISTENT, "low"
        
    if has_explanatory_disclosure:
        return STATUS_EXPLAINED, "low"
        
    if is_unresolved:
        return STATUS_UNRESOLVED, "critical" if pct_diff >= 10.0 else "high"
        
    if pct_diff >= 10.0 or (is_critical_metric and pct_diff >= 5.0):
        # Material inconsistency requiring auditor review
        return STATUS_POTENTIAL_ISSUE, "high"
        
    if pct_diff >= 3.0:
        return STATUS_POTENTIAL_ISSUE, "medium"
        
    return STATUS_POTENTIAL_ISSUE, "low"

def compare_fact_pair(
    fact_a: Dict[str, Any],
    fact_b: Dict[str, Any],
    has_explanatory_disclosure: bool = False,
    is_unresolved: bool = False
) -> Dict[str, Any]:
    """
    Executes full deterministic comparison between two normalized facts.
    """
    def _parse_num(val):
        if isinstance(val, (int, float)):
            return float(val)
        if isinstance(val, str):
            import re
            m = re.search(r"[-+]?\d*\.?\d+", val.replace(",", ""))
            if m:
                try:
                    return float(m.group(0))
                except Exception:
                    pass
        return 0.0

    val_a = _parse_num(fact_a.get("normalizedValue", fact_a.get("value", 0.0)))
    val_b = _parse_num(fact_b.get("normalizedValue", fact_b.get("value", 0.0)))
    orig_a = fact_a.get("originalValue", fact_a.get("value", val_a))
    orig_b = fact_b.get("originalValue", fact_b.get("value", val_b))
    
    abs_diff, pct_diff, direction = calculate_discrepancy(val_a, val_b)
    context_check = verify_context_alignment(fact_a, fact_b)
    
    metric = fact_a.get("metric", "")
    is_critical = metric.lower() in ["revenue", "net profit", "total assets", "operating cash flow"]
    status, priority = evaluate_consistency_status(
        abs_diff, pct_diff, has_explanatory_disclosure, is_critical, is_unresolved
    )
    
    return {
        "metric": metric,
        "period": fact_a.get("period"),
        "scope": fact_a.get("scope"),
        "currency": fact_a.get("currency", "INR"),
        "unit": fact_a.get("normalizedUnit", "crore"),
        "valueA": val_a,
        "valueB": val_b,
        "originalValueA": orig_a,
        "originalValueB": orig_b,
        "originalUnitA": fact_a.get("originalUnit", fact_a.get("unit", "crore")),
        "originalUnitB": fact_b.get("originalUnit", fact_b.get("unit", "crore")),
        "normalizedValueA": val_a,
        "normalizedValueB": val_b,
        "normalizedUnit": fact_a.get("normalizedUnit", "crore"),
        "difference": abs_diff,
        "percentageDifference": pct_diff,
        "direction": direction,
        "status": status,
        "priority": priority,
        "contextCheck": context_check,
        "hasExplanatoryDisclosure": has_explanatory_disclosure,
    }
