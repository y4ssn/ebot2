import React, { useState, useEffect } from 'react';
import { Activity, Users, MessageSquare, Zap, Check, ChevronRight } from 'lucide-react';
import { polishDiplomaticText } from '../services/geminiService';
import { INITIAL_TICKETS } from '../constants';

export const ManagerDashboard: React.FC = () => {
  const [sentiment, setSentiment] = useState(87);
  const [activeTab, setActiveTab] = useState<'overview' | 'diplomat'>('overview');
  const [diplomatInput, setDiplomatInput] = useState("Pool closed, cleaning.");
  const [diplomatOutput, setDiplomatOutput] = useState("");
  const [isPolishing, setIsPolishing] = useState(false);

  // Sentiment Fluctuation Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setSentiment(prev => {
        const change = Math.random() > 0.5 ? 1 : -1;
        return Math.min(Math.max(prev + change, 80), 95);
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handlePolish = async () => {
    setIsPolishing(true);
    const polished = await polishDiplomaticText(diplomatInput);
    // Typewriter effect for output
    setDiplomatOutput("");
    let i = 0;
    const typeInterval = setInterval(() => {
        setDiplomatOutput(polished.substring(0, i + 1));
        i++;
        if (i === polished.length) {
            clearInterval(typeInterval);
            setIsPolishing(false);
        }
    }, 20); // Fast typing speed
  };

  return (
    <div className="h-full flex flex-col space-y-6 fade-in">
      {/* Top Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-rose-50 rounded-lg text-rose-600"><Activity className="w-5 h-5" /></div>
                <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-1 rounded-full">+2.4%</span>
            </div>
            <div>
                <p className="text-sm text-slate-500 font-medium">Community Mood</p>
                <div className="flex items-end space-x-2">
                    <h3 className="text-3xl font-bold text-slate-900">{sentiment}%</h3>
                </div>
            </div>
            <div className="mt-3 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 transition-all duration-1000 ease-out" style={{ width: `${sentiment}%` }}></div>
            </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Users className="w-5 h-5" /></div>
            </div>
            <div>
                <p className="text-sm text-slate-500 font-medium">Active Residents</p>
                <h3 className="text-3xl font-bold text-slate-900">142</h3>
            </div>
        </div>

        <div 
            onClick={() => setActiveTab('diplomat')}
            className={`p-6 rounded-2xl border shadow-sm flex flex-col justify-between cursor-pointer transition-all ${activeTab === 'diplomat' ? 'bg-slate-900 text-white border-slate-900 ring-2 ring-slate-900 ring-offset-2' : 'bg-white border-slate-100 hover:border-slate-300'}`}
        >
             <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${activeTab === 'diplomat' ? 'bg-slate-800 text-white' : 'bg-purple-50 text-purple-600'}`}><MessageSquare className="w-5 h-5" /></div>
                <Zap className={`w-4 h-4 ${activeTab === 'diplomat' ? 'text-yellow-400' : 'text-slate-300'}`} />
            </div>
            <div>
                <p className={`text-sm font-medium ${activeTab === 'diplomat' ? 'text-slate-400' : 'text-slate-500'}`}>AI Diplomat</p>
                <h3 className="text-xl font-bold">Compose Update</h3>
            </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col md:flex-row">
        
        {/* Sidebar / Menu */}
        <div className="w-full md:w-64 bg-slate-50 border-r border-slate-100 p-6 space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Management</h4>
            <button onClick={() => setActiveTab('overview')} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}>Overview</button>
            <button onClick={() => setActiveTab('diplomat')} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'diplomat' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}>Diplomat AI</button>
        </div>

        {/* Viewport */}
        <div className="flex-1 p-8 overflow-y-auto">
            {activeTab === 'overview' ? (
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-slate-900">Active Tickets</h2>
                    <div className="space-y-3">
                        {INITIAL_TICKETS.map(ticket => (
                            <div key={ticket.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-shadow">
                                <div className="flex items-center space-x-4">
                                    <div className={`w-2 h-2 rounded-full ${ticket.severity === 'CRITICAL' ? 'bg-red-500' : ticket.severity === 'MEDIUM' ? 'bg-yellow-500' : 'bg-blue-500'}`} />
                                    <div>
                                        <h4 className="font-semibold text-slate-800">{ticket.title}</h4>
                                        <p className="text-sm text-slate-500">{ticket.area} • {ticket.id}</p>
                                    </div>
                                </div>
                                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">{ticket.status}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="h-full flex flex-col space-y-6">
                     <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-purple-600" />
                            AI Diplomat
                        </h2>
                        <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">GEMINI 3 PRO</span>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                        <div className="flex flex-col space-y-2">
                            <label className="text-sm font-medium text-slate-500">Draft Input (Rough)</label>
                            <textarea 
                                className="flex-1 p-4 bg-slate-50 border-0 rounded-2xl resize-none focus:ring-2 focus:ring-purple-500 transition-all text-slate-700 placeholder-slate-400"
                                placeholder="Enter rough notes here..."
                                value={diplomatInput}
                                onChange={(e) => setDiplomatInput(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label className="text-sm font-medium text-slate-500">Polished Output</label>
                            <div className="flex-1 p-4 bg-white border border-slate-200 rounded-2xl relative">
                                {diplomatOutput ? (
                                    <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">{diplomatOutput}</p>
                                ) : (
                                    <p className="text-slate-300 italic">Waiting for input...</p>
                                )}
                                {isPolishing && (
                                     <div className="absolute bottom-4 right-4">
                                         <div className="flex space-x-1">
                                             <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                                             <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
                                             <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-200"></div>
                                         </div>
                                     </div>
                                )}
                            </div>
                        </div>
                     </div>

                     <div className="flex justify-end">
                         <button 
                            onClick={handlePolish}
                            disabled={isPolishing || !diplomatInput}
                            className="bg-slate-900 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none flex items-center space-x-2"
                         >
                            <Zap className="w-4 h-4" />
                            <span>Run AI Polish</span>
                         </button>
                     </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};