'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ChevronDown,
  Minimize2,
  HelpCircle,
  Zap,
} from 'lucide-react';
import {
  ChatMessage,
  INITIAL_SUGGESTIONS,
  getBotResponse,
} from '@/lib/chatbot/knowledge';
import { AIAssistantIcon } from '@/components/ui/AIAssistantIcon';

export function EtsyChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: "👋 Hi! I'm your **Etsy Seller AI Assistant**.\n\nAsk me anything about Etsy fees, country rules, profit margin strategies, or digital vs physical products!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: INITIAL_SUGGESTIONS,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll listener for floating button animations
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setIsScrolling(true);

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsScrolling(false);
      }, 450);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    // Simulate natural AI thinking delay (350ms)
    setTimeout(() => {
      const botReply = getBotResponse(query);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botReply.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: botReply.suggestions,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 350);
  };

  const formatMarkdownText = (text: string) => {
    // Simple inline formatter for bold (**text**), code (`code`), lists (- item), and lines
    return text.split('\n').map((line, lineIdx) => {
      if (!line) return <div key={lineIdx} className="h-1.5" />;

      // Format bold text
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedLine = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-bold text-slate-900 dark:text-white">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (line.startsWith('- ')) {
        return (
          <li key={lineIdx} className="ml-3 list-disc text-xs leading-relaxed">
            {formattedLine.slice(0)}
          </li>
        );
      }

      if (/^\d+\.\s/.test(line)) {
        return (
          <div key={lineIdx} className="font-semibold text-xs leading-relaxed pt-0.5">
            {formattedLine}
          </div>
        );
      }

      return (
        <p key={lineIdx} className="text-xs leading-relaxed">
          {formattedLine}
        </p>
      );
    });
  };

  return (
    <>
      {/* ══════════════════════════════════════════════
          1. CIRCLED FLOATING LAUNCHER BUTTON (Bottom Right)
      ══════════════════════════════════════════════ */}
      {!isOpen && (
        <div className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 z-50 flex items-center group">
          
          {/* Left Hover / Scroll Tooltip Pill (Desktop only) */}
          <div
            className={`hidden sm:flex mr-2.5 px-2.5 py-1 rounded-xl bg-slate-900/90 dark:bg-zinc-800/90 text-white text-[11px] font-semibold whitespace-nowrap shadow-xl border border-slate-700/60 items-center gap-1.5 transition-all duration-300 ${
              isScrolling
                ? 'opacity-100 translate-x-0 scale-100'
                : 'opacity-0 translate-x-2 scale-95 group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100 pointer-events-none'
            }`}
          >
            <span>Etsy AI Assistant</span>
            <span className="font-cursive text-amber-300 text-xs font-bold">Ask AI ✨</span>
          </div>

          {/* Compact Circle FAB Button */}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-orange-500 via-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/40 flex items-center justify-center border-2 border-white/40 dark:border-white/20 transition-all duration-300 cursor-pointer ${
              isScrolling
                ? 'scale-105 -translate-y-1 rotate-6 shadow-orange-500/60 shadow-xl ring-2 ring-orange-400/40'
                : 'animate-float-slow hover:scale-105 hover:-translate-y-0.5 active:scale-95'
            }`}
            aria-label="Open Etsy AI Chatbot"
          >
            {/* Ambient Pulsing Radar Ring */}
            <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 opacity-50 blur-xs animate-ring-pulse pointer-events-none" />

            {/* AI Assistant Icon */}
            <AIAssistantIcon size="md" pulse={false} className="relative z-10" />

            {/* Unread Indicator Badge */}
            {hasUnread && (
              <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3 z-20">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400 border-2 border-white dark:border-zinc-900"></span>
              </span>
            )}
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          2. EXPANDABLE SAAS CHATBOT WINDOW
      ══════════════════════════════════════════════ */}
      {isOpen && (
        <div className="fixed bottom-16 sm:bottom-6 right-2 sm:right-6 z-50 w-[calc(100vw-1rem)] sm:w-[400px] h-[520px] max-h-[80vh] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-2xl border border-orange-200/80 dark:border-zinc-800 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 card-shadow-lg">
          
          {/* Header */}
          <div className="p-3.5 sm:p-4 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <AIAssistantIcon size="md" />
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-bold font-[Plus_Jakarta_Sans,sans-serif] leading-none">
                    Etsy Seller AI Assistant
                  </h3>
                  <span className="text-[10px] bg-white/20 text-white font-semibold px-1.5 py-0.2 rounded-full font-mono">
                    Client-Side
                  </span>
                </div>
                <p className="text-[10px] text-amber-100 flex items-center gap-1 mt-0.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
                  <span>100% Private · Zero Data Stored</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                title="Minimize chat"
                aria-label="Minimize chat"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3.5 bg-slate-50/50 dark:bg-zinc-950/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                {/* Bubble Container */}
                <div className="flex items-start gap-2 max-w-[90%]">
                  {msg.sender === 'bot' && (
                    <AIAssistantIcon size="xs" className="mt-1" showSparkles={false} />
                  )}
                  <div
                    className={`p-3 rounded-2xl text-xs space-y-1 shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-br-xs font-medium'
                        : 'bg-white dark:bg-zinc-800 text-slate-800 dark:text-zinc-100 border border-slate-200/70 dark:border-zinc-700/70 rounded-bl-xs'
                    }`}
                  >
                    <div className="space-y-1">{formatMarkdownText(msg.text)}</div>
                    <span
                      className={`text-[9px] block text-right font-mono mt-1 ${
                        msg.sender === 'user' ? 'text-amber-100' : 'text-slate-400 dark:text-zinc-500'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>

                {/* Optional Suggestions Chips under bot message */}
                {msg.sender === 'bot' && msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 ml-7 max-w-[90%]">
                    {msg.suggestions.map((sug, sIdx) => (
                      <button
                        key={sIdx}
                        type="button"
                        onClick={() => handleSend(sug)}
                        className="text-[10px] font-semibold text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/50 hover:bg-orange-100 dark:hover:bg-orange-900/60 border border-orange-200/80 dark:border-orange-800/60 px-2.5 py-1 rounded-full transition-all duration-150 cursor-pointer text-left"
                      >
                        ⚡ {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 p-2.5 px-3.5 bg-white dark:bg-zinc-800 border border-slate-200/70 dark:border-zinc-700/70 rounded-2xl rounded-bl-xs text-xs text-slate-400 dark:text-zinc-400 w-fit">
                <AIAssistantIcon size="xs" showSparkles={false} />
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 border-t border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask a question about Etsy fees, profit, or countries..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 h-9 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 px-3 text-xs text-slate-800 dark:text-zinc-100 focus:outline-none input-field placeholder:text-slate-400 dark:placeholder:text-zinc-500"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim()}
              className="h-9 w-9 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer shadow-sm flex-shrink-0"
              title="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

