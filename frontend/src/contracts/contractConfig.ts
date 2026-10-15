import { ethers } from "ethers";

export const PORTAL_GUARD_ADDRESS =
  (import.meta.env.VITE_PORTALGUARD_CONTRACT_ADDRESS as string) ||
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const PORTAL_GUARD_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "newGracePeriod",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newSlashingThreshold",
        type: "uint256"
      }
    ],
    name: "GracePeriodUpdated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "blockHeight",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "uptimeScore",
        type: "uint256"
      }
    ],
    name: "HeartbeatRecorded",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "downtimeDuration",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256"
      }
    ],
    name: "SlashingWarningEmitted",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address"
      },
      {
        indexed: false,
        internalType: "string",
        name: "moniker",
        type: "string"
      },
      {
        indexed: false,
        internalType: "uint16",
        name: "shardId",
        type: "uint16"
      },
      {
        indexed: false,
        internalType: "string",
        name: "region",
        type: "string"
      }
    ],
    name: "ValidatorRegistered",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address"
      },
      {
        indexed: false,
        internalType: "enum PortalGuardRegistry.NodeStatus",
        name: "newStatus",
        type: "uint8"
      }
    ],
    name: "ValidatorStatusChanged",
    type: "event"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address"
      }
    ],
    name: "checkSlashingRisk",
    outputs: [
      {
        internalType: "bool",
        name: "atRisk",
        type: "bool"
      },
      {
        internalType: "uint256",
        name: "elapsedSincePing",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getAllValidators",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "operator",
            type: "address"
          },
          {
            internalType: "string",
            name: "moniker",
            type: "string"
          },
          {
            internalType: "string",
            name: "peerId",
            type: "string"
          },
          {
            internalType: "string",
            name: "region",
            type: "string"
          },
          {
            internalType: "uint16",
            name: "shardId",
            type: "uint16"
          },
          {
            internalType: "uint16",
            name: "commissionBps",
            type: "uint16"
          },
          {
            internalType: "string",
            name: "hardwareSpecs",
            type: "string"
          },
          {
            internalType: "enum PortalGuardRegistry.NodeStatus",
            name: "status",
            type: "uint8"
          },
          {
            internalType: "uint256",
            name: "registeredAt",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "lastHeartbeatTime",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "lastBlockHeight",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "lastPeerCount",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "lastLatencyMs",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "totalHeartbeats",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "uptimeScore",
            type: "uint256"
          }
        ],
        internalType: "struct PortalGuardRegistry.ValidatorNode[]",
        name: "",
        type: "tuple[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getNetworkSummary",
    outputs: [
      {
        internalType: "uint256",
        name: "totalValidators",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "activeValidators",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "degradedValidators",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "totalPings",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address"
      }
    ],
    name: "getValidator",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "operator",
            type: "address"
          },
          {
            internalType: "string",
            name: "moniker",
            type: "string"
          },
          {
            internalType: "string",
            name: "peerId",
            type: "string"
          },
          {
            internalType: "string",
            name: "region",
            type: "string"
          },
          {
            internalType: "uint16",
            name: "shardId",
            type: "uint16"
          },
          {
            internalType: "uint16",
            name: "commissionBps",
            type: "uint16"
          },
          {
            internalType: "string",
            name: "hardwareSpecs",
            type: "string"
          },
          {
            internalType: "enum PortalGuardRegistry.NodeStatus",
            name: "status",
            type: "uint8"
          },
          {
            internalType: "uint256",
            name: "registeredAt",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "lastHeartbeatTime",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "lastBlockHeight",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "lastPeerCount",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "lastLatencyMs",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "totalHeartbeats",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "uptimeScore",
            type: "uint256"
          }
        ],
        internalType: "struct PortalGuardRegistry.ValidatorNode",
        name: "",
        type: "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getValidatorCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "heartbeatGracePeriod",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address"
      }
    ],
    name: "inspectAndReportDowntime",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "blockHeight",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "peerCount",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "latencyMs",
        type: "uint256"
      }
    ],
    name: "pingHeartbeat",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "moniker",
        type: "string"
      },
      {
        internalType: "string",
        name: "peerId",
        type: "string"
      },
      {
        internalType: "string",
        name: "region",
        type: "string"
      },
      {
        internalType: "uint16",
        name: "shardId",
        type: "uint16"
      },
      {
        internalType: "uint16",
        name: "commissionBps",
        type: "uint16"
      },
      {
        internalType: "string",
        name: "hardwareSpecs",
        type: "string"
      }
    ],
    name: "registerValidator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "slashingThreshold",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalHeartbeatsNetwork",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "newGracePeriod",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "newSlashingThreshold",
        type: "uint256"
      }
    ],
    name: "updateThresholds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    name: "validatorAddresses",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
] as const;

export function getEthereumProvider() {
  if (typeof window !== "undefined" && (window as unknown as { ethereum?: ethers.Eip1193Provider }).ethereum) {
    return new ethers.BrowserProvider((window as unknown as { ethereum: ethers.Eip1193Provider }).ethereum);
  }
  return null;
}

export function getPortalGuardContract(signerOrProvider: ethers.Signer | ethers.Provider) {
  return new ethers.Contract(PORTAL_GUARD_ADDRESS, PORTAL_GUARD_ABI, signerOrProvider);
}
