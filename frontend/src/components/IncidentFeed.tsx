import React from "react";
import { Terminal, ShieldCheck, AlertCircle, RefreshCw } from "lucide-react";

export interface NetworkEvent {
  id: string;
  timestamp: string;
  type: "heartbeat" | "epoch" | "alert" | "info";
  message: string;
}

interface IncidentFeedProps {
  events: NetworkEvent[];
}

export const IncidentFeed: React.FC<IncidentFeedProps> = ({ events }) => {
  return (
    <div className="glass-panel rounded-2xl p-6 my-6 font-mono text-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-cyberCyan" />
          <h3 className="text-sm font-bold text-white">Live On-Chain Telemetry & Watchdog Stream</h3>
        </div>
        <div className="flex items-center space-x-2 text-[11px] text-gray-400">
          <RefreshCw className="w-3 h-3 text-cyberGreen animate-spin-slow" />
          <span>Real-time Stream</span>
        </div>
      </div>

      <div className="bg-surface/80 rounded-xl p-3 border border-white/5 max-h-52 overflow-y-auto space-y-2">
        {events.map((ev) => (
          <div key={ev.id} className="flex items-start space-x-2.5 text-[11px] py-1 border-b border-white/5 last:border-0">
            <span className="text-gray-500 whitespace-nowrap">{ev.timestamp}</span>
            {ev.type === "alert" ? (
              <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            ) : ev.type === "heartbeat" ? (
              <ShieldCheck className="w-3.5 h-3.5 text-cyberGreen shrink-0 mt-0.5" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-cyberCyan shrink-0 mt-1.5 ml-1" />
            )}
            <span className={ev.type === "alert" ? "text-amber-300" : "text-gray-300"}>
              {ev.message}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
