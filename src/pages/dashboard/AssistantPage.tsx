import React, { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useApp } from '../../context/AppContext';
import { DeleteConfirmModal } from '../../components/common/DeleteConfirmModal';
import {
  Bot,
  Send,
  ShieldCheck,
  RefreshCw,
  Copy,
  Check,
  Trash2,
  RotateCcw,
  AlertCircle,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isError?: boolean;
}

const STORAGE_CHAT_KEY = 'grantly_ai_chat_history_v1';

export const AssistantPage: React.FC = () => {
  const { profile, scholarships, applications, savedScholarshipIds } = useApp();

  const getInitialMessages = (): ChatMessage[] => {
    const saved = localStorage.getItem(STORAGE_CHAT_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        // Fallback to default
      }
    }
    return [
      {
        id: 'msg-welcome',
        sender: 'assistant',
        text: `Hello ${profile.fullName.split(' ')[0]}! I am Ask GRANTLY, your personal AI scholarship advisor. I have access to your active applications, document vault readiness, and verified schemes. How can I guide you today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  };

  const [messages, setMessages] = useState<ChatMessage[]>(getInitialMessages);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const [lastFailedQuery, setLastFailedQuery] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Persist messages
  const updateMessages = (newMsgs: ChatMessage[]) => {
    setMessages(newMsgs);
    try {
      localStorage.setItem(STORAGE_CHAT_KEY, JSON.stringify(newMsgs));
    } catch (e) {
      console.warn('Failed to persist chat messages:', e);
    }
  };

  const suggestedQuestions = [
    'Which scholarships match my profile best?',
    'What documents do I need for my active applications?',
    'Which scholarship deadline is approaching first?',
    'What should I complete today?',
    'Explain my Reliance Foundation eligibility in simple Hindi.',
  ];

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputValue;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedWithUser = [...messages, userMsg];
    updateMessages(updatedWithUser);
    if (!queryText) setInputValue('');
    setLoading(true);
    setLastFailedQuery(null);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: updatedWithUser.slice(-8), // Pass multi-turn conversation context
          studentProfile: profile,
          savedScholarships: savedScholarshipIds,
          activeApplications: applications.map((a) => ({
            title: a.scholarship.title,
            status: a.status,
            deadline: a.scholarship.deadline,
            ref: a.referenceNumber,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.response || 'I have analyzed your request against the GRANTLY database.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      updateMessages([...updatedWithUser, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setLastFailedQuery(textToSend);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        isError: true,
        text: 'I encountered an error connecting to the Gemini knowledge service. Please verify your connection or click Retry.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      updateMessages([...updatedWithUser, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    const resetWelcome: ChatMessage[] = [
      {
        id: `msg-welcome-${Date.now()}`,
        sender: 'assistant',
        text: `Conversation cleared. Hello ${profile.fullName.split(' ')[0]}! How can I assist you with your scholarship journey today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
    updateMessages(resetWelcome);
    setShowClearModal(false);
  };

  const handleDeleteSingleMessage = (msgId: string) => {
    const filtered = messages.filter((m) => m.id !== msgId);
    updateMessages(filtered.length > 0 ? filtered : [
      {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: 'How can I assist you today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)] space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8EAF1] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#635BFF] to-[#8B5CF6] flex items-center justify-center text-white shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-[#151827] font-heading">
                  Ask GRANTLY
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#8B5CF6]/10 text-[#8B5CF6] px-1.5 py-0.5 rounded">
                  Gemini Grounded
                </span>
              </div>
              <p className="text-xs text-[#697386]">
                Context-aware guidance grounded in your authenticated student profile and active applications.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowClearModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E8EAF1] hover:border-rose-300 hover:bg-rose-50 text-xs font-semibold text-[#697386] hover:text-rose-700 transition-colors"
              title="Clear entire conversation"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear Chat</span>
            </button>

            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Private Session Active</span>
            </span>
          </div>
        </div>

        {/* Suggested Prompt Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0">
          <span className="text-xs font-bold text-[#697386] shrink-0">
            Suggested:
          </span>
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-xs font-medium py-1 px-3 rounded-lg border border-[#E8EAF1] bg-white hover:border-[#635BFF]/40 text-[#151827] transition-colors whitespace-nowrap shadow-2xs"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Message List */}
        <div className="flex-1 bg-white rounded-2xl border border-[#E8EAF1] p-4 sm:p-6 overflow-y-auto space-y-4 shadow-xs">
          {messages.map((m) => {
            const isBot = m.sender === 'assistant';
            return (
              <div
                key={m.id}
                className={`flex items-start gap-3 ${isBot ? '' : 'flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isBot
                      ? 'bg-gradient-to-tr from-[#635BFF] to-[#8B5CF6] text-white'
                      : 'bg-[#151827] text-white'
                  }`}
                >
                  {isBot ? <Bot className="w-4 h-4" /> : profile.fullName.charAt(0)}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed relative group ${
                    m.isError
                      ? 'bg-rose-50 text-rose-800 border border-rose-200'
                      : isBot
                      ? 'bg-[#F8F9FC] text-[#151827] border border-[#E8EAF1]'
                      : 'bg-[#635BFF] text-white shadow-xs'
                  }`}
                >
                  <div className="space-y-1">
                    {m.text.split('\n').map((line, lIdx) => {
                      const parts = line.split(/(\*\*.*?\*\*)/g);
                      return (
                        <p key={lIdx} className="leading-relaxed">
                          {parts.map((p, pIdx) => {
                            if (p.startsWith('**') && p.endsWith('**')) {
                              return (
                                <strong key={pIdx} className="font-bold">
                                  {p.slice(2, -2)}
                                </strong>
                              );
                            }
                            return p;
                          })}
                        </p>
                      );
                    })}
                  </div>
                  <div
                    className={`flex items-center justify-between gap-2 mt-2 pt-1 border-t text-[10px] ${
                      m.isError
                        ? 'border-rose-200 text-rose-600'
                        : isBot
                        ? 'border-gray-200/60 text-gray-400'
                        : 'border-white/20 text-white/70'
                    }`}
                  >
                    <span>{m.timestamp}</span>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {isBot && (
                        <button
                          onClick={() => handleCopy(m.id, m.text)}
                          className="hover:text-[#635BFF]"
                          title="Copy text"
                        >
                          {copiedId === m.id ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteSingleMessage(m.id)}
                        className="hover:text-rose-600"
                        title="Delete message"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#635BFF] to-[#8B5CF6] text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-[#F8F9FC] rounded-2xl p-4 text-xs text-gray-600 border border-[#E8EAF1] flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#635BFF]" />
                <span>Ask GRANTLY is reviewing verified scholarship rules and your student records...</span>
              </div>
            </div>
          )}

          {lastFailedQuery && !loading && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Request could not be delivered to Gemini.</span>
              </div>
              <button
                type="button"
                onClick={() => handleSendMessage(lastFailedQuery)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Retry</span>
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="shrink-0 bg-white rounded-2xl border border-[#E8EAF1] p-2 sm:p-2.5 shadow-xs">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything about scholarship eligibility, documents, or deadlines..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 py-2.5 px-3.5 text-xs sm:text-sm bg-transparent text-[#151827] placeholder:text-gray-400 focus:outline-hidden"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || loading}
              className="p-2.5 rounded-xl bg-[#635BFF] hover:bg-[#4941D1] text-white disabled:opacity-40 transition-all shadow-xs shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={showClearModal}
        title="Clear Chat Conversation"
        message="Are you sure you want to delete this chat conversation? The conversation history will be permanently erased."
        confirmLabel="Clear Conversation"
        onConfirm={handleClearHistory}
        onCancel={() => setShowClearModal(false)}
      />
    </DashboardLayout>
  );
};

