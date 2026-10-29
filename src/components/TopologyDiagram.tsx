import React, { useState } from 'react';
import { Globe, Cpu, Database, Layers, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { MetricState } from '../types';

interface TopologyDiagramProps {
  metrics: MetricState;
  stageNumber: number;
}

export const TopologyDiagram: React.FC<TopologyDiagramProps> = ({ metrics, stageNumber }) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Dynamic status based on stage and health
  const isHealthy = metrics.systemHealth >= 75;
  const isWarning = metrics.systemHealth < 75 && metrics.systemHealth >= 40;

  const nodes = [
    {
      id: 'edge',
      name: 'Edge CDN',
      tech: 'Cloudflare / DNS',
      icon: Globe,
      status: 'nominal',
      statusText: '1.24M conn',
      detail: 'Anycast DNS aktif, gelen 18.4K req/s doğrudan Ingress Gateway katmanına iletiliyor.',
    },
    {
      id: 'gateway',
      name: 'API Gateway',
      tech: 'Envoy / Nginx',
      icon: Layers,
      status: stageNumber === 1 && metrics.systemHealth < 60 ? 'critical' : isHealthy ? 'nominal' : 'warning',
      statusText: metrics.errorRate > 20 ? '504 SATURATED' : 'LEAKY BUCKET',
      detail:
        metrics.errorRate > 20
          ? 'Gateway worker thread havuzu tükendi, 504 Gateway Timeout logları basılıyor.'
          : 'Backpressure filtresi aktif. İstekler kabul edilebilir debide içeri alınıyor.',
    },
    {
      id: 'app_pods',
      name: 'Core Services',
      tech: 'Monolith & Pods',
      icon: Cpu,
      status: stageNumber === 2 && metrics.errorRate > 30 ? 'critical' : isWarning ? 'warning' : 'nominal',
      statusText: metrics.p99LatencyMs > 1200 ? 'DEADLOCK RISK' : 'HEALTHY POOL',
      detail:
        metrics.p99LatencyMs > 1200
          ? 'Market servisindeki row-level kilitlenmeler thread starvation tetikliyor.'
          : 'Podlar optimize edilmiş HikariCP havuzu ile stabil çalışıyor.',
    },
    {
      id: 'db',
      name: 'Primary DB',
      tech: 'PostgreSQL ACID',
      icon: Database,
      status: stageNumber === 3 && metrics.dataIntegrity < 50 ? 'critical' : isHealthy ? 'nominal' : 'warning',
      statusText: metrics.dataIntegrity < 70 ? 'ANOMALOUS DATA' : 'MUTABAKAT OK',
      detail:
        metrics.dataIntegrity < 70
          ? 'Cüzdan tablosunda tutarsız bakiye hareketleri ve race condition tespit edildi.'
          : 'Serializable transaction izolasyonu ve idempotency token aktif.',
    },
  ];

  return (
    <div className="bg-[#151D2F] border border-[#24324F] rounded-xl p-3 shadow-md">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse" />
          <span className="text-[11px] font-mono font-bold tracking-wide text-[#DFE2F1]">
            MİMARİ CANLI TOPOLOJİ
          </span>
        </div>
        <span className="text-[10px] font-mono text-[#64748B]">
          Düğüm detayları için tıkla
        </span>
      </div>

      {/* Horizontal Topology Flow */}
      <div className="grid grid-cols-4 gap-1 relative items-center">
        {nodes.map((node, index) => {
          const Icon = node.icon;
          const isSelected = selectedNode === node.id;
          const isCrit = node.status === 'critical';
          const isWarn = node.status === 'warning';

          return (
            <React.Fragment key={node.id}>
              <button
                onClick={() => setSelectedNode(isSelected ? null : node.id)}
                className={`relative flex flex-col items-center justify-center p-2 rounded-lg border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#3B82F6] bg-[#1B253B] ring-1 ring-[#3B82F6] glow-primary'
                    : isCrit
                    ? 'border-[#EF4444]/60 bg-[#EF4444]/10 hover:border-[#EF4444]'
                    : isWarn
                    ? 'border-[#F59E0B]/60 bg-[#F59E0B]/10 hover:border-[#F59E0B]'
                    : 'border-[#24324F] bg-[#0B0F19]/60 hover:border-[#384C74]'
                }`}
              >
                {/* Node Status Dot */}
                <span
                  className={`absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full ${
                    isCrit ? 'bg-[#EF4444] animate-ping' : isWarn ? 'bg-[#F59E0B]' : 'bg-[#10B981]'
                  }`}
                />

                <Icon
                  size={16}
                  className={`mb-1 ${
                    isCrit ? 'text-[#EF4444]' : isWarn ? 'text-[#F59E0B]' : 'text-[#3B82F6]'
                  }`}
                />
                <span className="text-[10px] font-mono font-semibold text-[#F9FAFB] truncate w-full text-center">
                  {node.name}
                </span>
                <span
                  className={`text-[8px] font-mono truncate w-full text-center mt-0.5 ${
                    isCrit ? 'text-[#EF4444]' : isWarn ? 'text-[#F59E0B]' : 'text-[#94A3B8]'
                  }`}
                >
                  {node.statusText}
                </span>
              </button>

              {index < nodes.length - 1 && (
                <div className="absolute hidden">
                  <ArrowRight size={10} className="text-[#24324F]" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Selected Node Details Drawer */}
      {selectedNode && (
        <div className="mt-2.5 p-2.5 rounded-lg bg-[#0B0F19] border border-[#3B82F6]/50 text-xs text-[#94A3B8] flex items-start gap-2 animate-fadeIn">
          {nodes.find((n) => n.id === selectedNode)?.status === 'critical' ? (
            <AlertCircle size={14} className="text-[#EF4444] shrink-0 mt-0.5" />
          ) : (
            <ShieldCheck size={14} className="text-[#3B82F6] shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <div className="flex items-center justify-between font-mono text-[11px] text-[#F9FAFB] font-semibold">
              <span>{nodes.find((n) => n.id === selectedNode)?.name}</span>
              <span className="text-[9px] text-[#3B82F6]">
                {nodes.find((n) => n.id === selectedNode)?.tech}
              </span>
            </div>
            <p className="mt-1 leading-relaxed text-[11px]">
              {nodes.find((n) => n.id === selectedNode)?.detail}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
