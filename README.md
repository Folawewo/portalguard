# PortalGuard

Real-time validator node monitoring, 3D topology visualizer, and automated slashing watchdog for the Portaldot 256-shard network.

Built for **Portaldot Hacker House 2026** — **Track 3: Node Operations & Tooling**.

---

## Overview

Portaldot is a Layer 0 infrastructure network featuring 256 parallel shards, dynamic shard allocation (DHSA), and sub-second block finality. Maintaining network security and high throughput requires continuous node availability and low latency across all shards. 

When validators miss blocks or drop offline without warning:
- Shard throughput drops and cross-shard message routing experiences latency spikes.
- Delegators face slashing penalties and missed staking rewards.
- Network operators lack centralized, real-time insight into node health across heterogeneous server infrastructure.

**PortalGuard** solves this by providing a unified telemetry dashboard and on-chain watchdog contract that tracks validator node heartbeats, monitors SLA compliance, calculates real-time uptime health scores (0–100), and emits automated slashing warnings when nodes exceed safety grace periods.

---

## System Architecture

```
                                  ┌──────────────────────────────────────────────┐
                                  │           Portaldot Layer 0 (DHSA)           │
                                  │      256 Parallel Shards • Sub-second Finality│
                                  └──────────────────────▲───────────────────────┘
                                                         │
                         ┌───────────────────────────────┴───────────────────────────────┐
                         │                                                               │
            ┌────────────┴─────────────┐                                   ┌─────────────┴─────────────┐
            │   Smart Contract Layer   │                                   │    Frontend Telemetry UI  │
            │ PortalGuardRegistry.sol  │                                   │   Vite + React 19 + Three.js│
            ├──────────────────────────┤                                   ├───────────────────────────┤
            │ • Validator Registration │ <========= Ethers / ABI =========> │ • 3D Particle Shard Globe │
            │ • Heartbeat Ping SLA     │          Telemetry Stream         │ • Real-time Metrics Bar   │
            │ • Dynamic Uptime (0-100) │                                   │ • Fleet Search & Filter   │
            │ • Slashing Watchdog Alert│                                   │ • Live Incident Sentinel  │
            └──────────────────────────┘                                   └───────────────────────────┘
```

---

## Key Features

### 1. 3D Interactive Topology Globe
- Built using Three.js and WebGL.
- Visualizes validator nodes clustered across geographic regions and assigned Portaldot shards.
- Dynamic color-coded node states (Emerald = Active, Amber = Degraded / Slashed).
- Interactive drag-to-rotate orbital controls with raycasted node selection on click.
- Rendered cross-shard Bezier latency arcs illustrating cross-shard message relay routes.

### 2. On-Chain Validator Registry (`PortalGuardRegistry.sol`)
- Full EVM smart contract managing operator registrations with moniker, libp2p peer ID, region, shard assignment (0–255), and commission rates.
- SLA heartbeat tracking mechanism recording block heights, peer counts, and latency in milliseconds.
- Dynamic uptime score algorithm calculating health from 0 to 100 based on elapsed time since the last heartbeat.

### 3. Automated Slashing Sentinel & Watchdog
- Enforces a 3,600s (1-hour) grace period and 7,200s (2-hour) slashing threshold.
- Allows watchdogs, delegators, or automated keepers to call `inspectAndReportDowntime(operator)`.
- Emits on-chain `SlashingWarningEmitted` events to trigger automated defensive delegation reassignment.

### 4. Fleet Management & Inspection Modal
- Search validator fleet by moniker, operator address, peer ID, region, or shard number.
- Filter by status (`All`, `Active`, `Degraded`).
- Detailed inspector view displaying hardware specifications (CPU architecture, RAM, storage configuration), network latency, and ping logs.

### 5. Web3 Integration with Simulation Fallback
- Connects directly to browser wallets (MetaMask, Portaldot EVM) for on-chain contract transactions.
- Graceful local simulation fallback allowing full interactive testing and demonstration without requiring active testnet gas.

---

## Smart Contract Interface

Contract: `PortalGuardRegistry.sol`  
Solidity Version: `^0.8.24`

| Function | Access | Description |
|---|---|---|
| `registerValidator(...)` | Public | Registers a new validator node with shard ID and hardware specs |
| `pingHeartbeat(block, peers, latency)` | Operator Only | Records a heartbeat ping, updating uptime score and timestamp |
| `inspectAndReportDowntime(operator)` | Public | Watchdog verification that flags inactive nodes and emits slashing alerts |
| `checkSlashingRisk(operator)` | View | Returns whether a validator is at risk and the elapsed downtime |
| `getValidator(operator)` | View | Returns complete telemetry struct for a specific validator |
| `getAllValidators()` | View | Returns array of all registered validator nodes |
| `getNetworkSummary()` | View | Returns total nodes, active nodes, degraded count, and total pings |

---

## Tech Stack

- **Smart Contracts**: Solidity 0.8.24, Hardhat 3
- **Frontend**: React 19, TypeScript, Vite
- **3D Graphics**: Three.js, WebGL
- **Styling**: Tailwind CSS, Cyberpunk Obsidian Glassmorphism theme
- **Icons**: Lucide React
- **Web3**: Ethers.js v6

---

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

Clone the repository and install root and frontend dependencies:

```bash
git clone https://github.com/Folawewo/portalguard.git
cd portalguard
npm install

cd frontend
npm install
cd ..
```

### Running Smart Contract Tests

```bash
npx hardhat test
```

### Starting the Local Telemetry Dashboard

```bash
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Deploying the Smart Contract

To deploy to a local network or Portaldot EVM testnet:

```bash
RPC_URL="http://127.0.0.1:8545" PRIVATE_KEY="your-private-key" node scripts/deploy.js
```

---

## License

MIT
