import React, { useState } from "react";
import { Search, Filter, Server, AlertTriangle, CheckCircle2, Send, Cpu } from "lucide-react";

export interface ValidatorData {
  address: string;
  moniker: string;
  peerId: string;
  region: string;
  shardId: number;
  commissionBps: number;
  hardwareSpecs: string;
  status: "Active" | "Degraded" | "Slashed";
  lastHeartbeatTime: number;
  lastBlockHeight: number;
  peerCount: number;
  latencyMs: number;
  totalHeartbeats: number;
  uptimeScore: number;
}

interface ValidatorListProps {
  validators: ValidatorData[];
  onPingNode: (operatorAddress: string) => void;
  onInspectNode: (validator: ValidatorData) => void;
  isPinging: string | null;
}

export const ValidatorList: React.FC<ValidatorListProps> = ({
  validators,
  onPingNode,
  onInspectNode,
  isPinging,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const filtered = validators.filter((v) => {
    const matchesSearch =
      v.moniker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.peerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `shard ${v.shardId}`.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || v.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="glass-panel rounded-2xl p-6 my-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold font-mono text-white flex items-center space-x-2">
            <Server className="w-5 h-5 text-cyberCyan" />
            <span>Portaldot Validator Node Fleet</span>
            <span className="text-xs font-normal text-gray-400 bg-surface px-2 py-0.5 rounded border border-white/5">
              {filtered.length} nodes registered
            </span>
          </h2>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            Real-time consensus participation, peer count, and on-chain telemetry
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search moniker, address, shard..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-surface/90 border border-white/10 rounded-lg pl-9 pr-3.5 py-1.5 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-cyberCyan transition-all w-52 sm:w-64"
            />
          </div>

          <div className="flex items-center space-x-1.5 bg-surface/90 border border-white/10 rounded-lg p-1 text-xs font-mono">
            <Filter className="w-3.5 h-3.5 text-gray-400 ml-1.5" />
            {["All", "Active", "Degraded"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2.5 py-1 rounded-md text-[11px] transition-all ${
                  statusFilter === status
                    ? "bg-cyberCyan/20 text-cyberCyan font-semibold"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((node) => {
          const isDegraded = node.status === "Degraded";
          const isSlashed = node.status === "Slashed";

          return (
            <div
              key={node.address}
              className="glass-panel glass-panel-hover rounded-xl p-4 flex flex-col justify-between border border-white/5 relative group"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-white text-sm">
                        {node.moniker}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/20">
                        Shard #{node.shardId}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-gray-400 mt-0.5">
                      {node.region} • {(node.commissionBps / 100).toFixed(2)}% Commission
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium ${
                      isSlashed
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : isDegraded
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    }`}
                  >
                    {isSlashed ? (
                      <AlertTriangle className="w-3 h-3" />
                    ) : isDegraded ? (
                      <AlertTriangle className="w-3 h-3" />
                    ) : (
                      <CheckCircle2 className="w-3 h-3" />
                    )}
                    <span>{node.status}</span>
                  </span>
                </div>

                <div className="bg-surface/80 rounded-lg p-2.5 my-3 border border-white/5 text-xs font-mono space-y-1.5">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-gray-400">Operator Address:</span>
                    <span className="text-gray-300 font-mono">
                      {node.address.substring(0, 6)}...{node.address.substring(node.address.length - 4)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-gray-400">LibP2P Peers:</span>
                    <span className="text-cyberCyan font-mono">{node.peerCount} Peers Connected</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-gray-400">Consensus Latency:</span>
                    <span
                      className={`font-mono ${
                        node.latencyMs < 60 ? "text-cyberGreen" : "text-amber-400"
                      }`}
                    >
                      {node.latencyMs} ms
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-gray-400">Hardware Spec:</span>
                    <span className="text-gray-300 truncate max-w-[140px]" title={node.hardwareSpecs}>
                      {node.hardwareSpecs}
                    </span>
                  </div>
                </div>

                <div className="my-2">
                  <div className="flex justify-between text-[11px] font-mono mb-1">
                    <span className="text-gray-400">Uptime Reliability</span>
                    <span className="text-cyberGreen font-semibold">{node.uptimeScore}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${node.uptimeScore}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between mt-2 gap-2">
                <button
                  onClick={() => onInspectNode(node)}
                  className="flex-1 text-[11px] font-mono py-1.5 px-2.5 rounded bg-surface hover:bg-white/5 text-gray-300 border border-white/10 transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Cpu className="w-3.5 h-3.5 text-cyberPurple" />
                  <span>Telemetry</span>
                </button>

                <button
                  onClick={() => onPingNode(node.address)}
                  disabled={isPinging === node.address}
                  className="flex-1 text-[11px] font-mono py-1.5 px-2.5 rounded bg-cyberCyan/15 hover:bg-cyberCyan/25 text-cyberCyan border border-cyberCyan/30 transition-all flex items-center justify-center space-x-1.5 active:scale-95 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isPinging === node.address ? "Pinging..." : "Pulse Heartbeat"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
