"use client";

import React, { useState } from 'react';
import { Rocket, Play, RotateCcw, Info, Target, Zap, Weight, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
type Engine = {
  id: string;
  name: string;
  thrust: number;
  isp: number;
  mass: number;
  cost: number;
};

type Tank = {
  id: string;
  name: string;
  propellantMass: number;
  dryMass: number;
  cost: number;
};

type StageConfig = {
  engine: Engine | null;
  tank: Tank | null;
};

type RocketConfig = {
  stages: StageConfig[];
  payloadMass: number;
};

// Components
const ENGINES: Engine[] = [
  { id: 'merlin', name: 'Merlin 1D', thrust: 845, isp: 282, mass: 470, cost: 2.5 },
  { id: 'raptor', name: 'Raptor 3', thrust: 2800, isp: 330, mass: 1520, cost: 8.0 },
  { id: 'small', name: 'Small Thruster', thrust: 45, isp: 310, mass: 85, cost: 0.4 },
];

const TANKS: Tank[] = [
  { id: 'small', name: 'Small Tank', propellantMass: 850, dryMass: 120, cost: 1.2 },
  { id: 'medium', name: 'Medium Tank', propellantMass: 2200, dryMass: 280, cost: 2.8 },
  { id: 'large', name: 'Large Tank', propellantMass: 4800, dryMass: 520, cost: 5.1 },
];

// Physics
function calculateDeltaV(rocket: RocketConfig): number {
  let totalDeltaV = 0;
  let currentMass = rocket.payloadMass;

  for (let i = rocket.stages.length - 1; i >= 0; i--) {
    const stage = rocket.stages[i];
    if (!stage.engine || !stage.tank) continue;

    const stageDryMass = stage.engine.mass + stage.tank.dryMass;
    const stageWetMass = stageDryMass + stage.tank.propellantMass;
    
    const initialMass = currentMass + stageWetMass;
    const finalMass = currentMass + stageDryMass;

    if (finalMass <= 0) continue;

    const deltaV = stage.engine.isp * 9.81 * Math.log(initialMass / finalMass);
    totalDeltaV += deltaV;
    currentMass += stageDryMass;
  }
  return Math.round(totalDeltaV);
}

function calculateTWR(rocket: RocketConfig): number {
  let totalThrust = 0;
  let totalMass = rocket.payloadMass;

  rocket.stages.forEach(stage => {
    if (stage.engine && stage.tank) {
      totalThrust += stage.engine.thrust;
      totalMass += stage.engine.mass + stage.tank.dryMass + stage.tank.propellantMass;
    }
  });

  if (totalMass === 0) return 0;
  return Number((totalThrust * 1000 / (totalMass * 9.81)).toFixed(2));
}

function calculateBurnTime(rocket: RocketConfig): number {
  let totalBurnTime = 0;

  rocket.stages.forEach(stage => {
    if (stage.engine && stage.tank) {
      const propellantMass = stage.tank.propellantMass;
      const thrust = stage.engine.thrust * 1000;
      const exhaustVelocity = stage.engine.isp * 9.81;
      const massFlow = thrust / exhaustVelocity;
      
      if (massFlow > 0) {
        totalBurnTime += propellantMass / massFlow;
      }
    }
  });
  return Math.round(totalBurnTime);
}

function calculateTotalCost(rocket: RocketConfig): number {
  let cost = 0;
  rocket.stages.forEach(stage => {
    if (stage.engine) cost += stage.engine.cost;
    if (stage.tank) cost += stage.tank.cost;
  });
  return cost;
}

export default function RocketForge() {
  const [rocket, setRocket] = useState<RocketConfig>({
    stages: [
      { engine: null, tank: null },
      { engine: null, tank: null },
    ],
    payloadMass: 500,
  });

  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const deltaV = calculateDeltaV(rocket);
  const twr = calculateTWR(rocket);
  const burnTime = calculateBurnTime(rocket);
  const totalCost = calculateTotalCost(rocket);
  const totalMass = rocket.payloadMass + 
    rocket.stages.reduce((sum, s) => {
      if (s.engine && s.tank) {
        return sum + s.engine.mass + s.tank.dryMass + s.tank.propellantMass;
      }
      return sum;
    }, 0);

  const canSimulate = rocket.stages.some(s => s.engine && s.tank);

  const updateStage = (stageIndex: number, key: 'engine' | 'tank', value: Engine | Tank | null) => {
    const newStages = [...rocket.stages];
    newStages[stageIndex] = { ...newStages[stageIndex], [key]: value };
    setRocket({ ...rocket, stages: newStages });
    setShowResults(false);
  };

  const updatePayload = (mass: number) => {
    setRocket({ ...rocket, payloadMass: Math.max(50, Math.min(5000, mass)) });
    setShowResults(false);
  };

  const resetRocket = () => {
    setRocket({
      stages: [{ engine: null, tank: null }, { engine: null, tank: null }],
      payloadMass: 500,
    });
    setIsSimulating(false);
    setSimulationProgress(0);
    setShowResults(false);
  };

  const runSimulation = async () => {
    if (!canSimulate) return;

    setIsSimulating(true);
    setSimulationProgress(0);
    setShowResults(false);

    for (let i = 0; i <= 100; i += 2) {
      await new Promise(resolve => setTimeout(resolve, 32));
      setSimulationProgress(i);
    }

    setIsSimulating(false);
    setShowResults(true);
  };

  // Simple educational insights
  const getInsights = () => {
    const insights: string[] = [];
    if (deltaV > 7800) insights.push("This configuration is theoretically capable of reaching low Earth orbit.");
    if (twr < 1.2) insights.push("Your thrust-to-weight ratio is marginal. You may struggle to lift off.");
    if (burnTime > 300) insights.push("Long burn times are good for efficiency but require very durable engines.");
    if (rocket.stages.length > 1 && rocket.stages[0].engine && rocket.stages[1].engine) {
      insights.push("Staging allows you to discard dead weight. This is the most important concept in rocketry.");
    }
    return insights.length > 0 ? insights : ["Keep building. Every change teaches you something about the rocket equation."];
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-white/10 bg-zinc-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center">
              <Rocket className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="font-semibold tracking-tight text-xl">RocketForge</div>
              <div className="text-[10px] text-white/50 -mt-1">EDUCATIONAL SIMULATOR</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={resetRocket} className="flex items-center gap-2 px-4 py-2 text-sm rounded-full border border-white/20 hover:bg-white/5 transition-colors">
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
            <button onClick={runSimulation} disabled={!canSimulate || isSimulating} className="flex items-center gap-2 px-6 py-2 bg-white text-black rounded-full font-medium text-sm disabled:opacity-40 hover:bg-white/90 transition-all active:scale-[0.985]">
              <Play className="w-4 h-4" /> {isSimulating ? "LAUNCHING..." : "LAUNCH SIMULATION"}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 pt-8 pb-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-xs tracking-[3px] text-white/50 mb-1">SPACEFLIGHT EDUCATION</div>
            <h1 className="text-5xl font-semibold tracking-tighter">Build Your Rocket</h1>
          </div>
          <div className="text-right">
            <div className="text-3xl font-mono font-medium tabular-nums">{deltaV.toLocaleString()}</div>
            <div className="text-xs text-white/50 -mt-1">m/s Δv</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Component Library */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-4 h-4" />
                <div className="font-medium">Payload Mass</div>
              </div>
              <div className="flex items-center gap-4">
                <input type="range" min="50" max="5000" step="50" value={rocket.payloadMass} onChange={(e) => updatePayload(parseInt(e.target.value))} className="flex-1 accent-white" />
                <div className="w-20 text-right font-mono text-lg">{rocket.payloadMass} kg</div>
              </div>
            </div>

            {rocket.stages.map((stage, index) => (
              <div key={index} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="font-medium mb-4">Stage {index + 1}</div>
                
                <div className="mb-4">
                  <div className="text-xs text-white/60 mb-2">ENGINE</div>
                  <div className="grid grid-cols-1 gap-2">
                    {ENGINES.map(engine => (
                      <button key={engine.id} onClick={() => updateStage(index, 'engine', engine)} className={`p-3 rounded-2xl border text-left transition-all ${stage.engine?.id === engine.id ? 'border-white bg-white/10' : 'border-white/10 hover:border-white/30'}`}>
                        <div className="font-medium">{engine.name}</div>
                        <div className="text-xs text-white/60 mt-1">{engine.thrust} kN • {engine.isp}s Isp</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-white/60 mb-2">TANK</div>
                  <div className="grid grid-cols-1 gap-2">
                    {TANKS.map(tank => (
                      <button key={tank.id} onClick={() => updateStage(index, 'tank', tank)} className={`p-3 rounded-2xl border text-left transition-all ${stage.tank?.id === tank.id ? 'border-white bg-white/10' : 'border-white/10 hover:border-white/30'}`}>
                        <div className="font-medium">{tank.name}</div>
                        <div className="text-xs text-white/60 mt-1">{tank.propellantMass} kg propellant</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Visualization */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-white/10 bg-zinc-900 p-8 h-full flex flex-col">
              <div className="text-sm text-white/60 mb-6 flex items-center justify-between">
                <div>ROCKET PREVIEW</div>
                <div className="font-mono text-xs">TOTAL MASS: {Math.round(totalMass)} kg</div>
              </div>

              <div className="flex-1 flex items-center justify-center relative min-h-[420px]">
                <div className="rocket-container">
                  {rocket.stages.slice().reverse().map((stage, visualIndex) => {
                    const isPresent = stage.engine && stage.tank;
                    return (
                      <motion.div key={visualIndex} className={`stage mb-1 ${isPresent ? 'opacity-100' : 'opacity-30'}`} animate={{ y: isSimulating ? -simulationProgress * 3.2 : 0 }}>
                        <div className="rocket-body w-[92px] mx-auto rounded-xl bg-zinc-800 border border-white/20 overflow-hidden">
                          {stage.tank && (
                            <div className="h-16 bg-gradient-to-b from-blue-900/70 to-blue-950/70 relative">
                              <div className="fuel-bar absolute bottom-0 left-0 right-0 bg-blue-500/60" style={{ height: isSimulating ? `${100 - simulationProgress}%` : '100%' }} />
                            </div>
                          )}
                          {stage.engine && <div className="h-8 bg-zinc-900 flex items-center justify-center"><div className="w-6 h-1.5 bg-orange-500 rounded" /></div>}
                        </div>
                      </motion.div>
                    );
                  })}
                  <div className="w-[68px] h-9 mx-auto bg-zinc-700 rounded-t-3xl border border-white/20 -mb-1" />
                </div>
              </div>

              <div className="text-center text-xs text-white/50 mt-4">
                {canSimulate ? "Ready to launch" : "Add at least one engine + tank to simulate"}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="lg:col-span-3 space-y-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="text-xs text-white/60 mb-3">PERFORMANCE</div>
              <div className="space-y-4">
                <div><div className="flex justify-between text-sm text-white/70"><span>Δv</span><span className="font-mono text-3xl">{deltaV}</span></div><div className="text-[10px] text-white/50">m/s</div></div>
                <div><div className="flex justify-between text-sm text-white/70"><span>TWR</span><span className="font-mono text-3xl">{twr}</span></div><div className="text-[10px] text-white/50">thrust-to-weight</div></div>
                <div><div className="flex justify-between text-sm text-white/70"><span>Burn Time</span><span className="font-mono text-3xl">{burnTime}</span></div><div className="text-[10px] text-white/50">seconds</div></div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm">
              <div className="text-xs text-white/60 mb-3">COST &amp; MASS</div>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-white/70">Est. Cost</span><span className="font-mono">${totalCost.toFixed(1)}M</span></div>
                <div className="flex justify-between"><span className="text-white/70">Total Mass</span><span className="font-mono">{Math.round(totalMass)} kg</span></div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-xs text-white/70">
              <div className="font-medium text-white mb-2 flex items-center gap-2"><Info className="w-3.5 h-3.5" /> The Rocket Equation</div>
              Δv = Isp × g₀ × ln(m₀ / m_f)
            </div>
          </div>
        </div>

        {/* Results + Insights */}
        <AnimatePresence>
          {showResults && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 rounded-3xl border border-white/10 bg-zinc-900 p-8">
              <div className="text-center">
                <div className="text-emerald-400 text-sm tracking-[2px]">MISSION COMPLETE</div>
                <div className="text-4xl font-semibold mt-2 mb-6">Your rocket achieved <span className="font-mono">{deltaV}</span> m/s Δv</div>
              </div>

              <div className="max-w-2xl mx-auto">
                <div className="text-white/80 text-sm mb-2">What this configuration teaches you:</div>
                <ul className="space-y-1.5 text-sm text-white/70">
                  {getInsights().map((insight, i) => (
                    <li key={i} className="flex gap-2">→ {insight}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
