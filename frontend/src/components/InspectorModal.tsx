import React from "react";
import { X, ShieldAlert, Cpu, HardDrive, Network, CheckCircle2, AlertTriangle, Radio } from "lucide-react";
import type { ValidatorData } from "./ValidatorList";

interface InspectorModalProps {
  node: ValidatorData | null;
  onClose: () => void;
  onInspectReportDowntime: (address: string) => void;
}

export const InspectorModal: React.FC<InspectorModalProps> = ({
  node,
  onClose,
  onInspectReportDowntime,
}) => {
  if (!node) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-xl rounded-2xl p-6 border border-white/10 shadow-2xl relative font-mono text-xs">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-cyberCyan/15 border border-cyberCyan/30 flex items-center justify-center text-cyberCyan shadow-neon-cyan">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold text-white">{node.moniker}</h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Shard #{node.shardId}
              </span>
            </div>
            <p className="text-gray-400 text-[11px] truncate max-w-sm mt-0.5">
              Peer ID: {node.peerId}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-surface/90 rounded-xl p-3 border border-white/5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-gray-400 text-[11px] mb-1">
              <span>CPU Core Load</span>
              <Cpu className="w-3.5 h-3.5 text-cyberCyan" />
            </div>
            <div className="text-lg font-bold text-white">32.4%</div>
            <div className="w-full h-1 bg-gray-800 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-cyberCyan rounded-full" style={{ width: "32.4%" }} />
            </div>
          </div>

          <div className="bg-surface/90 rounded-xl p-3 border border-white/5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-gray-400 text-[11px] mb-1">
              <span>RAM Allocation</span>
              <HardDrive className="w-3.5 h-3.5 text-cyberPurple" />
            </div>
            <div className="text-lg font-bold text-white">41.8 GB</div>
            <div className="w-full h-1 bg-gray-800 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-cyberPurple rounded-full" style={{ width: "45%" }} />
            </div>
          </div>

          <div className="bg-surface/90 rounded-xl p-3 border border-white/5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-gray-400 text-[11px] mb-1">
              <span>Mesh Peers</span>
              <Network className="w-3.5 h-3.5 text-cyberGreen" />
            </div>
            <div className="text-lg font-bold text-white">{node.peerCount} Nodes</div>
            <div className="w-full h-1 bg-gray-800 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-cyberGreen rounded-full" style={{ width: "85%" }} />
            </div>
          </div>
        </div>

        <div className="bg-surface/60 rounded-xl p-4 border border-white/5 space-y-2 mb-5">
          <div className="flex justify-between items-center py-1 border-b border-white/5">
            <span className="text-gray-400">Operator Address:</span>
            <span className="text-gray-200">{node.address}</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-white/5">
            <span className="text-gray-400">Deployment Region:</span>
            <span className="text-gray-200">{node.region}</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-white/5">
            <span className="text-gray-400">Hardware Profile:</span>
            <span className="text-gray-200">{node.hardwareSpecs}</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-white/5">
            <span className="text-gray-400">Consensus Round Latency:</span>
            <span className="text-cyberGreen font-bold">{node.latencyMs} ms</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-white/5">
            <span className="text-gray-400">Total Heartbeat Records:</span>
            <span className="text-gray-200">{node.totalHeartbeats.toLocaleString()} pings</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-gray-400">Slashing Risk Index:</span>
            <span
              className={`font-bold flex items-center space-x-1 ${
                node.status === "Active" ? "text-cyberGreen" : "text-amber-400"
              }`}
            >
              {node.status === "Active" ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Optimal (0% Slashing Probability)</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>High (Downtime Warning Active)</span>
                </>
              )}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => onInspectReportDowntime(node.address)}
            className="px-3.5 py-2 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30 transition-all flex items-center space-x-2 text-[11px]"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Trigger Slashing Watchdog</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-surface hover:bg-white/10 text-gray-300 border border-white/10 transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
