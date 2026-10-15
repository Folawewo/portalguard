import React from "react";
import { Activity, Zap, Cpu, Server, Clock, Layers } from "lucide-react";

interface MetricsBarProps {
  currentBlock: number;
  activeCount: number;
  totalCount: number;
  networkTps: number;
}

export const MetricsBar: React.FC<MetricsBarProps> = ({
  currentBlock,
  activeCount,
  totalCount,
  networkTps,
}) => {
  const cards = [
    {
      label: "Block Height",
      value: `#${currentBlock.toLocaleString()}`,
      subtext: "Sub-second block production",
      icon: Clock,
      color: "text-cyberCyan",
      border: "border-cyberCyan/20",
      accent: "from-cyberCyan/10",
    },
    {
      label: "Active Validators",
      value: `${activeCount} / ${totalCount}`,
      subtext: "99.8% Network Consensus SLA",
      icon: Server,
      color: "text-cyberGreen",
      border: "border-cyberGreen/20",
      accent: "from-cyberGreen/10",
    },
    {
      label: "Network Throughput",
      value: `${networkTps.toLocaleString()} TPS`,
      subtext: "Peak capacity 10K+ TPS",
      icon: Zap,
      color: "text-cyberPurple",
      border: "border-cyberPurple/20",
      accent: "from-cyberPurple/10",
    },
    {
      label: "Consensus Finality",
      value: "< 0.82s",
      subtext: "LAO NPoS Consensus",
      icon: Activity,
      color: "text-pink-400",
      border: "border-pink-500/20",
      accent: "from-pink-500/10",
    },
    {
      label: "Dynamic Sharding",
      value: "256 / 256",
      subtext: "DHSA Shard Partitioning",
      icon: Layers,
      color: "text-blue-400",
      border: "border-blue-500/20",
      accent: "from-blue-500/10",
    },
    {
      label: "Slashing Sentinel",
      value: "0 Slashed",
      subtext: "Active automated protection",
      icon: Cpu,
      color: "text-emerald-400",
      border: "border-emerald-500/20",
      accent: "from-emerald-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 my-6">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className={`glass-panel rounded-xl p-4 flex flex-col justify-between border ${c.border} bg-gradient-to-b ${c.accent} to-transparent relative overflow-hidden`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400">
                {c.label}
              </span>
              <Icon className={`w-4 h-4 ${c.color}`} />
            </div>
            <div className="text-xl font-bold font-mono text-white tracking-tight">
              {c.value}
            </div>
            <div className="text-[10px] text-gray-500 font-mono mt-1 truncate">
              {c.subtext}
            </div>
          </div>
        );
      })}
    </div>
  );
};
