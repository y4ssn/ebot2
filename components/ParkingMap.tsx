import React, { useState, useEffect } from 'react';
import { Car, Navigation, MapPin } from 'lucide-react';
import { PARKING_LEVEL_1 } from '../constants';
import { ParkingSpot } from '../types';

export const ParkingMap: React.FC<{ isGuest?: boolean }> = ({ isGuest = false }) => {
  const [spots, setSpots] = useState<ParkingSpot[]>(PARKING_LEVEL_1);
  const [guiding, setGuiding] = useState(false);
  const [assignedSpot, setAssignedSpot] = useState<string | null>(isGuest ? '105' : null);

  useEffect(() => {
    if (isGuest && !guiding) {
        // Auto-start guidance for guest
        setTimeout(() => setGuiding(true), 500);
    }
  }, [isGuest, guiding]);

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-2xl overflow-hidden text-white shadow-xl fade-in relative">
      <div className="p-6 border-b border-slate-800 bg-slate-900 z-10">
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <div className="p-2 bg-sky-500/20 rounded-lg">
                    <Navigation className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                    <h2 className="font-mono text-lg tracking-widest text-white">LEVEL B1 // GUIDANCE</h2>
                    <p className="text-xs text-slate-400">{isGuest ? 'VISITOR ACCESS GRANTED' : 'RESIDENT PARKING'}</p>
                </div>
            </div>
            {isGuest && (
                <div className="px-3 py-1 bg-sky-500 text-white text-xs font-bold rounded-full animate-pulse">
                    ASSIGNED: #105
                </div>
            )}
        </div>
      </div>

      <div className="flex-1 relative bg-slate-950 p-8 flex items-center justify-center">
        {/* Floor Grid */}
        <div className="grid grid-cols-2 gap-12 relative w-full max-w-md">
            
            {/* Guidance Line SVG Layer */}
            {guiding && assignedSpot && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible">
                    <path 
                        d="M 100 300 L 100 150 L 300 150" 
                        fill="none" 
                        stroke="#0EA5E9" 
                        strokeWidth="4" 
                        strokeDasharray="10 10"
                        className="animate-pulse"
                    />
                    <circle cx="300" cy="150" r="6" fill="#0EA5E9" className="animate-ping" />
                </svg>
            )}

            {spots.map((spot, index) => {
                const isAssigned = spot.number === assignedSpot;
                return (
                    <div 
                        key={spot.id} 
                        className={`
                            relative h-24 rounded-xl border-2 border-dashed flex items-center justify-center transition-all duration-500
                            ${isAssigned 
                                ? 'border-sky-500 bg-sky-500/10 shadow-[0_0_20px_rgba(14,165,233,0.3)]' 
                                : spot.status === 'OCCUPIED' 
                                    ? 'border-slate-800 bg-slate-900' 
                                    : 'border-emerald-500/50 bg-emerald-500/5'
                            }
                        `}
                    >
                        <span className="absolute top-2 left-2 text-xs font-mono text-slate-500">#{spot.number}</span>
                        
                        {spot.status === 'OCCUPIED' ? (
                            <Car className="w-8 h-8 text-slate-700" />
                        ) : (
                            isAssigned ? (
                                <div className="flex flex-col items-center">
                                    <MapPin className="w-6 h-6 text-sky-400 mb-1 animate-bounce" />
                                    <span className="text-[10px] text-sky-400 font-bold tracking-wider">RESERVED</span>
                                </div>
                            ) : (
                                <span className="text-[10px] text-emerald-500 font-bold tracking-wider">OPEN</span>
                            )
                        )}
                        
                        {/* Floor Light Indicator */}
                        <div className={`
                            absolute bottom-0 left-0 right-0 h-1 mx-4 rounded-t-full
                            ${isAssigned ? 'bg-sky-500 shadow-[0_0_10px_#0EA5E9]' : spot.status === 'OCCUPIED' ? 'bg-red-500/50' : 'bg-emerald-500 shadow-[0_0_10px_#10B981]'}
                        `} />
                    </div>
                );
            })}
        </div>

        {/* Entrance Arrow */}
        <div className="absolute bottom-4 left-1/4 transform -translate-x-1/2 flex flex-col items-center opacity-50">
            <span className="text-xs text-slate-500 mb-1 tracking-widest">ENTRY</span>
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-slate-600"></div>
        </div>
      </div>
    </div>
  );
};