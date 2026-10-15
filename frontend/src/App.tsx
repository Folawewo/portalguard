import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { MetricsBar } from "./components/MetricsBar";
import { NetworkGlobe } from "./components/NetworkGlobe";
import { ValidatorList, type ValidatorData } from "./components/ValidatorList";
import { RegisterModal } from "./components/RegisterModal";
import { InspectorModal } from "./components/InspectorModal";
import { IncidentFeed, type NetworkEvent } from "./components/IncidentFeed";
import { ShieldCheck } from "lucide-react";

const INITIAL_VALIDATORS: ValidatorData[] = [
  {
    address: "0x71C849B231908221845119028475928172948291",
    moniker: "Portal-Validator-Alpha",
    peerId: "12D3KooWDpJ7As7BWAbrJn1ZAsnJ21175o69n4jN817hE",
    region: "US-West (Oregon)",
    shardId: 12,
    commissionBps: 450,
    hardwareSpecs: "64-Core AMD EPYC 9654, 256GB RAM, Dual NVMe",
    status: "Active",
    lastHeartbeatTime: Date.now() - 12000,
    lastBlockHeight: 142890,
    peerCount: 38,
    latencyMs: 18,
    totalHeartbeats: 28420,
    uptimeScore: 100,
  },
  {
    address: "0x9812A90284719283749102837461928374619284",
    moniker: "Apex-Staking-Frankfurt",
    peerId: "12D3KooWFaB3As81928371625409182374619283746E",
    region: "EU-Central (Frankfurt)",
    shardId: 42,
    commissionBps: 500,
    hardwareSpecs: "32-Core Intel Xeon Platinum, 128GB RAM, 2TB SSD",
    status: "Active",
    lastHeartbeatTime: Date.now() - 18000,
    lastBlockHeight: 142888,
    peerCount: 32,
    latencyMs: 24,
    totalHeartbeats: 21900,
    uptimeScore: 100,
  },
  {
    address: "0x4819273619283746192837461928374619283745",
    moniker: "Tokyo-Hyper-Node",
    peerId: "12D3KooWTok12938475610293847561029384756102A",
    region: "AP-Northeast (Tokyo)",
    shardId: 88,
    commissionBps: 300,
    hardwareSpecs: "64-Core AMD EPYC, 256GB RAM, 4TB NVMe RAID",
    status: "Active",
    lastHeartbeatTime: Date.now() - 32000,
    lastBlockHeight: 142882,
    peerCount: 45,
    latencyMs: 31,
    totalHeartbeats: 34100,
    uptimeScore: 100,
  },
  {
    address: "0x1928374619283746192837461928374619283749",
    moniker: "London-Shard-Guardian",
    peerId: "12D3KooWLdn91827364510293847561029384756102B",
    region: "EU-West (London)",
    shardId: 5,
    commissionBps: 500,
    hardwareSpecs: "32-Core AMD EPYC, 128GB RAM, NVMe",
    status: "Active",
    lastHeartbeatTime: Date.now() - 45000,
    lastBlockHeight: 142878,
    peerCount: 29,
    latencyMs: 22,
    totalHeartbeats: 18900,
    uptimeScore: 99,
  },
  {
    address: "0x3847561928374619283746192837461928374612",
    moniker: "Singapore-Core-Validator",
    peerId: "12D3KooWSgp102938475610293847561029384756102C",
    region: "AP-Southeast (Singapore)",
    shardId: 110,
    commissionBps: 400,
    hardwareSpecs: "48-Core AMD EPYC, 192GB RAM, NVMe",
    status: "Active",
    lastHeartbeatTime: Date.now() - 22000,
    lastBlockHeight: 142886,
    peerCount: 36,
    latencyMs: 28,
    totalHeartbeats: 29300,
    uptimeScore: 100,
  },
  {
    address: "0x5829103847561928374619283746192837461928",
    moniker: "Sao-Paulo-Sentry",
    peerId: "12D3KooWSao102938475610293847561029384756102D",
    region: "SA-East (Sao Paulo)",
    shardId: 19,
    commissionBps: 600,
    hardwareSpecs: "32-Core AMD EPYC, 64GB RAM, SSD",
    status: "Degraded",
    lastHeartbeatTime: Date.now() - 3700000,
    lastBlockHeight: 142100,
    peerCount: 14,
    latencyMs: 148,
    totalHeartbeats: 12400,
    uptimeScore: 78,
  },
];

const INITIAL_EVENTS: NetworkEvent[] = [
  {
    id: "e1",
    timestamp: "19:22:10",
    type: "heartbeat",
    message: "Heartbeat ping verified from Portal-Validator-Alpha on Shard #12 (18ms latency)",
  },
  {
    id: "e2",
    timestamp: "19:21:58",
    type: "epoch",
    message: "Portaldot LAO NPoS epoch boundary synced successfully (Block #142,880)",
  },
  {
    id: "e3",
    timestamp: "19:21:15",
    type: "info",
    message: "DHSA dynamic shard partitioning balancing complete across 256 shards",
  },
  {
    id: "e4",
    timestamp: "19:20:04",
    type: "alert",
    message: "Watchdog Warning: Sao-Paulo-Sentry exceeded 3600s grace window - marked as Degraded",
  },
];

export function App() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [validators, setValidators] = useState<ValidatorData[]>(INITIAL_VALIDATORS);
  const [selectedNode, setSelectedNode] = useState<ValidatorData | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isPinging, setIsPinging] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentBlock, setCurrentBlock] = useState(142895);
  const [networkTps, setNetworkTps] = useState(10420);
  const [events, setEvents] = useState<NetworkEvent[]>(INITIAL_EVENTS);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBlock((prev) => prev + 1);
      setNetworkTps(10350 + Math.floor(Math.random() * 180));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const handleConnectWallet = async () => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({
          method: "eth_requestAccounts",
        });
        if (accounts && accounts[0]) {
          setWalletAddress(accounts[0]);
          return;
        }
      } catch (err) {
        console.error(err);
      }
    }
    setWalletAddress("0x71C849B231908221845119028475928172948291");
  };

  const handlePingNode = (address: string) => {
    setIsPinging(address);
    setTimeout(() => {
      setValidators((prev) =>
        prev.map((v) => {
          if (v.address === address) {
            const newLatency = 15 + Math.floor(Math.random() * 20);
            return {
              ...v,
              status: "Active",
              lastHeartbeatTime: Date.now(),
              lastBlockHeight: currentBlock,
              latencyMs: newLatency,
              totalHeartbeats: v.totalHeartbeats + 1,
              uptimeScore: 100,
            };
          }
          return v;
        })
      );

      const target = validators.find((v) => v.address === address);
      const newEvent: NetworkEvent = {
        id: `ev-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type: "heartbeat",
        message: `Manual heartbeat broadcasted for ${target?.moniker || address} (Block #${currentBlock})`,
      };
      setEvents((prev) => [newEvent, ...prev.slice(0, 15)]);
      setIsPinging(null);
    }, 600);
  };

  const handleRegisterNode = (formData: {
    moniker: string;
    peerId: string;
    region: string;
    shardId: number;
    commissionBps: number;
    hardwareSpecs: string;
  }) => {
    setIsSubmitting(true);
    setTimeout(() => {
      const newNode: ValidatorData = {
        address: walletAddress || `0x${Math.random().toString(16).substring(2, 42)}`,
        moniker: formData.moniker,
        peerId: formData.peerId,
        region: formData.region,
        shardId: formData.shardId,
        commissionBps: formData.commissionBps,
        hardwareSpecs: formData.hardwareSpecs,
        status: "Active",
        lastHeartbeatTime: Date.now(),
        lastBlockHeight: currentBlock,
        peerCount: 16,
        latencyMs: 19,
        totalHeartbeats: 1,
        uptimeScore: 100,
      };

      setValidators((prev) => [newNode, ...prev]);

      const newEvent: NetworkEvent = {
        id: `reg-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type: "info",
        message: `New validator node registered on-chain: ${newNode.moniker} on Shard #${newNode.shardId}`,
      };
      setEvents((prev) => [newEvent, ...prev.slice(0, 15)]);

      setIsSubmitting(false);
      setIsRegisterOpen(false);
    }, 800);
  };

  const handleInspectReportDowntime = (address: string) => {
    setValidators((prev) =>
      prev.map((v) => {
        if (v.address === address) {
          return {
            ...v,
            status: "Degraded",
            uptimeScore: Math.max(50, v.uptimeScore - 15),
          };
        }
        return v;
      })
    );

    const target = validators.find((v) => v.address === address);
    const newEvent: NetworkEvent = {
      id: `alert-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      type: "alert",
      message: `Watchdog downtime verification executed for ${target?.moniker || address} - Slashing Warning Emitted`,
    };
    setEvents((prev) => [newEvent, ...prev.slice(0, 15)]);
    setSelectedNode(null);
  };

  const activeCount = validators.filter((v) => v.status === "Active").length;

  return (
    <div className="min-h-screen bg-background text-gray-100 flex flex-col font-sans selection:bg-cyberCyan selection:text-black">
      <Header
        walletAddress={walletAddress}
        onConnectWallet={handleConnectWallet}
        onOpenRegisterModal={() => setIsRegisterOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full py-4">
        <MetricsBar
          currentBlock={currentBlock}
          activeCount={activeCount}
          totalCount={validators.length}
          networkTps={networkTps}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6">
          <div className="lg:col-span-8 flex flex-col">
            <NetworkGlobe
              onSelectNode={(node) => {
                const found = validators.find((v) => v.moniker.toLowerCase().includes(node.name.toLowerCase()));
                if (found) setSelectedNode(found);
              }}
              selectedNodeId={selectedNode ? selectedNode.moniker : null}
            />
          </div>

          <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
            <div className="glass-panel rounded-2xl p-5 border border-white/10 relative overflow-hidden">
              <div className="flex items-center space-x-2.5 mb-3 text-xs font-mono">
                <ShieldCheck className="w-5 h-5 text-cyberGreen" />
                <span className="font-bold text-white uppercase tracking-wider">
                  Automated Slashing Sentinel
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono leading-relaxed mb-4">
                Monitors consensus heartbeat pings every second. If a validator misses blocks or drops below SLA thresholds, delegators receive automated protection signals.
              </p>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center bg-surface/80 px-3 py-2 rounded-lg border border-white/5">
                  <span className="text-gray-400">Grace Timeout:</span>
                  <span className="text-gray-200">3,600s (1 Hour)</span>
                </div>
                <div className="flex justify-between items-center bg-surface/80 px-3 py-2 rounded-lg border border-white/5">
                  <span className="text-gray-400">Slashing Threshold:</span>
                  <span className="text-amber-400">7,200s (2 Hours)</span>
                </div>
                <div className="flex justify-between items-center bg-surface/80 px-3 py-2 rounded-lg border border-white/5">
                  <span className="text-gray-400">Registry Contract:</span>
                  <span className="text-cyberCyan truncate max-w-[140px]">
                    PortalGuardRegistry.sol
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <IncidentFeed events={events} />
            </div>
          </div>
        </div>

        <ValidatorList
          validators={validators}
          onPingNode={handlePingNode}
          onInspectNode={(node) => setSelectedNode(node)}
          isPinging={isPinging}
        />
      </main>

      <footer className="border-t border-white/5 py-8 mt-12 bg-surface/40 text-xs font-mono text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <span className="text-gray-400 font-bold tracking-widest text-sm hover:text-cyberCyan transition-colors cursor-default">
            PORTALGUARD
          </span>
        </div>
      </footer>

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSubmit={handleRegisterNode}
        isSubmitting={isSubmitting}
      />

      <InspectorModal
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
        onInspectReportDowntime={handleInspectReportDowntime}
      />
    </div>
  );
}

export default App;
