// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract PortalGuardRegistry {
    enum NodeStatus {
        Inactive,
        Active,
        Degraded,
        Slashed
    }

    struct ValidatorNode {
        address operator;
        string moniker;
        string peerId;
        string region;
        uint16 shardId;
        uint16 commissionBps;
        string hardwareSpecs;
        NodeStatus status;
        uint256 registeredAt;
        uint256 lastHeartbeatTime;
        uint256 lastBlockHeight;
        uint256 lastPeerCount;
        uint256 lastLatencyMs;
        uint256 totalHeartbeats;
        uint256 uptimeScore;
    }

    address public owner;
    uint256 public heartbeatGracePeriod = 3600;
    uint256 public slashingThreshold = 7200;

    address[] public validatorAddresses;
    mapping(address => ValidatorNode) private validators;
    mapping(address => bool) private isRegistered;

    uint256 public totalHeartbeatsNetwork;

    event ValidatorRegistered(
        address indexed operator,
        string moniker,
        string peerId,
        string region,
        uint16 shardId
    );

    event HeartbeatRecorded(
        address indexed operator,
        uint256 blockHeight,
        uint256 peerCount,
        uint256 latencyMs,
        uint256 uptimeScore,
        uint256 timestamp
    );

    event ValidatorStatusChanged(
        address indexed operator,
        NodeStatus oldStatus,
        NodeStatus newStatus,
        string reason
    );

    event SlashingWarningEmitted(
        address indexed operator,
        uint256 secondsSinceLastHeartbeat,
        string riskLevel
    );

    event GracePeriodUpdated(uint256 newGracePeriod, uint256 newSlashingThreshold);

    modifier onlyOwner() {
        require(msg.sender == owner, "PortalGuard: caller is not the owner");
        _;
    }

    modifier onlyRegistered() {
        require(isRegistered[msg.sender], "PortalGuard: operator is not registered");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function registerValidator(
        string calldata moniker,
        string calldata peerId,
        string calldata region,
        uint16 shardId,
        uint16 commissionBps,
        string calldata hardwareSpecs
    ) external {
        require(!isRegistered[msg.sender], "PortalGuard: operator already registered");
        require(bytes(moniker).length > 0, "PortalGuard: moniker cannot be empty");
        require(bytes(peerId).length > 0, "PortalGuard: peerId cannot be empty");
        require(commissionBps <= 10000, "PortalGuard: commission exceeds 100%");

        ValidatorNode memory newNode = ValidatorNode({
            operator: msg.sender,
            moniker: moniker,
            peerId: peerId,
            region: region,
            shardId: shardId,
            commissionBps: commissionBps,
            hardwareSpecs: hardwareSpecs,
            status: NodeStatus.Active,
            registeredAt: block.timestamp,
            lastHeartbeatTime: block.timestamp,
            lastBlockHeight: block.number,
            lastPeerCount: 1,
            lastLatencyMs: 20,
            totalHeartbeats: 1,
            uptimeScore: 100
        });

        validators[msg.sender] = newNode;
        isRegistered[msg.sender] = true;
        validatorAddresses.push(msg.sender);

        emit ValidatorRegistered(msg.sender, moniker, peerId, region, shardId);
        emit HeartbeatRecorded(msg.sender, block.number, 1, 20, 100, block.timestamp);
    }

    function pingHeartbeat(
        uint256 blockHeight,
        uint256 peerCount,
        uint256 latencyMs
    ) external onlyRegistered {
        ValidatorNode storage node = validators[msg.sender];

        node.lastHeartbeatTime = block.timestamp;
        node.lastBlockHeight = blockHeight;
        node.lastPeerCount = peerCount;
        node.lastLatencyMs = latencyMs;
        node.totalHeartbeats += 1;
        totalHeartbeatsNetwork += 1;

        if (node.status != NodeStatus.Active) {
            NodeStatus old = node.status;
            node.status = NodeStatus.Active;
            emit ValidatorStatusChanged(msg.sender, old, NodeStatus.Active, "Heartbeat restored node to Active");
        }

        if (latencyMs < 100 && peerCount >= 3) {
            node.uptimeScore = 100;
        } else if (latencyMs < 300) {
            node.uptimeScore = 98;
        } else {
            node.uptimeScore = 95;
        }

        emit HeartbeatRecorded(msg.sender, blockHeight, peerCount, latencyMs, node.uptimeScore, block.timestamp);
    }

    function inspectAndReportDowntime(address operator) external {
        require(isRegistered[operator], "PortalGuard: operator not registered");

        ValidatorNode storage node = validators[operator];
        uint256 timeSinceHeartbeat = block.timestamp - node.lastHeartbeatTime;

        if (timeSinceHeartbeat >= slashingThreshold) {
            if (node.status != NodeStatus.Slashed) {
                NodeStatus old = node.status;
                node.status = NodeStatus.Slashed;
                node.uptimeScore = node.uptimeScore > 30 ? node.uptimeScore - 30 : 50;
                emit ValidatorStatusChanged(operator, old, NodeStatus.Slashed, "Missed heartbeats exceeded slashing threshold");
                emit SlashingWarningEmitted(operator, timeSinceHeartbeat, "CRITICAL: Slashing imminent or triggered");
            }
        } else if (timeSinceHeartbeat >= heartbeatGracePeriod) {
            if (node.status != NodeStatus.Degraded) {
                NodeStatus old = node.status;
                node.status = NodeStatus.Degraded;
                node.uptimeScore = node.uptimeScore > 10 ? node.uptimeScore - 10 : 70;
                emit ValidatorStatusChanged(operator, old, NodeStatus.Degraded, "Missed heartbeats exceeded grace period");
                emit SlashingWarningEmitted(operator, timeSinceHeartbeat, "WARNING: Node degraded");
            }
        }
    }

    function getValidatorCount() external view returns (uint256) {
        return validatorAddresses.length;
    }

    function getValidator(address operator) external view returns (ValidatorNode memory) {
        require(isRegistered[operator], "PortalGuard: operator not found");
        return validators[operator];
    }

    function getAllValidators() external view returns (ValidatorNode[] memory) {
        uint256 count = validatorAddresses.length;
        ValidatorNode[] memory list = new ValidatorNode[](count);
        for (uint256 i = 0; i < count; i++) {
            list[i] = validators[validatorAddresses[i]];
        }
        return list;
    }

    function checkSlashingRisk(address operator) external view returns (
        bool atRisk,
        uint256 secondsSilent,
        NodeStatus currentStatus
    ) {
        require(isRegistered[operator], "PortalGuard: operator not registered");
        ValidatorNode memory node = validators[operator];
        uint256 elapsed = block.timestamp - node.lastHeartbeatTime;
        bool risk = elapsed >= heartbeatGracePeriod || node.status == NodeStatus.Degraded || node.status == NodeStatus.Slashed;
        return (risk, elapsed, node.status);
    }

    function getNetworkSummary() external view returns (
        uint256 totalValidators,
        uint256 activeValidators,
        uint256 degradedValidators,
        uint256 totalPings
    ) {
        uint256 activeCount = 0;
        uint256 degradedCount = 0;
        uint256 len = validatorAddresses.length;

        for (uint256 i = 0; i < len; i++) {
            NodeStatus s = validators[validatorAddresses[i]].status;
            if (s == NodeStatus.Active) {
                activeCount++;
            } else if (s == NodeStatus.Degraded || s == NodeStatus.Slashed) {
                degradedCount++;
            }
        }

        return (len, activeCount, degradedCount, totalHeartbeatsNetwork);
    }

    function updateThresholds(uint256 newGracePeriod, uint256 newSlashingThreshold) external onlyOwner {
        require(newSlashingThreshold > newGracePeriod, "PortalGuard: slashing threshold must exceed grace period");
        heartbeatGracePeriod = newGracePeriod;
        slashingThreshold = newSlashingThreshold;
        emit GracePeriodUpdated(newGracePeriod, newSlashingThreshold);
    }
}
