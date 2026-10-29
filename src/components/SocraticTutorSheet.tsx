import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, X, ChevronUp, ChevronDown, Terminal, MessageSquare } from 'lucide-react';
import { TutorMessage, EngineerProfile, StageScenario } from '../types';
import { soundEffects } from '../utils/audio';

interface SocraticTutorSheetProps {
  currentStage: StageScenario;
  profile: EngineerProfile;
  isOpen: boolean;
  onToggle: () => void;
}

export const SocraticTutorSheet: React.FC<SocraticTutorSheetProps> = ({
  currentStage,
  profile,
  isOpen,
  onToggle,
}) => {
  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      id: 'init-1',
      sender: 'tutor',
      text: `Nöbetçi Mühendis, hoş geldin. Ben Illustrated Primer Sokratik Danışmanın. Kararları ben vermem; ancak seni felakete götürecek mimari kör noktaları sorgulatırım. Şu an ${currentStage.title} içindesin. Veritabanı ve kuyruk dinamiklerini nasıl değerlendiriyorsun?`,
      timestamp: '00:01',
      source: 'local_deterministic',
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // When stage changes, add context prompt from tutor if not already there
  useEffect(() => {
    const stageNotice: TutorMessage = {
      id: `stage-${currentStage.stageNumber}-${Date.now()}`,
      sender: 'tutor',
      text: `[DİKKAT: YENİ KRİZ FAZI // ${currentStage.phaseCode}] ${currentStage.subtitle}. Karar vermeden önce bu aşamanın kilit mimari darboğazını irdelemek ister misin?`,
      timestamp: '00:0' + (currentStage.stageNumber * 3),
      source: 'local_deterministic',
    };
    setMessages((prev) => [...prev, stageNotice]);
  }, [currentStage.stageNumber]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    soundEffects.playClick();

    const userMsg: TutorMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: currentStage.stageNumber,
          role: profile.role,
          level: profile.level,
          goal: profile.goal,
          userQuery: query,
          chatHistory: messages.slice(-5),
        }),
      });

      if (!response.ok) {
        throw new Error('Tutor server error');
      }

      const data = await response.json();
      soundEffects.playTutorPing();

      const tutorReply: TutorMessage = {
        id: `tutor-${Date.now()}`,
        sender: 'tutor',
        text: data.text,
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        source: data.source || 'gemini-3.8-flash',
      };

      setMessages((prev) => [...prev, tutorReply]);
    } catch (err) {
      console.warn('Fallback to client-side deterministic response:', err);
      soundEffects.playTutorPing();

      // Graceful instant fallback if API or network fails
      let fallbackText =
        'Bir karar verirken anlık rahatlamaya mı yoksa veri tabanındaki ACID garantilerine mi öncelik vermelisin? Yapacağın seçimin olası bir deadlock felaketine yol açma riskini nasıl ölçersin?';

      if (currentStage.stageNumber === 1) {
        fallbackText =
          'Rollback yapmak geriye dönük şema uyumsuzluğu riski taşırken, backpressure kurmak gelen trafiği tamponlar. Sence thundering herd fırtınasını durdurmak için hangi seçenek daha az tahribat yaratır?';
      } else if (currentStage.stageNumber === 2) {
        fallbackText =
          '10.000 sanal bot testi yapmadan canlıya çıkmak zamandan tasarruf ettirse de, yüksek concurrency altında saklı kalan deadlock hatalarını nasıl tespit edeceksin?';
      } else if (currentStage.stageNumber === 3) {
        fallbackText =
          'Çoğaltılan sahte coinleri görmezden gelmek tüm oyun ekonomisinde hiperenflasyon patlatırken, şüpheli hesapları karantinaya almanın arka uç ledger mutabakatına etkisi sence ne olur?';
      }

      const fallbackReply: TutorMessage = {
        id: `tutor-${Date.now()}`,
        sender: 'tutor',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        source: 'local_deterministic',
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Persistent Floating Drawer Trigger Button (Bottom Right) */}
      {!isOpen && (
        <button
          onClick={() => {
            soundEffects.playClick();
            onToggle();
          }}
          className="fixed bottom-24 right-4 z-30 flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#151D2F] border border-[#8B5CF6] text-[#F9FAFB] shadow-xl hover:bg-[#1B253B] transition-all cursor-pointer glow-tutor active:scale-95"
        >
          <div className="relative">
            <Bot size={18} className="text-[#8B5CF6]" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
          </div>
          <div className="text-left font-mono leading-none">
            <span className="text-[10px] text-[#8B5CF6] font-bold block">SOKRATİK DANIŞMAN</span>
            <span className="text-[9px] text-[#94A3B8]">Mimar Danış</span>
          </div>
          <ChevronUp size={16} className="text-[#8B5CF6]" />
        </button>
      )}

      {/* Socratic Drawer Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs transition-opacity animate-fadeIn">
          {/* Backdrop click to dismiss */}
          <div className="flex-1" onClick={onToggle} />

          {/* Drawer Container (Max height for mobile 360x800) */}
          <div className="w-full max-w-xl mx-auto bg-[#151D2F] border-t-2 border-[#8B5CF6] rounded-t-2xl shadow-2xl flex flex-col max-h-[85vh] sm:max-h-[75vh] animate-slideUp">
            {/* Header */}
            <div className="p-3.5 border-b border-[#24324F] flex items-center justify-between bg-[#0B0F19]/80 rounded-t-2xl">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 flex items-center justify-center">
                  <Bot size={18} className="text-[#8B5CF6]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-bold text-[#F9FAFB]">
                      THE PRIMER • SOKRATİK DANIŞMAN
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#8B5CF6]/20 text-[#8B5CF6] font-mono">
                      E1-E4 KORUMALI
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#94A3B8]">
                    {profile.level.toUpperCase()} // {profile.role.toUpperCase()} // {currentStage.phaseCode}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={onToggle}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-[#F9FAFB] hover:bg-[#24324F] transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Quick Socratic Prompt Chips */}
            <div className="px-3 py-2 bg-[#0B0F19]/40 border-b border-[#24324F] overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5">
              <span className="text-[9px] font-mono text-[#8B5CF6] flex items-center gap-1 shrink-0 self-center">
                <Sparkles size={10} />
                ÖNERİLENLER:
              </span>
              {currentStage.suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  disabled={isLoading}
                  className="shrink-0 px-2.5 py-1 rounded-full bg-[#1B253B] border border-[#24324F] text-[10px] text-[#DFE2F1] hover:border-[#8B5CF6] hover:text-[#8B5CF6] transition-all cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Message Thread */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#0B0F19]/30">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-xl p-3 text-xs leading-relaxed ${
                        isUser
                          ? 'bg-[#3B82F6] text-white rounded-br-xs shadow-md'
                          : 'bg-[#1B253B] border border-[#24324F] text-[#DFE2F1] rounded-bl-xs'
                      }`}
                    >
                      {!isUser && (
                        <div className="flex items-center justify-between gap-2 mb-1.5 text-[9px] font-mono text-[#8B5CF6] font-semibold border-b border-[#24324F] pb-1">
                          <span className="flex items-center gap-1">
                            <Terminal size={10} />
                            ILLUSTRATED PRIMER SOKRATİK MENTOR
                          </span>
                          <span>{msg.timestamp}</span>
                        </div>
                      )}

                      <p className="whitespace-pre-wrap">{msg.text}</p>

                      {isUser && (
                        <div className="text-[8px] font-mono text-white/70 text-right mt-1">
                          {msg.timestamp}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-[#1B253B] border border-[#8B5CF6]/30 text-xs text-[#8B5CF6] w-fit">
                  <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-ping" />
                  <span className="font-mono text-[11px]">
                    Sokratik analiz ve risk değerlendirmesi formüle ediliyor...
                  </span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-[#0B0F19] border-t border-[#24324F]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Mimari risk veya trade-off sor..."
                  className="flex-1 bg-[#151D2F] border border-[#24324F] rounded-lg px-3 py-2.5 text-xs text-[#F9FAFB] placeholder-[#64748B] focus:border-[#8B5CF6] focus:outline-hidden min-h-[44px]"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!inputQuery.trim() || isLoading}
                  className="min-h-[44px] min-w-[44px] px-3 rounded-lg bg-[#8B5CF6] text-white flex items-center justify-center hover:bg-[#7C3AED] disabled:opacity-40 transition-all cursor-pointer glow-tutor active:scale-95"
                  aria-label="Soruyu Gönder"
                >
                  <Send size={16} />
                </button>
              </form>
              <div className="text-[9px] font-mono text-[#64748B] text-center mt-1.5">
                Guardrail Aktif: Danışman doğrudan seçim yaptırmaz; mimari riskleri sorgulatır.
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
