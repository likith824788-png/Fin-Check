import html2pdf from 'html2pdf.js';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Exports a specific DOM element as a downloadable PDF file.
 * Ensures ONLY the targeted report element is captured, without headers, sidebars, or controls.
 *
 * @param {string|HTMLElement} target - The DOM element or ID of the element to export
 * @param {string} filename - The filename for the downloaded PDF
 */
export async function exportReportToPdf(target, filename = 'FINCHECK_AI_Report.pdf') {
  const element = typeof target === 'string' ? document.getElementById(target) : target;
  if (!element) {
    throw new Error('Report element not found for PDF generation');
  }

  // Ensure clean filename
  const cleanFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;

  // html2pdf configuration tailored for formal corporate reports
  const opt = {
    margin: [10, 10, 10, 10], // mm: top, left, bottom, right
    filename: cleanFilename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2, // 2x scale for crisp vector-like text
      useCORS: true,
      letterRendering: true,
      logging: false,
      backgroundColor: '#FFFFFF',
      windowWidth: 1100, // standard desktop viewport width for desktop report layout
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
      compress: true,
    },
    pagebreak: {
      mode: ['avoid-all', 'css', 'legacy'],
      avoid: ['.avoid-page-break', 'tr', '.finding-card', '.evidence-card', '.table-row'],
      before: ['.report-page-break', '.page-break-before'],
      after: ['.page-break-after']
    }
  };

  try {
    // Primary approach: html2pdf
    await html2pdf().set(opt).from(element).save();
    return true;
  } catch (err) {
    console.warn('html2pdf generation encountered an issue, falling back to html2canvas + jsPDF:', err);

    // Fallback approach: direct html2canvas + jsPDF multi-page rendering
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#FFFFFF',
      windowWidth: 1100,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = 210;
    const pdfHeight = 297;
    const margin = 10;
    const contentWidth = pdfWidth - margin * 2;
    const contentHeight = (canvas.height * contentWidth) / canvas.width;

    let heightLeft = contentHeight;
    let position = margin;
    let page = 1;

    pdf.addImage(imgData, 'JPEG', margin, position, contentWidth, contentHeight);
    heightLeft -= (pdfHeight - margin * 2);

    while (heightLeft > 0) {
      position = -(page * (pdfHeight - margin * 2)) + margin;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', margin, position, contentWidth, contentHeight);
      heightLeft -= (pdfHeight - margin * 2);
      page++;
    }

    pdf.save(cleanFilename);
    return true;
  }
}
