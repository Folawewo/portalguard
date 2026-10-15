import React, { useState } from "react";
import { X, Server, CheckCircle2 } from "lucide-react";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: {
    moniker: string;
    peerId: string;
    region: string;
    shardId: number;
    commissionBps: number;
    hardwareSpecs: string;
  }) => void;
  isSubmitting: boolean;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const [moniker, setMoniker] = useState("");
  const [peerId, setPeerId] = useState("");
  const [region, setRegion] = useState("EU-Central (Frankfurt)");
  const [shardId, setShardId] = useState<number>(42);
  const [commission, setCommission] = useState<number>(5);
  const [hardwareSpecs, setHardwareSpecs] = useState("32-Core AMD EPYC, 64GB RAM, 1TB NVMe");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      moniker: moniker || "My-Portaldot-Node",
      peerId: peerId || `12D3KooW${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`,
      region,
      shardId: Number(shardId),
      commissionBps: Math.round(commission * 100),
      hardwareSpecs,
    });
  };

  const handleQuickFill = () => {
    const randomId = Math.floor(Math.random() * 256);
    setMoniker(`Portal-Sentinel-Node-${randomId}`);
    setPeerId(`12D3KooW${Math.random().toString(36).substring(2, 14)}Z8n1`);
    setShardId(randomId);
    setCommission(4.5);
    setHardwareSpecs("64-Core AMD EPYC 9654, 128GB DDR5, Dual 2TB NVMe");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-lg rounded-2xl p-6 border border-white/10 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-cyberPurple/20 border border-cyberPurple/40 flex items-center justify-center text-cyberPurple">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-mono text-white">Register Validator Node</h3>
            <p className="text-xs text-gray-400 font-mono">
              Broadcast node telemetry to the Portaldot on-chain registry
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-gray-300">Validator Moniker</label>
              <button
                type="button"
                onClick={handleQuickFill}
                className="text-[10px] text-cyberCyan hover:underline"
              >
                Auto-fill Sample
              </button>
            </div>
            <input
              type="text"
              required
              placeholder="e.g. Apex-Guardian-01"
              value={moniker}
              onChange={(e) => setMoniker(e.target.value)}
              className="w-full bg-surface border border-white/10 rounded-lg p-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-cyberPurple"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">LibP2P Peer ID</label>
            <input
              type="text"
              required
              placeholder="12D3KooW..."
              value={peerId}
              onChange={(e) => setPeerId(e.target.value)}
              className="w-full bg-surface border border-white/10 rounded-lg p-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-cyberPurple"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-300 mb-1">Deployment Region</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full bg-surface border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyberPurple"
              >
                <option value="US-East (Virginia)">US-East (Virginia)</option>
                <option value="US-West (Oregon)">US-West (Oregon)</option>
                <option value="EU-Central (Frankfurt)">EU-Central (Frankfurt)</option>
                <option value="EU-West (London)">EU-West (London)</option>
                <option value="AP-Southeast (Singapore)">AP-Southeast (Singapore)</option>
                <option value="AP-Northeast (Tokyo)">AP-Northeast (Tokyo)</option>
                <option value="AF-West (Lagos)">AF-West (Lagos)</option>
                <option value="SA-East (Sao Paulo)">SA-East (Sao Paulo)</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Target Shard ID (0-255)</label>
              <input
                type="number"
                min="0"
                max="255"
                required
                value={shardId}
                onChange={(e) => setShardId(Number(e.target.value))}
                className="w-full bg-surface border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyberPurple"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-300 mb-1">Commission Rate (%)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                required
                value={commission}
                onChange={(e) => setCommission(Number(e.target.value))}
                className="w-full bg-surface border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyberPurple"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Hardware Specification</label>
              <input
                type="text"
                required
                value={hardwareSpecs}
                onChange={(e) => setHardwareSpecs(e.target.value)}
                className="w-full bg-surface border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyberPurple"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-end space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-surface hover:bg-white/5 text-gray-300 border border-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyberCyan to-cyberPurple text-black font-bold flex items-center space-x-2 shadow-neon-cyan hover:opacity-95 transition-opacity disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? "Broadcasting..." : "Register Validator"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
