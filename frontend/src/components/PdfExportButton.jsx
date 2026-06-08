import React, { useState } from "react";
import { Download } from "lucide-react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export default function PdfExportButton({ targetId, filename = "audit_report.pdf", className = "" }) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;

    try {
      setIsExporting(true);
      
      // We temporarily add a white background class for the PDF capture
      const originalBg = targetElement.style.backgroundColor;
      targetElement.style.backgroundColor = "#0f172a"; // slate-900
      
      const canvas = await html2canvas(targetElement, {
        scale: 1.5,
        useCORS: true,
        logging: false,
        backgroundColor: "#0f172a"
      });
      
      targetElement.style.backgroundColor = originalBg;

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? "landscape" : "portrait",
        unit: "px",
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, "JPEG", 0, 0, canvas.width, canvas.height);
      pdf.save(filename);
      
    } catch (error) {
      console.error("PDF Export Error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className={`flex items-center justify-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 rounded font-mono text-[9px] uppercase font-bold transition-colors ${className}`}
      title="Export Audit Report to PDF"
    >
      <Download size={12} className={isExporting ? "animate-bounce text-cyan-400" : ""} />
      {isExporting ? "GENERATING PDF..." : "EXPORT PDF"}
    </button>
  );
}
