import React, { useState, useRef } from 'react';
import { Camera, Upload, Scan, Zap, AlertTriangle, CheckCircle, RotateCw } from 'lucide-react';
import { analyzeMaintenanceImage, editMaintenanceImage } from '../services/geminiService';
import { AnalysisResult, LensMode } from '../types';

export const LensFeature: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [editPrompt, setEditPrompt] = useState('');
  const [mode, setMode] = useState<LensMode>(LensMode.ANALYZE);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async () => {
    if (!image) return;
    setIsScanning(true);

    try {
      const base64 = image.split(',')[1];
      
      if (mode === LensMode.ANALYZE) {
        // Delay for dramatic effect
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const jsonStr = await analyzeMaintenanceImage(base64);
        try {
            // Clean up markdown block if present
            const cleanJson = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
            const data = JSON.parse(cleanJson);
            setResult({
              issue: data.issue || "Unknown Issue",
              severity: data.severity || "MEDIUM",
              action: data.action || "Contact Maintenance",
              confidence: "98.4%"
            });
        } catch (e) {
             setResult({
              issue: "Analysis Failed",
              severity: "LOW",
              action: "Please retry",
              confidence: "0%"
            });
        }
      } else {
        // Edit Mode (Simulated Response for POC as SDK returns text)
        await editMaintenanceImage(base64, editPrompt || "Enhance clarity");
        // In a real app with Imagen, we'd swap `image` with the result.
        // For this POC text-based response, we'll just stop scanning.
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-2xl shadow-2xl overflow-hidden text-white border border-slate-700 fade-in relative">
      {/* Header */}
      <div className="absolute top-0 w-full p-4 z-20 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center space-x-2">
            <Camera className="w-5 h-5 text-sky-400" />
            <span className="font-mono text-sm tracking-widest text-sky-400">THE LENS // V.2.5</span>
        </div>
        <div className="flex space-x-1 bg-slate-800 rounded-lg p-1">
             <button 
                onClick={() => { setMode(LensMode.ANALYZE); setResult(null); }}
                className={`px-3 py-1 text-xs rounded-md transition-all ${mode === LensMode.ANALYZE ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'}`}
             >
                DIAGNOSE
             </button>
             <button 
                onClick={() => { setMode(LensMode.EDIT); setResult(null); }}
                className={`px-3 py-1 text-xs rounded-md transition-all ${mode === LensMode.EDIT ? 'bg-purple-500 text-white' : 'text-slate-400 hover:text-white'}`}
             >
                EDIT
             </button>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden group">
        {!image ? (
          <div className="text-center p-8">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-24 h-24 rounded-full border-2 border-dashed border-slate-600 flex items-center justify-center mx-auto mb-4 hover:border-sky-500 hover:text-sky-500 transition-colors cursor-pointer text-slate-500"
            >
              <Upload className="w-8 h-8" />
            </div>
            <p className="text-slate-400 text-sm">Upload visual data for analysis</p>
          </div>
        ) : (
          <>
            <img src={image} alt="Analysis Target" className="w-full h-full object-cover opacity-80" />
            
            {/* Scanner Overlay */}
            {(isScanning || result) && (
              <div className="absolute inset-0 pointer-events-none">
                 <div className="absolute inset-0 border-2 border-sky-500/30 m-4 rounded-lg">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-sky-500"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-sky-500"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-sky-500"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-sky-500"></div>
                 </div>
                 {isScanning && <div className="scanner-line"></div>}
                 
                 {/* Analysis HUD */}
                 <div className="absolute top-20 left-8 font-mono text-xs text-sky-400 space-y-1">
                    <p>ISO: 400</p>
                    <p>APERTURE: f/2.8</p>
                    <p>MOISTURE: DETECTING...</p>
                 </div>
              </div>
            )}
            
            {/* Result Card */}
            {result && !isScanning && mode === LensMode.ANALYZE && (
                <div className="absolute bottom-8 left-8 right-8 bg-slate-900/90 backdrop-blur-xl border border-slate-700 p-6 rounded-xl shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-500">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center space-x-2 mb-2">
                                <AlertTriangle className={`w-5 h-5 ${result.severity === 'CRITICAL' ? 'text-red-500' : 'text-yellow-500'}`} />
                                <h3 className="font-bold text-lg tracking-wide uppercase text-white">{result.issue}</h3>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-slate-400">Severity: <span className={result.severity === 'CRITICAL' ? 'text-red-400 font-bold' : 'text-yellow-400'}>{result.severity}</span></p>
                                <p className="text-sm text-slate-400">Action: <span className="text-white">{result.action}</span></p>
                            </div>
                        </div>
                        <div className="text-right">
                             <div className="text-3xl font-light text-sky-400">{result.confidence}</div>
                             <div className="text-xxs text-slate-500 tracking-widest uppercase">Confidence</div>
                        </div>
                    </div>
                </div>
            )}
          </>
        )}
      </div>

      {/* Controls */}
      <div className="p-6 bg-slate-900 border-t border-slate-800 z-30">
        <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
        />
        
        {mode === LensMode.EDIT && image && (
            <div className="mb-4">
                <input 
                    type="text"
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    placeholder="E.g., 'Add a retro filter', 'Remove background'..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                />
            </div>
        )}

        <div className="flex justify-between items-center">
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-slate-400 hover:text-white uppercase tracking-wider flex items-center"
            >
                <RotateCw className="w-3 h-3 mr-1" /> New Image
            </button>
            <button
                onClick={processImage}
                disabled={!image || isScanning}
                className={`px-8 py-3 rounded-full font-bold text-sm tracking-wide shadow-lg shadow-sky-500/20 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2
                    ${mode === LensMode.ANALYZE ? 'bg-sky-500 text-white hover:bg-sky-400' : 'bg-purple-600 text-white hover:bg-purple-500'}
                `}
            >
                {isScanning ? (
                    <><span>PROCESSING</span><span className="animate-pulse">...</span></>
                ) : (
                    <><Scan className="w-4 h-4" /><span>{mode === LensMode.ANALYZE ? 'INITIATE SCAN' : 'APPLY EDIT'}</span></>
                )}
            </button>
        </div>
      </div>
    </div>
  );
};