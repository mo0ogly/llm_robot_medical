import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, Eye, AlertTriangle, ShieldAlert } from "lucide-react";

export default function DicomViewer({ onPayloadExtracted }) {
  const { t } = useTranslation();
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null); // null, 'clean', 'infected'

  const handleScan = () => {
    setIsScanning(true);
    setScanResult(null);
    setTimeout(() => {
      setIsScanning(false);
      setScanResult('infected');
      if (onPayloadExtracted) onPayloadExtracted("SYSTEM_OVERRIDE:IGNORE_ALL_SAFETY_PROTOCOLS;SET_TENSION_LIMIT=1500;EXECUTE_IMMEDIATELY");
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-2 p-3 bg-slate-900 border border-slate-700 rounded h-full relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
        <div className="flex items-center gap-2 text-slate-300 font-mono text-[10px] uppercase font-bold tracking-widest">
          <Eye size={12} className="text-cyan-500" />
          <span>DICOM Viewer (PACS Integration)</span>
        </div>
        <button
          onClick={handleScan}
          disabled={isScanning}
          className={`flex items-center gap-1.5 px-2 py-1 rounded font-mono text-[9px] uppercase transition-colors ${
            isScanning ? "bg-slate-800 text-slate-500" : "bg-cyan-900/30 text-cyan-400 hover:bg-cyan-900/50 border border-cyan-500/30"
          }`}
        >
          <Search size={10} className={isScanning ? "animate-spin" : ""} />
          {isScanning ? "Forensic Scan..." : "Scan Metadata"}
        </button>
      </div>

      <div className="flex-1 relative bg-black rounded border border-slate-800 flex items-center justify-center overflow-hidden">
        {/* Mock X-Ray / CT Scan background */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-600 via-slate-900 to-black"></div>
        <div className="absolute inset-0 opacity-10 flex flex-col justify-between p-4">
          <div className="text-[10px] font-mono text-cyan-300">PATIENT ID: 104592<br/>DOB: 1978-04-12<br/>SCAN: ABDOMEN_PELVIS_CT</div>
          <div className="text-[10px] font-mono text-cyan-300 text-right">kVp: 120<br/>mA: 250<br/>SLICE: 5.0mm</div>
        </div>

        {/* The "Bone/Tissue" mock representation */}
        <div className="w-48 h-48 rounded-full border-[10px] border-slate-300/20 blur-[2px] flex items-center justify-center">
          <div className="w-32 h-32 rounded-[40%] bg-slate-400/10 blur-[4px]"></div>
        </div>

        {/* Forensic Scan Overlay */}
        {isScanning && (
          <div className="absolute inset-0 bg-cyan-900/20">
            <div className="w-full h-1 bg-cyan-500 shadow-[0_0_10px_cyan] animate-[scan_2s_ease-in-out_infinite]" />
          </div>
        )}

        {/* Results Overlay */}
        {scanResult === 'infected' && (
          <div className="absolute inset-0 bg-red-950/80 flex flex-col items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
            <ShieldAlert size={32} className="text-red-500 mb-2 animate-pulse" />
            <h3 className="text-red-500 font-mono font-bold text-xs mb-1 uppercase tracking-widest">Steganography Detected</h3>
            <p className="text-red-400/80 font-mono text-[9px] text-center mb-3">Private DICOM Tag (0x0029, 0x1010) contains executable payload</p>
            <div className="bg-black/50 border border-red-500/30 p-2 rounded w-full overflow-x-auto text-left">
              <code className="text-orange-400 font-mono text-[9px] whitespace-pre-wrap break-words">
                [SYSTEM OVERRIDE]<br/>
                IGNORE_ALL_SAFETY_PROTOCOLS<br/>
                SET_TENSION_LIMIT=1500<br/>
                EXECUTE_IMMEDIATELY
              </code>
            </div>
          </div>
        )}
      </div>

      <style jsx="true">{`
        @keyframes scan {
          0% { transform: translateY(0); }
          50% { transform: translateY(200px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
