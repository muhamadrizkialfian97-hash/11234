import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, Bot, User, Loader2, Sparkles, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { askGemini } from '../services/geminiService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function AIChat() {
  const data = useData();
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      role: 'assistant', 
      content: 'Halo! Saya Pancaran Concise AI. Saya memberikan informasi logistik secara singkat, jelas, dan padat. Silakan tanyakan data operasional atau analisis finansial Anda.' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await askGemini(input, data);
      const assistantMessage: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: response };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: 'Kesalahan teknis. Coba lagi.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col bg-slate-50 border border-slate-200 rounded-xl shadow-sm overflow-hidden font-sans">
      {/* Header */}
      <div className="p-3 border-b border-slate-200 bg-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-slate-900 rounded-md">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
              Concise AI Assistant <Sparkles className="w-3 h-3 text-blue-500" />
            </h3>
            <p className="text-[9px] text-slate-400 font-mono">MODE: SINGKAT & PADAT</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-bold border border-blue-100">
            <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" />
            READY
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8f9fa]">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-3 max-w-[90%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "w-7 h-7 rounded flex items-center justify-center flex-shrink-0 border",
                msg.role === 'user' ? "bg-white border-slate-200" : "bg-slate-900 border-slate-900"
              )}>
                {msg.role === 'user' ? <User className="w-3.5 h-3.5 text-slate-600" /> : <Bot className="w-3.5 h-3.5 text-white" />}
              </div>
              <div className={cn(
                "p-3 rounded-lg text-sm leading-snug shadow-sm whitespace-pre-wrap font-sans",
                msg.role === 'user' 
                  ? "bg-blue-600 text-white rounded-tr-none" 
                  : "bg-white text-slate-800 border border-slate-200 rounded-tl-none"
              )}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex gap-3 max-w-[90%]">
            <div className="w-7 h-7 rounded bg-slate-900 flex items-center justify-center flex-shrink-0">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-lg rounded-tl-none shadow-sm">
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" />
                <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-slate-200 bg-white">
        <form onSubmit={handleSend} className="flex gap-2">
          <input 
            type="text"
            placeholder="Ketik pertanyaan logistik..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-slate-400 text-sm font-sans"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className={cn(
              "px-4 py-2 rounded-lg transition-all flex items-center justify-center text-xs font-bold uppercase tracking-wider",
              isLoading || !input.trim() ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-slate-900 text-white hover:bg-black active:scale-95"
            )}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
