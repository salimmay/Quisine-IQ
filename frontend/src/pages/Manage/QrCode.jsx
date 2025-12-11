import { useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { QRCodeSVG } from "qrcode.react";
import { Printer, Download, Copy, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export default function ManageQr() {
  const { user } = useAuth();
  const [tableCount, setTableCount] = useState(10);
  const printRef = useRef();

  // The base URL for your public menu
  // In production, change this to your actual domain (e.g., https://quisine-iq.com)
  const baseUrl = `http://192.168.1.24:5173/menu/${user?.userId}`;

  // Helper: Download single QR
  const downloadQr = (tableNum) => {
    const svg = document.getElementById(`qr-code-${tableNum}`);
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      
      const downloadLink = document.createElement("a");
      downloadLink.download = `Table-${tableNum}-QR.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
    toast.success(`Downloaded QR for Table ${tableNum}`);
  };

  // Helper: Handle Browser Print
  const handlePrint = () => {
    window.print();
  };

  const copyLink = (tableNum) => {
    const link = `${baseUrl}?table=${tableNum}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard");
  };

  return (
    <div className="space-y-8 pb-24">
      
      {/* --- Controls Section (Hidden when printing) --- */}
      <div className="print:hidden space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">QR Code Generator</h1>
                <p className="text-slate-500">Create and print QR codes for your tables.</p>
            </div>
            <div className="flex gap-2">
                 <Button variant="outline" onClick={handlePrint}>
                    <Printer className="mr-2 h-4 w-4" /> Print All
                 </Button>
            </div>
        </div>

        {/* Configuration Card */}
        <Card>
            <CardHeader><CardTitle>Configuration</CardTitle></CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <div className="flex justify-between">
                        <Label>Number of Tables: {tableCount}</Label>
                    </div>
                    <Slider 
                        defaultValue={[10]} 
                        max={50} 
                        step={1} 
                        value={[tableCount]}
                        onValueChange={(val) => setTableCount(val[0])}
                        className="bg-orange-600 w-full border-orange-600 border-2 rounded-lg"
                    />
                </div>
                
                <div className="flex items-center gap-4">
                    <Label className="shrink-0">Manual Override:</Label>
                    <Input 
                        type="number" 
                        value={tableCount} 
                        onChange={(e) => setTableCount(Number(e.target.value))} 
                        className="w-24"
                    />
                </div>
            </CardContent>
        </Card>
      </div>

      {/* --- QR Grid (Visible in Print) --- */}
      <div ref={printRef} className="print:w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 print:grid-cols-3 print:gap-4">
            {Array.from({ length: tableCount }).map((_, i) => {
                const tableNum = i + 1;
                const qrUrl = `${baseUrl}?table=${tableNum}`;

                return (
                    <Card key={tableNum} className="flex flex-col items-center justify-between shadow-sm border-2 border-slate-100 hover:border-orange-200 transition-colors print:border-slate-900 print:break-inside-avoid">
                        <div className="bg-orange-600 w-full py-2 text-center text-white font-bold print:bg-black print:text-white">
                            TABLE {tableNum}
                        </div>
                        
                        <div className="p-6 bg-white">
                            <QRCodeSVG 
                                id={`qr-code-${tableNum}`}
                                value={qrUrl}
                                size={150}
                                level={"H"} // High Error Correction
                                includeMargin={true}
                            />
                        </div>

                        <div className="pb-4 text-xs font-mono text-slate-400 print:hidden">
                            Scan to Order
                        </div>

                        {/* Action Buttons (Hidden when Printing) */}
                        <div className="w-full grid grid-cols-2 border-t print:hidden">
                            <button 
                                onClick={() => downloadQr(tableNum)}
                                className="flex items-center justify-center py-3 hover:bg-slate-50 text-slate-600 border-r"
                                title="Download PNG"
                            >
                                <Download size={16} />
                            </button>
                            <button 
                                onClick={() => copyLink(tableNum)}
                                className="flex items-center justify-center py-3 hover:bg-slate-50 text-slate-600"
                                title="Copy Link"
                            >
                                <Copy size={16} />
                            </button>
                        </div>
                    </Card>
                );
            })}
        </div>
      </div>

      {/* --- Print Styles --- */}
      <style>{`
        @media print {
          /* Hide Sidebar, Header, Buttons */
          nav, aside, header, .print\\:hidden {
            display: none !important;
          }

          /* Reset Layout for Paper */
          body, main, .main-content {
            margin: 0;
            padding: 0;
            background: white;
            height: auto;
            width: auto;
            overflow: visible;
          }

          /* Grid Layout for A4 Paper */
          .grid {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 1rem !important;
          }

          /* Ensure cards look good on paper */
          .border-2 {
            border: 1px solid #000 !important;
          }
        }
      `}</style>
    </div>
  );
}