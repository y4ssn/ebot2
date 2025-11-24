import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Bot } from 'lucide-react';
import { ChatMessage } from '../types';
import { chatWithAura } from '../services/geminiService';

export const AuraChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: "Good evening, Mr. Stark. The Plaza OS is online. How may I assist you tonight?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    try {
      // Convert to Gemini history format
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await chatWithAura(userMsg.text, history);

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      // Error handled in service, but fallback here
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 fade-in">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <h2 className="font-medium text-slate-800 tracking-wide">AURA <span className="text-slate-400 text-xs">ONLINE</span></h2>
        </div>
        <Sparkles className="w-4 h-4 text-sky-500" />
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide" ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-slate-900 text-white rounded-br-none' 
                : 'bg-slate-100 text-slate-800 rounded-bl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex justify-start">
            <div className="bg-sky-50 text-sky-700 rounded-2xl rounded-bl-none p-4 text-sm flex items-center space-x-2 border border-sky-100">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
              </span>
              <span>Thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex items-center space-x-2 bg-slate-50 rounded-full px-4 py-2 border border-slate-200 focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500 transition-all">
          <input 
            type="text" 
            className="flex-1 bg-transparent border-none focus:ring-0 text-slate-800 placeholder-slate-400 text-sm"
            placeholder="Ask about amenities, guests, or services..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isThinking}
            className="p-2 bg-slate-900 text-white rounded-full hover:bg-slate-800 disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="flex space-x-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
            <button onClick={() => setInput("Is the gym busy?")} className="text-xs bg-white border border-slate-200 px-3 py-1 rounded-full text-slate-600 hover:border-sky-400 hover:text-sky-600 transition-colors whitespace-nowrap">Gym Status</button>
            <button onClick={() => setInput("Prepare a guest pass for John Doe")} className="text-xs bg-white border border-slate-200 px-3 py-1 rounded-full text-slate-600 hover:border-sky-400 hover:text-sky-600 transition-colors whitespace-nowrap">Visitor Pass</button>
            <button onClick={() => setInput("Book a massage for tomorrow")} className="text-xs bg-white border border-slate-200 px-3 py-1 rounded-full text-slate-600 hover:border-sky-400 hover:text-sky-600 transition-colors whitespace-nowrap">Spa Reservation</button>
        </div>
      </div>
    </div>
  );
};