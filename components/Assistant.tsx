import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage, Language } from '../types';
import { getTranslation } from '../translations';

interface AssistantProps {
  lang: Language;
}

const Assistant: React.FC<AssistantProps> = ({ lang }) => {
  const [input, setInput] = useState('');
  const t = getTranslation(lang).assistant;
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        role: 'model',
        text: t.initialMessage,
        timestamp: new Date()
      }]);
    }
  }, [lang]);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    // block: 'nearest' prevents the whole page from shifting up on mobile
    messagesEndRef.current?.scrollIntoView({ behavior, block: 'nearest' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useLayoutEffect(() => {
    scrollToBottom('auto');
  }, []);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: textToSend, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const history = messages.slice(-5).map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`);
    const responseText = await sendMessageToGemini(userMsg.text, history, lang);
    
    const modelMsg: ChatMessage = { role: 'model', text: responseText, timestamp: new Date() };
    setMessages(prev => [...prev, modelMsg]);
    setIsLoading(false);
  };

  return (
    // Use overflow-hidden on container to contain inner scrolls
    <div className="flex flex-col h-full w-full bg-slate-900/50 overflow-hidden">
      <div className="p-4 md:p-6 border-b border-slate-700 bg-slate-900/80 backdrop-blur-md z-10 flex-shrink-0">
        <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
          <Sparkles className="text-purple-400" />
          {t.title}
        </h2>
        <p className="text-slate-400 text-xs md:text-sm truncate">{t.subtitle}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 scroll-smooth overscroll-contain">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 md:gap-4 max-w-[90%] md:max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' ? 'bg-blue-600' : 'bg-purple-600'
              }`}>
                {msg.role === 'user' ? <User size={16} className="md:w-5 md:h-5" /> : <Bot size={16} className="md:w-5 md:h-5" />}
              </div>
              <div className={`p-3 md:p-4 rounded-2xl text-sm md:text-base ${
                msg.role === 'user' 
                  ? 'bg-blue-600/20 border border-blue-500/30 text-blue-100 rounded-tr-sm' 
                  : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-sm'
              }`}>
                <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                <span className="text-[10px] opacity-50 mt-2 block">
                  {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-4 max-w-[80%]">
               <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 animate-pulse">
                <Bot size={16} />
              </div>
              <div className="bg-slate-800 border border-slate-700 p-3 md:p-4 rounded-2xl rounded-tl-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-1" />
      </div>

      <div className="p-3 md:p-6 bg-slate-900 border-t border-slate-700 flex-shrink-0 pb-safe">
        <div className="flex gap-2 md:gap-4 bg-slate-800 p-2 rounded-2xl border border-slate-700 focus-within:border-purple-500 transition-colors">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t.placeholder}
            className="flex-1 bg-transparent border-none outline-none text-white px-2 md:px-4 placeholder:text-slate-500 text-sm md:text-base"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:hover:bg-purple-600 text-white p-2 md:p-3 rounded-xl transition-colors"
          >
            <Send size={18} className="md:w-5 md:h-5" />
          </button>
        </div>
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar">
           {t.suggestions.map(suggestion => (
             <button 
               key={suggestion}
               onClick={() => handleSend(suggestion)}
               className="whitespace-nowrap px-3 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-full text-[10px] md:text-xs text-slate-300 transition-colors"
             >
               {suggestion}
             </button>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Assistant;