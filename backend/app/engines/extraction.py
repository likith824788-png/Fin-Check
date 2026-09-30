"""
FINCHECK AI - Document Extraction & AI Pipeline Orchestrator
Strict Model Architecture:
PDF/Financial Document -> NVIDIA Nemotron (Primary Extraction) -> Python Deterministic Normalization -> Gemma (Secondary Verification)
"""
import os
import logging
from typing import List, Dict, Any, Tuple

from app.ai.nemotron import extract_financial_facts
from app.ai.gemma import verify_financial_facts
from app.engines.normalization import normalize_fact

logger = logging.getLogger("fincheck.extraction")

def extract_text_from_file(file_path: str, filename: str) -> Tuple[str, int]:
    """
    Extracts text and page count from PDF, DOCX, or XLSX files.
    """
    ext = os.path.splitext(filename)[1].lower()
    text_content = ""
    page_count = 1

    try:
        if ext == ".pdf":
            from pypdf import PdfReader
            reader = PdfReader(file_path)
            page_count = len(reader.pages)
            pages_text = []
            for idx, page in enumerate(reader.pages):
                pt = page.extract_text() or ""
                pages_text.append(f"--- PAGE {idx + 1} ---\n" + pt)
            text_content = "\n".join(pages_text)

        elif ext in [".docx", ".doc"]:
            import docx
            doc = docx.Document(file_path)
            paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
            text_content = "\n".join(paragraphs)
            page_count = max(1, len(paragraphs) // 10)

        elif ext in [".xlsx", ".xls"]:
            import openpyxl
            wb = openpyxl.load_workbook(file_path, data_only=True)
            sheet_texts = []
            for sheetname in wb.sheetnames:
                ws = wb[sheetname]
                rows = []
                for row in ws.iter_rows(values_only=True):
                    row_vals = [str(cell) for cell in row if cell is not None]
                    if row_vals:
                        rows.append(" | ".join(row_vals))
                sheet_texts.append(f"--- SHEET {sheetname} ---\n" + "\n".join(rows))
            text_content = "\n\n".join(sheet_texts)
            page_count = len(wb.sheetnames)
        else:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                text_content = f.read()
    except Exception as e:
        logger.error(f"Error extracting text from {filename}: {e}")
        text_content = f"Document content for {filename}."

    return text_content, page_count

async def run_document_analysis_pipeline(
    file_path: str,
    document_id: str,
    filename: str,
    period: str = "FY2026",
    progress_callback = None
) -> List[Dict[str, Any]]:
    """
    Executes the strictly ordered pipeline:
    1. Extract document text & layout
    2. NVIDIA NEMOTRON (Primary Model) -> Structured financial fact extraction
    3. PYTHON DETERMINISTIC ENGINE -> Normalization of values, units, periods
    4. GEMMA (Secondary Model) -> Independent fact verification & non-destructive conflict handling
    """
    if progress_callback:
        await progress_callback("Extracting document content", 20)
        
    text, pages = extract_text_from_file(file_path, filename)
    
    # Stage 2: NVIDIA NEMOTRON — PRIMARY MODEL
    if progress_callback:
        await progress_callback("NVIDIA Nemotron: Primary financial document understanding & fact extraction", 45)
        
    raw_facts = await extract_financial_facts(
        document_text=text,
        document_id=document_id,
        file_name=filename,
        period=period,
        page_count=pages
    )
    
    # Stage 3: PYTHON DETERMINISTIC ENGINE — Normalization
    if progress_callback:
        await progress_callback("Python Deterministic Engine: Normalizing units and values", 65)
        
    normalized_facts = []
    for fact in raw_facts:
        norm = normalize_fact(fact)
        # Guarantee page is strictly within real document page boundaries
        if pages and pages > 0:
            norm["page"] = max(1, min(int(norm.get("page") or 1), pages))
        # Ensure provenance is strictly recorded
        norm["extracted_by"] = "nemotron"
        normalized_facts.append(norm)

    # Stage 4: GEMMA — SECONDARY VERIFICATION MODEL
    if progress_callback:
        await progress_callback("Google Gemma: Secondary independent fact verification & conflict auditing", 85)
        
    verified_facts = await verify_financial_facts(
        facts=normalized_facts,
        context_snippet=text[:10000]
    )

    if progress_callback:
        await progress_callback("Pipeline complete: Facts indexed to Firestore", 100)
        
    return verified_facts
