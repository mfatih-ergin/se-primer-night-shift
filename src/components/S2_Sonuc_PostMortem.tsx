import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  Share2, 
  BookOpen, 
  Award, 
  HelpCircle, 
  Check, 
  FileText,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { SimulationEndState, DecisionRecord, EngineerProfile } from '../types';
import { POST_MORTEM_DATA } from '../data/simulationData';
import { soundEffects } from '../utils/audio';

interface S2_Sonuc_PostMortemProps {
  endState: SimulationEndState;
  decisions: DecisionRecord[];
  profile: EngineerProfile;
  onRestart: () => void;
}

export const S2_Sonuc_PostMortem: React.FC<S2_Sonuc_PostMortemProps> = ({
  endState,
  decisions,
  profile,
  onRestart,
}) => {
  const [copied, setCopied] = useState(false);
  const [expandedWhy, setExpandedWhy] = useState<number | null>(1);

  const data = POST_MORTEM_DATA[endState];
  const isStabilized = endState === 'STABILIZED';

  const handleCopyReport = async () => {
    soundEffects.playClick();
    const textReport = `--- SE PRIMER: NIGHT SHIFT // POST-MORTEM RAPORU ---
DURUM: ${data.statusBadge}
MÜHENDİS: ${profile.level.toUpperCase()} // ${profile.role.toUpperCase()} // ${profile.goal.toUpperCase()}
SLA ERİŞİLEBİLİRLİK: ${data.slaScore}
VERİ BÜTÜNLÜĞÜ: ${data.dataIntegrityScore}
OYUNCU MEMNUNİYETİ (CSAT): ${data.csatScore}
MTTR: ${data.mttrMinutes}
KARNE PUANI: ${data.score}/100

AŞAMA KARARLARI:
${decisions
  .map(
    (d) =>
      `Aşama ${d.stageNumber}: ${d.choice.title} [${d.choice.isRecommendedByBestPractice ? 'DOĞRU MİMARİ' : 'RİSKLİ/HATALI'}]`
  )
  .join('\n')}

PRIMER ÖZETİ:
${data.primerAssessment}
-----------------------------------------------------`;

    try {
      await navigator.clipboard.writeText(textReport);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen pb-16 pt-4 px-3.5 max-w-xl mx-auto space-y-4 animate-fadeIn">
      {/* Top Status Header */}
      <div
        className={`p-4 rounded-2xl border text-center relative overflow-hidden ${
          isStabilized
            ? 'bg-[#10B981]/10 border-[#10B981] glow-success'
            : 'bg-[#EF4444]/10 border-[#EF4444] glow-danger'
        }`}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          {isStabilized ? (
            <CheckCircle size={28} className="text-[#10B981]" />
          ) : (
            <XCircle size={28} className="text-[#EF4444]" />
          )}
        </div>

        <div
          className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase mb-1.5 ${
            isStabilized ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-[#EF4444]/20 text-[#EF4444]'
          }`}
        >
          {data.statusBadge}
        </div>

        <h1 className="text-xl font-bold text-[#F9FAFB] leading-snug">
          {data.title}
        </h1>

        <p className="text-xs text-[#DFE2F1] mt-2 leading-relaxed max-w-md mx-auto">
          {data.summary}
        </p>
      </div>

      {/* Engineering Scorecard Matrix */}
      <div className="bg-[#151D2F] border border-[#24324F] rounded-2xl p-4 shadow-md space-y-3">
        <div className="flex items-center justify-between border-b border-[#24324F] pb-2">
          <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#F9FAFB]">
            <Award size={15} className="text-[#3B82F6]" />
            <span>MÜHENDİSLİK KARNESİ (SCORECARD)</span>
          </div>
          <div className="text-xs font-mono font-bold text-[#3B82F6]">
            PUAN: {data.score} / 100
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* SLA */}
          <div className="bg-[#0B0F19] border border-[#24324F] rounded-xl p-2.5">
            <span className="text-[10px] font-mono text-[#94A3B8] block">SİSTEM ERİŞİLEBİLİRLİĞİ</span>
            <span className={`text-base font-mono font-bold tabular-nums ${isStabilized ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
              {data.slaScore}
            </span>
            <span className="text-[9px] font-mono text-[#64748B] block mt-0.5">HEDEF: &gt;%99.5</span>
          </div>

          {/* Data Integrity */}
          <div className="bg-[#0B0F19] border border-[#24324F] rounded-xl p-2.5">
            <span className="text-[10px] font-mono text-[#94A3B8] block">VERİ BÜTÜNLÜĞÜ</span>
            <span className={`text-base font-mono font-bold tabular-nums ${isStabilized ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
              {data.dataIntegrityScore}
            </span>
            <span className="text-[9px] font-mono text-[#64748B] block mt-0.5">ACID LEDGER KORUMASI</span>
          </div>

          {/* CSAT */}
          <div className="bg-[#0B0F19] border border-[#24324F] rounded-xl p-2.5">
            <span className="text-[10px] font-mono text-[#94A3B8] block">OYUNCU MEMNUNİYETİ</span>
            <span className={`text-base font-mono font-bold tabular-nums ${isStabilized ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
              {data.csatScore}
            </span>
            <span className="text-[9px] font-mono text-[#64748B] block mt-0.5">TOPLULUK VE PR ALGISI</span>
          </div>

          {/* MTTR */}
          <div className="bg-[#0B0F19] border border-[#24324F] rounded-xl p-2.5">
            <span className="text-[10px] font-mono text-[#94A3B8] block">ÇÖZÜM SÜRESİ (MTTR)</span>
            <span className="text-base font-mono font-bold tabular-nums text-[#DFE2F1]">
              {data.mttrMinutes}
            </span>
            <span className="text-[9px] font-mono text-[#64748B] block mt-0.5">KRİZ PROTOKOLÜ</span>
          </div>
        </div>
      </div>

      {/* Decisions Log Audit */}
      <div className="bg-[#151D2F] border border-[#24324F] rounded-2xl p-4 shadow-md space-y-2.5">
        <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#F9FAFB] border-b border-[#24324F] pb-2">
          <FileText size={15} className="text-[#3B82F6]" />
          <span>VERİLEN KARARLARIN TEKNİK DÖKÜMÜ</span>
        </div>

        <div className="space-y-2">
          {decisions.map((d) => {
            const isGood = d.choice.isRecommendedByBestPractice;
            return (
              <div
                key={d.stageNumber}
                className="p-2.5 rounded-xl bg-[#0B0F19] border border-[#24324F] flex items-start gap-2.5"
              >
                <div className="mt-0.5 shrink-0">
                  {isGood ? (
                    <ShieldCheck size={16} className="text-[#10B981]" />
                  ) : (
                    <AlertTriangle size={16} className="text-[#EF4444]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-[11px] font-mono font-semibold">
                    <span className="text-[#F9FAFB]">
                      Aşama {d.stageNumber}: {d.choice.title}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                        isGood
                          ? 'bg-[#10B981]/20 text-[#10B981]'
                          : 'bg-[#EF4444]/20 text-[#EF4444]'
                      }`}
                    >
                      {isGood ? 'DOĞRU MİMARİ' : 'HATALI SEÇİM'}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#94A3B8] mt-1 leading-relaxed">
                    {d.choice.outcome.whatHappened}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5 Whys (5 Neden Analizi) */}
      <div className="bg-[#151D2F] border border-[#24324F] rounded-2xl p-4 shadow-md space-y-2.5">
        <div className="flex items-center justify-between border-b border-[#24324F] pb-2">
          <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#F9FAFB]">
            <HelpCircle size={15} className="text-[#8B5CF6]" />
            <span>KÖK NEDEN ANALİZİ // 5 WHYS (5 NEDEN)</span>
          </div>
          <span className="text-[10px] font-mono text-[#64748B]">MİMARİ DERS</span>
        </div>

        <div className="space-y-1.5">
          {data.fiveWhys.map((why) => {
            const isExpanded = expandedWhy === why.level;
            return (
              <div
                key={why.level}
                onClick={() => setExpandedWhy(isExpanded ? null : why.level)}
                className="p-2.5 rounded-xl bg-[#0B0F19] border border-[#24324F] transition-all cursor-pointer hover:border-[#384C74]"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-[#DFE2F1]">
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#8B5CF6]/20 text-[#8B5CF6] font-mono text-[10px] flex items-center justify-center font-bold">
                      {why.level}
                    </span>
                    <span>{why.question}</span>
                  </span>
                  <span className="text-xs text-[#94A3B8]">{isExpanded ? '−' : '+'}</span>
                </div>
                {isExpanded && (
                  <p className="mt-2 text-[11px] text-[#94A3B8] pl-7 leading-relaxed border-t border-[#24324F]/60 pt-2 font-mono">
                    {why.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Diamond Age Primer Assessment */}
      <div className="bg-[#151D2F] border-t-2 border-[#8B5CF6] border-x border-b border-[#24324F] rounded-2xl p-4 shadow-md space-y-2">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-[#8B5CF6]" />
          <span className="text-xs font-mono font-bold text-[#8B5CF6] uppercase">
            THE DIAMOND AGE // PRIMER DEĞERLENDİRMESİ
          </span>
        </div>
        <p className="text-xs text-[#DFE2F1] leading-relaxed italic bg-[#0B0F19] p-3 rounded-xl border border-[#24324F]">
          "{data.primerAssessment}"
        </p>
      </div>

      {/* Action Buttons (Min 48px height) */}
      <div className="space-y-2.5 pt-2">
        <button
          onClick={handleCopyReport}
          className="w-full min-h-[48px] py-3 px-4 rounded-xl bg-[#151D2F] hover:bg-[#1B253B] border border-[#24324F] text-[#F9FAFB] font-semibold text-xs tracking-wide flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
        >
          {copied ? (
            <>
              <Check size={16} className="text-[#10B981]" />
              <span className="text-[#10B981]">Rapor Panoya Kopyalandı!</span>
            </>
          ) : (
            <>
              <Share2 size={16} className="text-[#3B82F6]" />
              <span>Mühendislik Raporunu Kopyala</span>
            </>
          )}
        </button>

        <button
          onClick={() => {
            soundEffects.playClick();
            onRestart();
          }}
          className="w-full min-h-[48px] py-3 px-4 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold text-xs tracking-wide flex items-center justify-center gap-2 glow-primary transition-all active:scale-[0.98] cursor-pointer"
        >
          <RotateCcw size={16} />
          <span>Simülasyonu Yeniden Başlat (Yeni Profil)</span>
        </button>
      </div>
    </div>
  );
};
