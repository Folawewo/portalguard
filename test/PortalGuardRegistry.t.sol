// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../contracts/PortalGuardRegistry.sol";

contract PortalGuardRegistryTest {
    PortalGuardRegistry registry;

    function setUp() public {
        registry = new PortalGuardRegistry();
    }

    function testInitialState() public view {
        require(registry.getValidatorCount() == 0, "Initial count should be 0");
    }

    function testRegisterValidator() public {
        registry.registerValidator(
            "Apex-01",
            "12D3KooWTestPeer",
            "us-east-1",
            42,
            500,
            "64-Core AMD EPYC"
        );

        require(registry.getValidatorCount() == 1, "Count should be 1");

        PortalGuardRegistry.ValidatorNode memory node = registry.getValidator(address(this));
        require(bytes(node.moniker).length > 0, "Moniker empty");
        require(node.shardId == 42, "Wrong shard");
        require(node.commissionBps == 500, "Wrong commission");
        require(node.uptimeScore == 100, "Initial uptime should be 100");
    }

    function testHeartbeatPing() public {
        registry.registerValidator(
            "Apex-01",
            "12D3KooWTestPeer",
            "us-east-1",
            42,
            500,
            "64-Core AMD EPYC"
        );

        registry.pingHeartbeat(100500, 32, 28);

        PortalGuardRegistry.ValidatorNode memory node = registry.getValidator(address(this));
        require(node.lastBlockHeight == 100500, "Block height mismatch");
        require(node.lastPeerCount == 32, "Peer count mismatch");
        require(node.lastLatencyMs == 28, "Latency mismatch");
        require(node.totalHeartbeats == 2, "Heartbeats count mismatch");
    }
}
