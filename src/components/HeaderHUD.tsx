import React from 'react';
import { Volume2, VolumeX, ShieldAlert, Activity, Clock, Server } from 'lucide-react';
import { MetricState, EngineerLevel } from '../types';

interface HeaderHUDProps {
  metrics: MetricState;
  level: EngineerLevel;
  stageNumber: number;
  totalStages: number;
  remainingSeconds: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenTutor?: () => void;
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({
  metrics,
  level,
  stageNumber,
  totalStages,
  remainingSeconds,
  isMuted,
  onToggleMute,
}) => {
  const isCriticalHealth = metrics.systemHealth < 40;
  const isNominalHealth = metrics.systemHealth >= 75;
  const isUrgentTimer = level === 'senior' && remainingSeconds <= 15;

  return (
    <header className="sticky top-0 z-40 bg-[#0B0F19]/95 backdrop-blur-md border-b border-[#24324F] px-3 py-2.5 shadow-lg select-none">
      {/* Top Banner Row */}
      <div className="flex items-center justify-between gap-2 max-w-xl mx-auto">
        {/* Left: Severity & Phase */}
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase ${
              isCriticalHealth
                ? 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40 glow-danger animate-pulse'
                : isNominalHealth
                ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40'
                : 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
            <ShieldAlert size={12} />
            <span>{isCriticalHealth ? 'SEV-1 OUTAGE' : isNominalHealth ? 'STABILIZED' : 'DEGRADED'}</span>
          </div>

          <div className="text-[11px] font-mono text-[#94A3B8] hidden xs:block">
            STAGE <span className="text-[#3B82F6] font-bold">{stageNumber}</span>/{totalStages}
          </div>
        </div>

        {/* Center / Right: Countdown Timer (Senior) or Guidance Badge (Junior) */}
        <div className="flex items-center gap-2">
          {level === 'senior' ? (
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded border font-mono text-xs font-semibold tabular-nums ${
                isUrgentTimer
                  ? 'bg-[#EF4444]/20 border-[#EF4444] text-[#EF4444] animate-pulse glow-danger'
                  : 'bg-[#151D2F] border-[#24324F] text-[#F9FAFB]'
              }`}
            >
              <Clock size={12} className={isUrgentTimer ? 'text-[#EF4444]' : 'text-[#3B82F6]'} />
              <span>00:{remainingSeconds.toString().padStart(2, '0')}</span>
              <span className="text-[9px] uppercase tracking-wider text-[#94A3B8]">KRİZ</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#8B5CF6] text-[10px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
              <span>SERBEST MOD</span>
            </div>
          )}

          {/* Sound Toggle Button */}
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
            className="w-8 h-8 rounded flex items-center justify-center bg-[#151D2F] border border-[#24324F] text-[#94A3B8] hover:text-[#F9FAFB] hover:border-[#3B82F6] transition-all cursor-pointer"
            title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} className="text-[#3B82F6]" />}
          </button>
        </div>
      </div>

      {/* Telemetry Strip Row */}
      <div className="grid grid-cols-4 gap-1.5 mt-2 max-w-xl mx-auto">
        {/* Health Meter */}
        <div className="bg-[#151D2F] border border-[#24324F] rounded px-2 py-1 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[9px] font-mono text-[#94A3B8]">
            <span>SAĞLIK</span>
            <Activity size={10} className={isCriticalHealth ? 'text-[#EF4444]' : 'text-[#10B981]'} />
          </div>
          <div className="flex items-baseline justify-between mt-0.5">
            <span
              className={`text-xs font-mono font-bold tabular-nums ${
                isCriticalHealth ? 'text-[#EF4444]' : isNominalHealth ? 'text-[#10B981]' : 'text-[#F59E0B]'
              }`}
            >
              %{metrics.systemHealth}
            </span>
          </div>
          <div className="w-full h-1 bg-[#0B0F19] rounded-full overflow-hidden mt-1">
            <div
              className={`h-full transition-all duration-500 ${
                isCriticalHealth ? 'bg-[#EF4444]' : isNominalHealth ? 'bg-[#10B981]' : 'bg-[#F59E0B]'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, metrics.systemHealth))}%` }}
            />
          </div>
        </div>

        {/* Error Rate */}
        <div className="bg-[#151D2F] border border-[#24324F] rounded px-2 py-1 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[9px] font-mono text-[#94A3B8]">
            <span>ERR 504</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
          </div>
          <span className="text-xs font-mono font-bold text-[#F9FAFB] tabular-nums mt-0.5">
            %{metrics.errorRate.toFixed(1)}
          </span>
          <div className="text-[8px] font-mono text-[#64748B]">HTTP FAIL</div>
        </div>

        {/* P99 Latency */}
        <div className="bg-[#151D2F] border border-[#24324F] rounded px-2 py-1 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[9px] font-mono text-[#94A3B8]">
            <span>P99 GECİKME</span>
          </div>
          <span className="text-xs font-mono font-bold text-[#F9FAFB] tabular-nums mt-0.5">
            {metrics.p99LatencyMs}ms
          </span>
          <div className="text-[8px] font-mono text-[#64748B]">ROUND-TRIP</div>
        </div>

        {/* Active TPS */}
        <div className="bg-[#151D2F] border border-[#24324F] rounded px-2 py-1 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[9px] font-mono text-[#94A3B8]">
            <span>TRAFİK</span>
            <Server size={10} className="text-[#3B82F6]" />
          </div>
          <span className="text-xs font-mono font-bold text-[#3B82F6] tabular-nums mt-0.5">
            {(metrics.activeTps / 1000).toFixed(1)}k TPS
          </span>
          <div className="text-[8px] font-mono text-[#64748B]">1.24M OYUNCU</div>
        </div>
      </div>
    </header>
  );
};
