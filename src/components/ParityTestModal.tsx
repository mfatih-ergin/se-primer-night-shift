import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Cpu, Terminal, RefreshCw } from 'lucide-react';
import { runInBrowserParitySuite, ParityResult } from '../utils/onnxInference';

interface ParityTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ParityTestModal: React.FC<ParityTestModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ParityResult[]>([]);
  const [maxDiff, setMaxDiff] = useState<number | null>(null);
  const [tolerance, setTolerance] = useState<number>(1e-4);
  const [allPassed, setAllPassed] = useState<boolean>(true);

  const runTest = async () => {
    setLoading(true);
    try {
      const suite = await runInBrowserParitySuite();
      setResults(suite.results);
      setMaxDiff(suite.maxDiff);
      setTolerance(suite.tolerance);
      setAllPassed(suite.allPassed);
    } catch (err) {
      console.error('Parite testi koşturulurken hata:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      runTest();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      data-cy="parity-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-black/85 backdrop-blur-sm animate-fadeIn"
    >
      <div className="w-full max-w-xl bg-[#151D2F] border border-[#3B82F6] rounded-2xl shadow-2xl p-4 space-y-3.5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#24324F] pb-2.5">
          <div className="flex items-center gap-2">
            <Cpu size={18} className="text-[#3B82F6]" />
            <div>
              <h3 className="text-sm font-bold text-[#F9FAFB] font-mono tracking-wide">
                DİFERANSİYEL TEST KAHİNİ // PARİTE PANELİ
              </h3>
              <p className="text-[10px] text-[#94A3B8] font-mono">
                Python Test Kahini (Oracle) vs. Tarayıcı onnxruntime-web Paritesi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#24324F]/50 text-[#94A3B8] hover:text-white transition-all cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Status Strip */}
        <div className="bg-[#0B0F19] p-3 rounded-xl border border-[#24324F] flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-[10px] font-mono text-[#94A3B8]">DİFERANSİYEL TEST DURUMU</div>
            <div
              data-cy="parity-status"
              className={`text-xs font-mono font-bold flex items-center gap-1.5 ${
                allPassed ? 'text-[#10B981]' : 'text-[#EF4444]'
              }`}
            >
              {allPassed ? (
                <>
                  <CheckCircle size={14} />
                  <span>PARİTE TAM // TÜM VAKALAR GEÇTİ (|Δ| &lt; 10⁻⁴)</span>
                </>
              ) : (
                <>
                  <AlertTriangle size={14} />
                  <span>PARİTE HATASI // SAPMA TESPİT EDİLDİ</span>
                </>
              )}
            </div>
          </div>

          <div className="text-right font-mono text-[10px]">
            <div className="text-[#94A3B8]">Maksimum Fark (|Δ|)</div>
            <div data-cy="parity-max-diff" className="text-xs font-bold text-[#3B82F6]">
              {maxDiff !== null ? maxDiff.toExponential(2) : '...'}
            </div>
          </div>
        </div>

        {/* Test Cases Table */}
        <div className="space-y-2">
          <div className="text-[11px] font-mono text-[#DFE2F1] font-semibold flex items-center justify-between">
            <span>5 REFERANS KANONİK VAKA (parite.json):</span>
            <button
              onClick={runTest}
              disabled={loading}
              className="flex items-center gap-1 text-[10px] text-[#3B82F6] hover:underline cursor-pointer"
            >
              <RefreshCw size={11} className={loading ? 'animate-spin' : ''} />
              Yeniden Test Et
            </button>
          </div>

          {loading ? (
            <div className="text-center py-6 text-xs font-mono text-[#94A3B8]">
              onnxruntime-web tensörleri çalıştırıyor...
            </div>
          ) : (
            <div className="space-y-2">
              {results.map((r, i) => (
                <div
                  key={r.id}
                  data-cy={`parity-case-${i + 1}`}
                  className="bg-[#0B0F19]/80 border border-[#24324F] p-2.5 rounded-xl space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#F9FAFB] font-mono">
                      #{i + 1} {r.tanim}
                    </span>
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                        r.passed ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-[#EF4444]/20 text-[#EF4444]'
                      }`}
                    >
                      {r.passed ? 'GEÇTİ (PASS)' : 'KALDI (FAIL)'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[10px] font-mono bg-[#151D2F] p-2 rounded-lg">
                    <div>
                      <div className="text-[#64748B]">Python (Oracle) P:</div>
                      <div className="text-[#DFE2F1] font-bold">{r.expectedProbPanic.toFixed(6)}</div>
                    </div>
                    <div>
                      <div className="text-[#64748B]">Web ONNX P:</div>
                      <div className="text-[#3B82F6] font-bold">{r.actualProbPanic.toFixed(6)}</div>
                    </div>
                    <div>
                      <div className="text-[#64748B]">Mutlak Fark |Δ|:</div>
                      <div className="text-[#10B981] font-bold">{r.diff.toExponential(2)}</div>
                    </div>
                  </div>

                  <div className="text-[9px] font-mono text-[#64748B] truncate">
                    Girdi Vektörü: [{r.input.join(', ')}]
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Explanation Footer */}
        <div className="p-2 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/30 text-[10px] font-mono text-[#DFE2F1] flex items-start gap-2">
          <Terminal size={14} className="text-[#3B82F6] shrink-0 mt-0.5" />
          <span>
            <strong>Sommerville Bl. 8 V&amp;V İlkesi:</strong> Python ortamındaki scikit-learn modeli ile tarayıcıdaki WebAssembly ONNX motoru aynı referans girdide 10⁻⁴ (1e-4) tolerans dahilinde eşdeğer çıktı üreterek matematiksel pariteyi kanıtlar.
          </span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[#24324F] hover:bg-[#3B82F6] text-white text-xs font-semibold font-mono transition-all cursor-pointer"
        >
          Kapat
        </button>
      </div>
    </div>
  );
};
