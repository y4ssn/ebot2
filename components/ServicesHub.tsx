import React, { useState } from 'react';
import { CreditCard, Droplets, QrCode, Wrench, CheckCircle, Calendar } from 'lucide-react';

interface ServicesHubProps {
  onOpenLens: () => void;
  onGenerateGuestKey: () => string;
}

export const ServicesHub: React.FC<ServicesHubProps> = ({ onOpenLens, onGenerateGuestKey }) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

  const handleOpenGuest = () => {
    setActiveModal('GUEST');
    // Generate a fresh key when opening the modal
    const key = onGenerateGuestKey();
    setGeneratedKey(key);
  };

  const ServiceCard = ({ icon, title, desc, onClick, color }: any) => (
    <div 
        onClick={onClick}
        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
    >
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color} transition-colors`}>
            {icon}
        </div>
        <h3 className="font-bold text-slate-800 mb-1">{title}</h3>
        <p className="text-sm text-slate-500 group-hover:text-slate-600">{desc}</p>
    </div>
  );

  return (
    <div className="h-full bg-slate-50/50 rounded-2xl overflow-y-auto fade-in">
        {/* Header */}
        <div className="p-8 pb-4">
            <h2 className="text-2xl font-light text-slate-900">Services Hub</h2>
            <p className="text-slate-400">Manage your residency essentials.</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8 pt-0">
            <ServiceCard 
                icon={<CreditCard className="w-6 h-6 text-emerald-600" />}
                color="bg-emerald-50 group-hover:bg-emerald-100"
                title="Pay Rent"
                desc="Balance: $4,200.00 due"
                onClick={() => setActiveModal('RENT')}
            />
            <ServiceCard 
                icon={<Droplets className="w-6 h-6 text-sky-600" />}
                color="bg-sky-50 group-hover:bg-sky-100"
                title="Book Pool"
                desc="Reserve a cabana or lane"
                onClick={() => setActiveModal('POOL')}
            />
            <ServiceCard 
                icon={<Calendar className="w-6 h-6 text-orange-600" />}
                color="bg-orange-50 group-hover:bg-orange-100"
                title="Tennis Court"
                desc="Check court availability"
                onClick={() => setActiveModal('TENNIS')}
            />
            <ServiceCard 
                icon={<QrCode className="w-6 h-6 text-purple-600" />}
                color="bg-purple-50 group-hover:bg-purple-100"
                title="Visitor Pass"
                desc="Generate entry codes"
                onClick={handleOpenGuest}
            />
            <ServiceCard 
                icon={<Wrench className="w-6 h-6 text-slate-600" />}
                color="bg-slate-100 group-hover:bg-slate-200"
                title="Maintenance"
                desc="Report issues via Lens"
                onClick={onOpenLens}
            />
        </div>

        {/* Modal Overlays */}
        {activeModal && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4" onClick={() => setActiveModal(null)}>
                <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl transform scale-100 animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
                    {activeModal === 'RENT' && (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Payment Successful</h3>
                            <p className="text-slate-500 mb-6">You have paid $4,200.00 for Unit 404.</p>
                            <button onClick={() => setActiveModal(null)} className="w-full bg-slate-900 text-white py-3 rounded-xl font-medium">Done</button>
                        </div>
                    )}
                    {activeModal === 'GUEST' && (
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-slate-900 mb-4">Visitor Access</h3>
                            <div className="bg-slate-900 p-6 rounded-xl mb-4">
                                <QrCode className="w-32 h-32 text-white mx-auto opacity-90" />
                            </div>
                            <p className="font-mono text-lg font-bold text-slate-800 tracking-widest mb-1">{generatedKey}</p>
                            <p className="text-xs text-slate-400 mb-6">Valid for 4 hours • Parking L1-105</p>
                            <button onClick={() => {navigator.clipboard.writeText(generatedKey || ''); setActiveModal(null);}} className="w-full bg-slate-100 text-slate-900 py-3 rounded-xl font-medium hover:bg-slate-200">Copy & Close</button>
                        </div>
                    )}
                    {(activeModal === 'POOL' || activeModal === 'TENNIS') && (
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Booking Confirmed</h3>
                            <p className="text-slate-500 mb-6">Your reservation for {activeModal === 'POOL' ? 'Pool Cabana 4' : 'Court 2'} is set for Today at 5:00 PM.</p>
                            <button onClick={() => setActiveModal(null)} className="w-full bg-sky-500 text-white py-3 rounded-xl font-medium">Add to Calendar</button>
                        </div>
                    )}
                </div>
            </div>
        )}
    </div>
  );
};
