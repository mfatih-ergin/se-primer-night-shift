import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, ArrowRight, ShieldAlert, Cpu, Sparkles, Terminal, FileText, Bot } from 'lucide-react';
import { StageScenario, DecisionChoice, MetricState, EngineerProfile, DecisionRecord } from '../types';
import { TopologyDiagram } from './TopologyDiagram';
import { SocraticTutorSheet } from './SocraticTutorSheet';
import { soundEffects } from '../utils/audio';

interface S1_Karar_ArenasiProps {
  stage: StageScenario;
  profile: EngineerProfile;
  metrics: MetricState;
  remainingSeconds: number;
  onSelectDecision: (choice: DecisionChoice, wasAutoTriggered?: boolean) => void;
  onProceedToNext: () => void;
  lastDecision: DecisionRecord | null;
  isStageResolved: boolean;
}

export const S1_Karar_Arenasi: React.FC<S1_Karar_ArenasiProps> = ({
  stage,
  profile,
  metrics,
  remainingSeconds,
  onSelectDecision,
  onProceedToNext,
  lastDecision,
  isStageResolved,
}) => {
  const [selectedChoiceId, setSelectedChoiceId] = useState<'A' | 'B' | null>(null);
  const [isTutorOpen, setIsTutorOpen] = useState(false);

  // Sync state when stage changes
  useEffect(() => {
    setSelectedChoiceId(null);
  }, [stage.stageNumber]);

  // Senior auto-trigger handler if time runs out
  useEffect(() => {
    if (profile.level === 'senior' && remainingSeconds === 0 && !isStageResolved) {
      soundEffects.playAlarm();
      const defaultChoice = stage.choices.find((c) => c.id === stage.defaultChoiceId) || stage.choices[0];
      setSelectedChoiceId(defaultChoice.id);
      onSelectDecision(defaultChoice, true);
    }
  }, [remainingSeconds, profile.level, isStageResolved, stage, onSelectDecision]);

  const handleCardClick = (choice: DecisionChoice) => {
    if (isStageResolved) return;
    soundEffects.playClick();
    setSelectedChoiceId(choice.id);
    onSelectDecision(choice, false);
  };

  return (
    <div className="pb-28 pt-2 px-3.5 max-w-xl mx-auto space-y-3.5 animate-fadeIn">
      {/* Topology Diagram Section */}
      <TopologyDiagram metrics={metrics} stageNumber={stage.stageNumber} />

      {/* Incident Briefing Card */}
      <div className="bg-[#151D2F] border border-[#24324F] rounded-xl p-3.5 shadow-md relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#3B82F6]" />

        <div className="flex items-center justify-between text-[10px] font-mono mb-1.5 text-[#94A3B8]">
          <span className="text-[#3B82F6] font-bold">{stage.phaseCode}</span>
          <span className="flex items-center gap-1">
            <Terminal size={10} />
            00:0{stage.stageNumber * 3}:12 UTC
          </span>
        </div>

        <h2 className="text-base font-bold text-[#F9FAFB] leading-snug">
          {stage.title}
        </h2>
        <div className="text-xs font-mono text-[#F59E0B] mt-0.5">
          {stage.subtitle}
        </div>

        <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
          {stage.loreContext}
        </p>

        {/* Technical Architecture Context */}
        <div className="mt-2.5 p-2 rounded-lg bg-[#0B0F19] border border-[#24324F] text-[11px] text-[#DFE2F1]">
          <div className="font-mono text-[9px] text-[#64748B] uppercase tracking-wider mb-0.5">
            MİMARİ DARBOĞAZ:
          </div>
          <p className="leading-relaxed">{stage.technicalBriefing}</p>
        </div>
      </div>

      {/* Socratic Advice Callout Banner */}
      <div className="bg-[#151D2F] border-t-2 border-[#8B5CF6] border-x border-b border-[#24324F] rounded-xl p-3 flex items-center justify-between gap-2 shadow-sm">
        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 flex items-center justify-center shrink-0 mt-0.5">
            <Bot size={15} className="text-[#8B5CF6]" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold text-[#8B5CF6] uppercase">
              SOKRATİK DANIŞMAN // İPUCU
            </div>
            <p className="text-[11px] text-[#DFE2F1] mt-0.5 leading-snug">
              {stage.suggestedQuestions[0]}
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            soundEffects.playClick();
            setIsTutorOpen(true);
          }}
          className="shrink-0 px-2.5 py-1.5 rounded-lg bg-[#8B5CF6]/15 hover:bg-[#8B5CF6]/30 border border-[#8B5CF6]/50 text-[10px] font-mono text-[#8B5CF6] font-semibold transition-all cursor-pointer"
        >
          Danış
        </button>
      </div>

      {/* Triage Decision Section */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs font-mono text-[#DFE2F1] font-semibold px-0.5">
          <span>KRİTİK KARAR MATRİSİ</span>
          <span className="text-[10px] text-[#94A3B8]">SEÇENEK SEÇİNİZ (A / B)</span>
        </div>

        {stage.choices.map((choice) => {
          const isSelected = selectedChoiceId === choice.id || lastDecision?.chosenId === choice.id;

          return (
            <div
              key={choice.id}
              onClick={() => handleCardClick(choice)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                isSelected
                  ? 'border-[#3B82F6] bg-[#1B253B] ring-1 ring-[#3B82F6] glow-primary'
                  : 'border-[#24324F] bg-[#151D2F] hover:border-[#384C74]'
              } ${isStageResolved ? 'pointer-events-none opacity-80' : ''}`}
            >
              {/* Top Choice Badge */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded flex items-center justify-center font-mono font-bold text-xs ${
                      isSelected ? 'bg-[#3B82F6] text-white' : 'bg-[#0B0F19] border border-[#24324F] text-[#94A3B8]'
                    }`}
                  >
                    {choice.id}
                  </span>
                  <span className="text-xs font-bold text-[#F9FAFB]">{choice.title}</span>
                </div>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#0B0F19] text-[#94A3B8] border border-[#24324F]">
                  {choice.badge}
                </span>
              </div>

              {/* Summary */}
              <p className="text-xs text-[#DFE2F1] leading-relaxed mb-2.5">{choice.summary}</p>

              {/* Pros & Cons Mini Matrix */}
              <div className="grid grid-cols-2 gap-2 text-[10px] bg-[#0B0F19]/60 p-2 rounded-lg border border-[#24324F]/70">
                <div>
                  <div className="font-mono text-[#10B981] font-semibold mb-1 flex items-center gap-1">
                    <CheckCircle size={10} />
                    AVANTAJ
                  </div>
                  <ul className="text-[#94A3B8] space-y-0.5 list-disc list-inside text-[9px] leading-tight">
                    {choice.tradeOffs.pros.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="font-mono text-[#EF4444] font-semibold mb-1 flex items-center gap-1">
                    <AlertTriangle size={10} />
                    RİSK / BEDEL
                  </div>
                  <ul className="text-[#94A3B8] space-y-0.5 list-disc list-inside text-[9px] leading-tight">
                    {choice.tradeOffs.cons.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Lever Button */}
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[9px] font-mono text-[#64748B] truncate max-w-[200px]">
                  {choice.technicalDetails}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(choice);
                  }}
                  className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-[#3B82F6] text-white shadow-md'
                      : 'bg-[#24324F]/70 text-[#DFE2F1] hover:bg-[#3B82F6] hover:text-white'
                  }`}
                >
                  <span>{isSelected ? 'Seçildi' : 'Bu Kararı Uygula'}</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* "Ne Oldu / Neden Oldu" Diagnostic Feedback Modal / Sheet */}
      {isStageResolved && lastDecision && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-[#151D2F] border border-[#3B82F6] rounded-2xl shadow-2xl p-4 space-y-3.5 animate-scaleUp">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#24324F] pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] animate-pulse" />
                <h3 className="text-sm font-bold text-[#F9FAFB] font-mono tracking-wide">
                  MİMARİ TEŞHİS RAPORU // AŞAMA {stage.stageNumber}
                </h3>
              </div>
              {lastDecision.wasAutoTriggered && (
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40">
                  OTOMATİK ZAMAN AŞIMI KARARI
                </span>
              )}
            </div>

            {/* What Happened (Ne Oldu) */}
            <div className="space-y-1 bg-[#0B0F19] p-3 rounded-xl border border-[#24324F]">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#F9FAFB]">
                <FileText size={14} className="text-[#3B82F6]" />
                <span>NE OLDU? (SİSTEM TEPKİSİ)</span>
              </div>
              <p className="text-xs text-[#DFE2F1] leading-relaxed pt-1">
                {lastDecision.choice.outcome.whatHappened}
              </p>
            </div>

            {/* Why It Happened (Neden Oldu) */}
            <div className="space-y-1 bg-[#0B0F19] p-3 rounded-xl border border-[#24324F]">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#F59E0B]">
                <AlertTriangle size={14} className="text-[#F59E0B]" />
                <span>NEDEN OLDU? (KÖK MİMARİ NEDEN)</span>
              </div>
              <p className="text-xs text-[#94A3B8] leading-relaxed pt-1">
                {lastDecision.choice.outcome.whyItHappened}
              </p>
            </div>

            {/* Architectural Rule */}
            <div className="p-2.5 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/30 text-[11px] font-mono text-[#3B82F6]">
              <span className="font-bold">MİMARİ DERS: </span>
              {lastDecision.choice.outcome.rootCauseArchitecture}
            </div>

            {/* Telemetry Summary & Proceed Action */}
            <div className="pt-1 flex flex-col gap-2">
              <div className="text-[10px] font-mono text-[#94A3B8] text-center">
                {lastDecision.choice.outcome.metricsSummary}
              </div>

              <button
                onClick={() => {
                  soundEffects.playClick();
                  onProceedToNext();
                }}
                className="w-full min-h-[48px] py-3 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold text-xs tracking-wide flex items-center justify-center gap-2 glow-primary transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>
                  {stage.stageNumber < 3
                    ? `Aşama ${stage.stageNumber + 1}'e İlerle`
                    : 'Sonuç Raporunu ve Post-Mortem’i Gör'}
                </span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Socratic AI Tutor Drawer */}
      <SocraticTutorSheet
        currentStage={stage}
        profile={profile}
        isOpen={isTutorOpen}
        onToggle={() => setIsTutorOpen(!isTutorOpen)}
      />
    </div>
  );
};
