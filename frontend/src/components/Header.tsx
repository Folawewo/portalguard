import React from "react";
import { Shield, Radio, Wallet, PlusCircle } from "lucide-react";

interface HeaderProps {
  walletAddress: string | null;
  onConnectWallet: () => void;
  onOpenRegisterModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  walletAddress,
  onConnectWallet,
  onOpenRegisterModal,
}) => {
  return (
    <header className="w-full border-b border-white/5 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-cyberCyan/40 flex items-center justify-center shadow-neon-cyan">
            <Shield className="w-5 h-5 text-cyberCyan" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-white font-mono">
                PORTAL<span className="text-cyberCyan">GUARD</span>
              </span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyberPurple/20 text-cyberPurple border border-cyberPurple/30">
                Portaldot V3.0
              </span>
            </div>
            <p className="text-xs text-gray-400 font-mono">
              Validator Node Operations & Telemetry Sentinel
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-surface border border-white/5 text-xs font-mono text-gray-300">
            <Radio className="w-3.5 h-3.5 text-cyberGreen animate-pulse" />
            <span>Testnet Synced (wss://mainnet.portaldot.io)</span>
          </div>

          <button
            onClick={onOpenRegisterModal}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-cyberPurple/20 hover:bg-cyberPurple/30 text-cyberPurple border border-cyberPurple/40 text-xs font-mono font-medium transition-all shadow-neon-purple active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Register Node</span>
          </button>

          <button
            onClick={onConnectWallet}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-cyberCyan/15 hover:bg-cyberCyan/25 text-cyberCyan border border-cyberCyan/40 text-xs font-mono font-semibold transition-all shadow-neon-cyan active:scale-95"
          >
            <Wallet className="w-4 h-4" />
            <span>
              {walletAddress
                ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`
                : "Connect Wallet"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
