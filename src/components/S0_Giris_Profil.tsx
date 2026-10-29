import React from 'react';
import { Shield, Flame, Terminal, Clock, Zap, Cpu, Server, Database, CheckCircle2, BookOpen } from 'lucide-react';
import { EngineerLevel, EngineerRole, PrimaryGoal, EngineerProfile } from '../types';
import { soundEffects } from '../utils/audio';

interface S0_Giris_ProfilProps {
  profile: EngineerProfile;
  onChangeProfile: (profile: EngineerProfile) => void;
  onStartSimulation: () => void;
}

export const S0_Giris_Profil: React.FC<S0_Giris_ProfilProps> = ({
  profile,
  onChangeProfile,
  onStartSimulation,
}) => {
  const handleSelectLevel = (level: EngineerLevel) => {
    soundEffects.playClick();
    onChangeProfile({ ...profile, level });
  };

  const handleSelectRole = (role: EngineerRole) => {
    soundEffects.playClick();
    onChangeProfile({ ...profile, role });
  };

  const handleSelectGoal = (goal: PrimaryGoal) => {
    soundEffects.playClick();
    onChangeProfile({ ...profile, goal });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 max-w-xl mx-auto animate-fadeIn">
      {/* Top Lore & Title */}
      <div className="space-y-3">
        {/* Diamond Age Tag */}
        <div className="flex items-center justify-between border-b border-[#24324F] pb-2">
          <div className="flex items-center gap-2">
            <BookOpen size={14} className="text-[#8B5CF6]" />
            <span className="text-[10px] font-mono tracking-widest text-[#8B5CF6] uppercase font-bold">
              ILLUSTRATED PRIMER // SE SIMULATION
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#64748B]">SEASON 5 // 00:00:00</span>
        </div>

        {/* Title */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EF4444]/15 border border-[#EF4444]/40 text-[#EF4444] text-[10px] font-mono font-bold tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-ping" />
            ZERO HOUR INCIDENT
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#F9FAFB] leading-tight">
            SE Primer: Night Shift
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
            Neal Stephenson'ın <em className="text-[#DFE2F1]">The Diamond Age</em> eserindeki interaktif öğrenme kitabı konseptine dayanan kriz simülasyonu. 1.24 milyon oyuncunun hücum ettiği Sezon 5 lansmanında nöbetçi mühendissin.
          </p>
        </div>

        {/* Profile Configuration Matrix */}
        <div className="space-y-3.5 pt-1">
          {/* 1. SEVİYE SEÇİMİ (Junior vs Senior) */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-semibold text-[#DFE2F1] flex items-center justify-between">
              <span>1. MÜHENDİSLİK KIDEMİ</span>
              <span className="text-[9px] text-[#64748B]">ZAMAN BASKISI AYARI</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {/* Junior */}
              <button
                onClick={() => handleSelectLevel('junior')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative min-h-[72px] flex flex-col justify-between ${
                  profile.level === 'junior'
                    ? 'border-[#3B82F6] bg-[#151D2F] ring-1 ring-[#3B82F6] glow-primary'
                    : 'border-[#24324F] bg-[#151D2F]/50 hover:border-[#384C74]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#F9FAFB] flex items-center gap-1.5">
                    <Shield size={14} className="text-[#3B82F6]" />
                    Junior Mühendis
                  </span>
                  {profile.level === 'junior' && (
                    <CheckCircle2 size={14} className="text-[#3B82F6]" />
                  )}
                </div>
                <p className="text-[10px] text-[#94A3B8] mt-1 leading-snug">
                  Zaman sayacı yok. Sokratik ipuçlarına sınırsız ve serbest erişim.
                </p>
              </button>

              {/* Senior */}
              <button
                onClick={() => handleSelectLevel('senior')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative min-h-[72px] flex flex-col justify-between ${
                  profile.level === 'senior'
                    ? 'border-[#EF4444] bg-[#151D2F] ring-1 ring-[#EF4444] glow-danger'
                    : 'border-[#24324F] bg-[#151D2F]/50 hover:border-[#384C74]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#F9FAFB] flex items-center gap-1.5">
                    <Clock size={14} className="text-[#EF4444]" />
                    Senior Mühendis
                  </span>
                  {profile.level === 'senior' && (
                    <CheckCircle2 size={14} className="text-[#EF4444]" />
                  )}
                </div>
                <p className="text-[10px] text-[#94A3B8] mt-1 leading-snug">
                  60 sn kriz sayacı! Süre biterse sistem acil durum aksiyonunu tetikler.
                </p>
              </button>
            </div>
          </div>

          {/* 2. ROL SEÇİMİ (Backend vs SRE) */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-semibold text-[#DFE2F1] flex items-center justify-between">
              <span>2. OPERASYONEL ROL</span>
              <span className="text-[9px] text-[#64748B]">MİMARİ ODAK</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {/* Backend */}
              <button
                onClick={() => handleSelectRole('backend')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative min-h-[72px] flex flex-col justify-between ${
                  profile.role === 'backend'
                    ? 'border-[#3B82F6] bg-[#151D2F] ring-1 ring-[#3B82F6] glow-primary'
                    : 'border-[#24324F] bg-[#151D2F]/50 hover:border-[#384C74]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#F9FAFB] flex items-center gap-1.5">
                    <Cpu size={14} className="text-[#3B82F6]" />
                    Backend Mühendisi
                  </span>
                  {profile.role === 'backend' && (
                    <CheckCircle2 size={14} className="text-[#3B82F6]" />
                  )}
                </div>
                <p className="text-[10px] text-[#94A3B8] mt-1 leading-snug">
                  Concurrency, veritabanı kilitleri (deadlocks) ve transaction bütünlüğü.
                </p>
              </button>

              {/* SRE */}
              <button
                onClick={() => handleSelectRole('sre')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative min-h-[72px] flex flex-col justify-between ${
                  profile.role === 'sre'
                    ? 'border-[#3B82F6] bg-[#151D2F] ring-1 ring-[#3B82F6] glow-primary'
                    : 'border-[#24324F] bg-[#151D2F]/50 hover:border-[#384C74]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#F9FAFB] flex items-center gap-1.5">
                    <Server size={14} className="text-[#3B82F6]" />
                    SRE / DevOps
                  </span>
                  {profile.role === 'sre' && (
                    <CheckCircle2 size={14} className="text-[#3B82F6]" />
                  )}
                </div>
                <p className="text-[10px] text-[#94A3B8] mt-1 leading-snug">
                  Ingress routing, backpressure regülasyonu ve pod ölçeklendirme.
                </p>
              </button>
            </div>
          </div>

          {/* 3. ÖNCELİKLİ HEDEF (Sıfır Kayıp vs Hızlı Restorasyon) */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-semibold text-[#DFE2F1] flex items-center justify-between">
              <span>3. ÖNCELİKLİ HEDEF & KPI</span>
              <span className="text-[9px] text-[#64748B]">STRATEJİK TERCİH</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {/* Zero Loss */}
              <button
                onClick={() => handleSelectGoal('zero_loss')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative min-h-[72px] flex flex-col justify-between ${
                  profile.goal === 'zero_loss'
                    ? 'border-[#10B981] bg-[#151D2F] ring-1 ring-[#10B981] glow-success'
                    : 'border-[#24324F] bg-[#151D2F]/50 hover:border-[#384C74]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#F9FAFB] flex items-center gap-1.5">
                    <Database size={14} className="text-[#10B981]" />
                    Sıfır Veri Kaybı
                  </span>
                  {profile.goal === 'zero_loss' && (
                    <CheckCircle2 size={14} className="text-[#10B981]" />
                  )}
                </div>
                <p className="text-[10px] text-[#94A3B8] mt-1 leading-snug">
                  ACID garantisi, tam ledger mutabakatı ve tutarlılık (Consistency).
                </p>
              </button>

              {/* Fast Recovery */}
              <button
                onClick={() => handleSelectGoal('fast_recovery')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative min-h-[72px] flex flex-col justify-between ${
                  profile.goal === 'fast_recovery'
                    ? 'border-[#F59E0B] bg-[#151D2F] ring-1 ring-[#F59E0B]'
                    : 'border-[#24324F] bg-[#151D2F]/50 hover:border-[#384C74]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#F9FAFB] flex items-center gap-1.5">
                    <Zap size={14} className="text-[#F59E0B]" />
                    Hızlı Restorasyon
                  </span>
                  {profile.goal === 'fast_recovery' && (
                    <CheckCircle2 size={14} className="text-[#F59E0B]" />
                  )}
                </div>
                <p className="text-[10px] text-[#94A3B8] mt-1 leading-snug">
                  Oyuncu bekleme süresini minimize etme ve yüksek erişilebilirlik (HA).
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Live Incident Briefing Terminal Preview */}
        <div className="bg-[#0B0F19] border border-[#24324F] rounded-xl p-3 font-mono text-[11px] text-[#94A3B8] space-y-1">
          <div className="flex items-center justify-between text-[#64748B] text-[10px] border-b border-[#24324F] pb-1">
            <span className="flex items-center gap-1">
              <Terminal size={12} className="text-[#3B82F6]" />
              ALERTMANAGER // PAGERDUTY TICKET #9482
            </span>
            <span className="text-[#EF4444] font-bold">P1 CRITICAL</span>
          </div>
          <p className="text-[#DFE2F1] pt-1">
            &gt; 00:00:12 UTC: Ingress HTTP 504 threshold exceeded (46.4%).
          </p>
          <p className="text-[#DFE2F1]">
            &gt; 00:00:38 UTC: HikariCP connection pool saturated. Thread pool exhausted.
          </p>
          <p className="text-[#F59E0B]">
            &gt; SOKRATİK PRIMER DANIŞMAN: "Cevabı ben söylemem, doğru soruyu sordururum."
          </p>
        </div>
      </div>

      {/* Persistent Bottom Action Trigger (Min 48px height) */}
      <div className="pt-4 pb-2">
        <button
          onClick={() => {
            soundEffects.playClick();
            onStartSimulation();
          }}
          className="w-full min-h-[48px] py-3.5 px-4 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-[#F9FAFB] font-semibold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg glow-primary transition-all active:scale-[0.98] cursor-pointer"
        >
          <span>Primer'ı Başlat — Nöbeti Devral</span>
          <Flame size={16} />
        </button>
        <p className="text-[10px] font-mono text-center text-[#64748B] mt-2">
          GÖREV: 3 AŞAMALI MİMARİ TRIAGE // HEDEF: SEZON 5 ÇÖKÜŞÜNÜ ENGELLEMEK
        </p>
      </div>
    </div>
  );
};
