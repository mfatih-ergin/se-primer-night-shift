/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  EngineerProfile, 
  MetricState, 
  DecisionChoice, 
  DecisionRecord, 
  SimulationEndState 
} from './types';
import { INITIAL_METRICS, STAGES_DATA } from './data/simulationData';
import { HeaderHUD } from './components/HeaderHUD';
import { S0_Giris_Profil } from './components/S0_Giris_Profil';
import { S1_Karar_Arenasi } from './components/S1_Karar_Arenasi';
import { S2_Sonuc_PostMortem } from './components/S2_Sonuc_PostMortem';
import { soundEffects } from './utils/audio';

type ScreenState = 'profile' | 'decision' | 'result';

export default function App() {
  const [screen, setScreen] = useState<ScreenState>('profile');
  const [profile, setProfile] = useState<EngineerProfile>({
    level: 'junior',
    role: 'backend',
    goal: 'zero_loss',
  });

  const [metrics, setMetrics] = useState<MetricState>(INITIAL_METRICS);
  const [stageIndex, setStageIndex] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(60);
  const [isStageResolved, setIsStageResolved] = useState(false);
  const [lastDecision, setLastDecision] = useState<DecisionRecord | null>(null);
  const [decisions, setDecisions] = useState<DecisionRecord[]>([]);
  const [isMuted, setIsMuted] = useState(soundEffects.getMuted());

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sound mute toggle
  const handleToggleMute = () => {
    const nextMuted = soundEffects.toggleMute();
    setIsMuted(nextMuted);
  };

  // Senior countdown timer
  useEffect(() => {
    if (screen !== 'decision' || profile.level !== 'senior' || isStageResolved) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        if (prev === 16) {
          soundEffects.playWarning();
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [screen, profile.level, isStageResolved, stageIndex]);

  // Start Simulation from Screen 0
  const handleStartSimulation = () => {
    setMetrics(INITIAL_METRICS);
    setStageIndex(0);
    setRemainingSeconds(60);
    setIsStageResolved(false);
    setLastDecision(null);
    setDecisions([]);
    setScreen('decision');
  };

  // User or Auto-triggered Decision in Stage
  const handleSelectDecision = (choice: DecisionChoice, wasAutoTriggered = false) => {
    if (isStageResolved) return;

    const timeSpent = profile.level === 'senior' ? 60 - remainingSeconds : 0;
    const record: DecisionRecord = {
      stageNumber: stageIndex + 1,
      chosenId: choice.id,
      choice,
      timeSpentSeconds: timeSpent,
      wasAutoTriggered,
    };

    setLastDecision(record);
    setDecisions((prev) => [...prev, record]);
    setIsStageResolved(true);

    // Apply metrics impact
    setMetrics((prev) => {
      const newHealth = Math.min(100, Math.max(5, prev.systemHealth + choice.metricsImpact.healthDelta));
      const newErrorRate = Math.max(0.5, prev.errorRate + choice.metricsImpact.errorRateDelta);
      const newLatency = Math.max(120, prev.p99LatencyMs + choice.metricsImpact.latencyDelta);
      const newIntegrity = Math.min(100, Math.max(5, prev.dataIntegrity + choice.metricsImpact.dataIntegrityDelta));

      return {
        ...prev,
        systemHealth: newHealth,
        errorRate: newErrorRate,
        p99LatencyMs: newLatency,
        dataIntegrity: newIntegrity,
      };
    });

    if (choice.isRecommendedByBestPractice) {
      soundEffects.playSuccess();
    } else {
      soundEffects.playWarning();
    }
  };

  // Proceed to Next Stage or Post-Mortem
  const handleProceedToNext = () => {
    if (stageIndex < STAGES_DATA.length - 1) {
      setStageIndex((prev) => prev + 1);
      setRemainingSeconds(60);
      setIsStageResolved(false);
      setLastDecision(null);
    } else {
      // Simulation finished, calculate end state
      setScreen('result');
      // If stabilized, play success chord
      const correctDecisions = decisions.filter((d) => d.choice.isRecommendedByBestPractice);
      if (correctDecisions.length >= 2) {
        soundEffects.playSuccess();
      } else {
        soundEffects.playAlarm();
      }
    }
  };

  // Determine Final End State: En az 2 doğru teknik karar (özellikle Test ve Veri)
  const calculateEndState = (): SimulationEndState => {
    const correctCount = decisions.filter((d) => d.choice.isRecommendedByBestPractice).length;
    return correctCount >= 2 ? 'STABILIZED' : 'COLLAPSE';
  };

  // Restart Simulation
  const handleRestart = () => {
    setScreen('profile');
    setMetrics(INITIAL_METRICS);
    setStageIndex(0);
    setRemainingSeconds(60);
    setIsStageResolved(false);
    setLastDecision(null);
    setDecisions([]);
  };

  const currentStage = STAGES_DATA[stageIndex] || STAGES_DATA[0];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#DFE2F1] flex justify-center font-sans">
      {/* Central Mobile Container with Responsive Bounds */}
      <div className="w-full max-w-md min-h-screen flex flex-col bg-[#0B0F19] border-x border-[#24324F]/50 shadow-2xl relative">
        {/* Header HUD: Active during decision arena & post-mortem */}
        {screen !== 'profile' && (
          <HeaderHUD
            metrics={metrics}
            level={profile.level}
            stageNumber={stageIndex + 1}
            totalStages={STAGES_DATA.length}
            remainingSeconds={remainingSeconds}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
          />
        )}

        {/* Screen 0: Initial Profile Configuration */}
        {screen === 'profile' && (
          <S0_Giris_Profil
            profile={profile}
            onChangeProfile={setProfile}
            onStartSimulation={handleStartSimulation}
          />
        )}

        {/* Screen 1: Decision Arena */}
        {screen === 'decision' && (
          <S1_Karar_Arenasi
            stage={currentStage}
            profile={profile}
            metrics={metrics}
            remainingSeconds={remainingSeconds}
            onSelectDecision={handleSelectDecision}
            onProceedToNext={handleProceedToNext}
            lastDecision={lastDecision}
            isStageResolved={isStageResolved}
          />
        )}

        {/* Screen 2: Results & Post-Mortem */}
        {screen === 'result' && (
          <S2_Sonuc_PostMortem
            endState={calculateEndState()}
            decisions={decisions}
            profile={profile}
            onRestart={handleRestart}
          />
        )}
      </div>
    </div>
  );
}
