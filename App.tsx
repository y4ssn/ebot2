import React, { useState, useEffect } from 'react';
import { UserRole } from './types';
import { AuraChat } from './components/AuraChat';
import { LensFeature } from './components/LensFeature';
import { ManagerDashboard } from './components/ManagerDashboard';
import { ParkingMap } from './components/ParkingMap';
import { CommunityBoard } from './components/CommunityBoard';
import { ServicesHub } from './components/ServicesHub';
import { LayoutGrid, Eye, MessageSquare, LogOut, Map, Users, Shield, Key, Lock, ChevronRight, Loader2 } from 'lucide-react';

// --- AUTH MOCK DATA ---
const VALID_RESIDENTS = ['Yassin', 'Rashwan', 'Mostafa'];
const PASSWORD = 'emarabot';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ name: string; role: UserRole } | null>(null);
  const [guestKeys, setGuestKeys] = useState<string[]>(['G-8821-X']); // Initial mock key
  const [residentView, setResidentView] = useState<'aura' | 'services' | 'community' | 'map' | 'lens'>('services');

  // --- LOADING EFFECT ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // --- GUEST KEY HANDLER ---
  const handleGenerateGuestKey = () => {
    const newKey = `G-${Math.floor(1000 + Math.random() * 9000)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
    setGuestKeys(prev => [...prev, newKey]);
    return newKey;
  };

  // --- LOGIN HANDLER ---
  const handleLogin = (userType: 'RESIDENT' | 'ADMIN' | 'GUEST', credentials: any) => {
    // Artificial Delay for realism
    setIsLoading(true);
    setTimeout(() => {
      if (userType === 'ADMIN') {
        if (credentials.username === 'admin' && credentials.password === PASSWORD) {
          setCurrentUser({ name: 'Administrator', role: UserRole.MANAGER });
        } else {
          alert('Invalid Admin Credentials');
        }
      } else if (userType === 'RESIDENT') {
        if (VALID_RESIDENTS.includes(credentials.username) && credentials.password === PASSWORD) {
          setCurrentUser({ name: credentials.username, role: UserRole.RESIDENT });
        } else {
          alert('Invalid Resident Credentials');
        }
      } else if (userType === 'GUEST') {
        if (guestKeys.includes(credentials.accessCode)) {
          setCurrentUser({ name: 'Visitor', role: UserRole.GUEST });
        } else {
          alert('Invalid Access Code');
        }
      }
      setIsLoading(false);
    }, 800);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setResidentView('services');
  };

  // --- RENDER: LOADING SCREEN ---
  if (isLoading && !currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] opacity-10 bg-cover bg-center" />
        <div className="z-10 flex flex-col items-center animate-in fade-in duration-700 zoom-in-95">
          {/* Logo Placeholder - In a real app, use <img src="/logo.png" /> */}
          <div className="w-24 h-24 mb-8 relative">
             <div className="absolute inset-0 bg-sky-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
             <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current">
                <path d="M50 0 L100 25 L100 75 L50 100 L0 75 L0 25 Z" className="fill-slate-800 stroke-sky-500 stroke-2" />
                <path d="M50 20 L80 35 L80 65 L50 80 L20 65 L20 35 Z" className="fill-slate-900 stroke-sky-400 stroke-1" />
                <circle cx="50" cy="50" r="10" className="fill-sky-500 animate-pulse" />
             </svg>
          </div>
          <h1 className="text-4xl font-light tracking-[0.2em] text-white mb-2 font-sans">EMARABOT</h1>
          <p className="text-sky-500 text-xs tracking-widest uppercase">Innovate With Intelligence</p>
          <div className="mt-12 flex space-x-1">
            <div className="w-1 h-1 bg-sky-500 rounded-full animate-bounce delay-75" />
            <div className="w-1 h-1 bg-sky-500 rounded-full animate-bounce delay-150" />
            <div className="w-1 h-1 bg-sky-500 rounded-full animate-bounce delay-300" />
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER: LOGIN SCREEN ---
  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // --- RENDER: APP VIEWS ---
  
  // Guest View
  if (currentUser.role === UserRole.GUEST) {
      return (
          <div className="min-h-screen bg-[#F8FAFC] flex flex-col p-4 md:p-8 font-sans">
              <Header title="Welcome, Visitor" sub="Access Code Verified" onBack={handleLogout} />
              <div className="flex-1 max-w-3xl mx-auto w-full mt-8 flex flex-col space-y-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                      <h2 className="text-lg font-bold text-slate-900 mb-2">Directions to Unit 404</h2>
                      <p className="text-slate-500 text-sm">Please park in your assigned spot below. Use Elevator Bank B to the 4th Floor.</p>
                  </div>
                  <div className="h-96">
                      <ParkingMap isGuest={true} />
                  </div>
              </div>
          </div>
      );
  }

  // Resident View
  if (currentUser.role === UserRole.RESIDENT) {
      return (
          <div className="min-h-screen bg-[#F8FAFC] flex flex-col p-4 md:p-6 font-sans">
              <Header title={`Good Evening, ${currentUser.name}`} sub="Penthouse Collection" onBack={handleLogout} />
              
              <div className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 overflow-hidden h-[calc(100vh-140px)]">
                  {/* Navigation Sidebar */}
                  <div className="lg:col-span-2 flex flex-col space-y-2 overflow-y-auto">
                      <NavButton 
                        active={residentView === 'services'} 
                        onClick={() => setResidentView('services')}
                        icon={<LayoutGrid className="w-5 h-5" />}
                        label="Services"
                      />
                      <NavButton 
                        active={residentView === 'aura'} 
                        onClick={() => setResidentView('aura')}
                        icon={<MessageSquare className="w-5 h-5" />}
                        label="Concierge"
                      />
                      <NavButton 
                        active={residentView === 'community'} 
                        onClick={() => setResidentView('community')}
                        icon={<Users className="w-5 h-5" />}
                        label="Community"
                      />
                      <NavButton 
                        active={residentView === 'map'} 
                        onClick={() => setResidentView('map')}
                        icon={<Map className="w-5 h-5" />}
                        label="Parking"
                      />
                       <NavButton 
                        active={residentView === 'lens'} 
                        onClick={() => setResidentView('lens')}
                        icon={<Eye className="w-5 h-5" />}
                        label="The Lens"
                      />
                  </div>

                  {/* Content Area */}
                  <div className="lg:col-span-10 h-full overflow-hidden">
                      {residentView === 'services' && <ServicesHub onOpenLens={() => setResidentView('lens')} onGenerateGuestKey={handleGenerateGuestKey} />}
                      {residentView === 'aura' && <AuraChat />}
                      {residentView === 'community' && <CommunityBoard />}
                      {residentView === 'map' && <ParkingMap />}
                      {residentView === 'lens' && <LensFeature />}
                  </div>
              </div>
          </div>
      );
  }

  // Manager View
  return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col p-4 md:p-8 font-sans">
          <Header title="Command Center // MANAGER" sub="System Integrity: 99.9%" onBack={handleLogout} />
          <div className="flex-1 max-w-7xl mx-auto w-full mt-6">
              <ManagerDashboard />
          </div>
      </div>
  );
}

// --- SUB-COMPONENTS ---

const LoginScreen = ({ onLogin }: { onLogin: (type: 'RESIDENT' | 'ADMIN' | 'GUEST', creds: any) => void }) => {
  const [activeTab, setActiveTab] = useState<'RESIDENT' | 'GUEST' | 'ADMIN'>('RESIDENT');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [accessCode, setAccessCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'GUEST') {
      onLogin('GUEST', { accessCode });
    } else {
      onLogin(activeTab, { username, password });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
        {/* Background Abstract */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
             <div className="absolute -top-[20%] -right-[20%] w-[800px] h-[800px] rounded-full bg-gradient-to-br from-blue-200 to-purple-200 blur-3xl" />
             <div className="absolute top-[60%] -left-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-sky-200 to-emerald-100 blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl border border-slate-100">
            <div className="text-center mb-8">
               <h2 className="text-2xl font-light text-slate-900 tracking-tight">The Plaza</h2>
               <p className="text-slate-400 text-xs tracking-widest uppercase mt-1">Operating System</p>
            </div>

            <div className="flex mb-6 bg-slate-100 p-1 rounded-xl">
              <button onClick={() => {setActiveTab('RESIDENT'); setUsername(''); setPassword('');}} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'RESIDENT' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>RESIDENT</button>
              <button onClick={() => {setActiveTab('GUEST'); setAccessCode('');}} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'GUEST' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>GUEST</button>
              <button onClick={() => {setActiveTab('ADMIN'); setUsername(''); setPassword('');}} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'ADMIN' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>ADMIN</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === 'GUEST' ? (
                <div>
                   <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Guest Access Key</label>
                   <div className="relative">
                      <Key className="absolute left-3 top-3 w-5 h-5 text-slate-300" />
                      <input 
                        type="text" 
                        value={accessCode}
                        onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all placeholder-slate-300 font-mono"
                        placeholder="G-XXXX-X"
                      />
                   </div>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Username</label>
                    <div className="relative">
                        <Users className="absolute left-3 top-3 w-5 h-5 text-slate-300" />
                        <input 
                          type="text" 
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all placeholder-slate-300"
                          placeholder={activeTab === 'ADMIN' ? 'admin' : 'Yassin'}
                        />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-300" />
                        <input 
                          type="password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all placeholder-slate-300"
                          placeholder="••••••••"
                        />
                    </div>
                  </div>
                </>
              )}

              <button 
                type="submit" 
                className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-slate-800 transform hover:-translate-y-0.5 transition-all mt-4 flex items-center justify-center group"
              >
                <span>Enter System</span>
                <ChevronRight className="w-4 h-4 ml-1 opacity-50 group-hover:opacity-100 transition-opacity" />
              </button>
            </form>
            
            <div className="mt-8 text-center">
               <p className="text-[10px] text-slate-400 uppercase tracking-widest">Powered by Emarabot</p>
            </div>
        </div>
    </div>
  );
};

const Header = ({ title, sub, onBack }: { title: string, sub?: string, onBack: () => void }) => (
    <div className="flex items-center justify-between max-w-7xl mx-auto w-full pb-4 border-b border-slate-200">
        <div>
            <h1 className="text-xl md:text-2xl font-light tracking-tight text-slate-900">{title}</h1>
            {sub && <p className="text-xs text-slate-400 tracking-widest mt-1 uppercase">{sub}</p>}
        </div>
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-red-500 group flex items-center space-x-2">
            <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">LOGOUT</span>
            <LogOut className="w-5 h-5" />
        </button>
    </div>
);

const NavButton = ({ active, onClick, icon, label }: any) => (
    <button 
        onClick={onClick}
        className={`text-left p-4 rounded-xl transition-all duration-200 flex items-center space-x-3 ${
            active 
            ? 'bg-white shadow-md text-slate-900 ring-1 ring-slate-100' 
            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
        }`}
    >
        <div className={`${active ? 'text-sky-500' : 'text-slate-400'}`}>
            {icon}
        </div>
        <span className="font-medium text-sm">{label}</span>
    </button>
);
