import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface NodePoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: "Active" | "Degraded" | "Slashed";
  region: string;
  shard: number;
}

const SAMPLE_NODES: NodePoint[] = [
  { id: "1", name: "Portal-Validator-Alpha", lat: 37.7749, lng: -122.4194, status: "Active", region: "US-West", shard: 12 },
  { id: "2", name: "Apex-Staking-Frankfurt", lat: 50.1109, lng: 8.6821, status: "Active", region: "EU-Central", shard: 42 },
  { id: "3", name: "Tokyo-Hyper-Node", lat: 35.6762, lng: 139.6503, status: "Active", region: "AP-Northeast", shard: 88 },
  { id: "4", name: "London-Shard-Guardian", lat: 51.5074, lng: -0.1278, status: "Active", region: "EU-West", shard: 5 },
  { id: "5", name: "Singapore-Core-Validator", lat: 1.3521, lng: 103.8198, status: "Active", region: "AP-Southeast", shard: 110 },
  { id: "6", name: "Sao-Paulo-Sentry", lat: -23.5505, lng: -46.6333, status: "Degraded", region: "SA-East", shard: 19 },
  { id: "7", name: "Sydney-Mesh-Node", lat: -33.8688, lng: 151.2093, status: "Active", region: "Oceania", shard: 204 },
  { id: "8", name: "Lagos-Nexus-Validator", lat: 6.5244, lng: 3.3792, status: "Active", region: "AF-West", shard: 147 },
];

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

interface NetworkGlobeProps {
  onSelectNode?: (node: NodePoint) => void;
  selectedNodeId?: string | null;
}

export const NetworkGlobe: React.FC<NetworkGlobeProps> = ({ onSelectNode, selectedNodeId }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 240;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const sphereRadius = 78;

    const particleCount = 2400;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = sphereRadius + (Math.random() - 0.5) * 1.5;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x3b82f6,
      size: 1.2,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });
    const globePoints = new THREE.Points(particleGeo, particleMat);
    globeGroup.add(globePoints);

    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x1e3a8a,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const wireGeo = new THREE.SphereGeometry(sphereRadius, 32, 32);
    const wireSphere = new THREE.Mesh(wireGeo, wireMat);
    globeGroup.add(wireSphere);

    const nodePositions: THREE.Vector3[] = [];
    const markerGroup = new THREE.Group();
    globeGroup.add(markerGroup);

    const clickableMeshes: THREE.Mesh[] = [];

    SAMPLE_NODES.forEach((node) => {
      const pos = latLngToVector3(node.lat, node.lng, sphereRadius + 1.2);
      nodePositions.push(pos);

      const isDegraded = node.status === "Degraded";
      const isSelected = selectedNodeId === node.id;
      const markerColor = isDegraded ? 0xf59e0b : isSelected ? 0x00f5ff : 0x10b981;

      const nodeMesh = new THREE.Mesh(
        new THREE.SphereGeometry(2.2, 16, 16),
        new THREE.MeshBasicMaterial({ color: markerColor })
      );
      nodeMesh.position.copy(pos);
      nodeMesh.userData = { node };
      clickableMeshes.push(nodeMesh);
      markerGroup.add(nodeMesh);

      const pulseGeo = new THREE.RingGeometry(2.8, 3.8, 24);
      const pulseMat = new THREE.MeshBasicMaterial({
        color: markerColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      });
      const pulseRing = new THREE.Mesh(pulseGeo, pulseMat);
      pulseRing.position.copy(pos);
      pulseRing.lookAt(new THREE.Vector3(0, 0, 0));
      markerGroup.add(pulseRing);
    });

    const linesMat = new THREE.LineBasicMaterial({
      color: 0x00f5ff,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
    });

    for (let i = 0; i < nodePositions.length; i++) {
      for (let j = i + 1; j < nodePositions.length; j++) {
        if (Math.random() > 0.45) continue;
        const p1 = nodePositions[i];
        const p2 = nodePositions[j];

        const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
        const dist = p1.distanceTo(p2);
        mid.normalize().multiplyScalar(sphereRadius + dist * 0.28);

        const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
        const curvePoints = curve.getPoints(30);
        const curveGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
        const curveLine = new THREE.Line(curveGeo, linesMat);
        globeGroup.add(curveLine);
      }
    }

    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let dragStartPosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
      dragStartPosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      globeGroup.rotation.y += deltaX * 0.005;
      globeGroup.rotation.x += deltaY * 0.005;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = (e: MouseEvent) => {
      const moved = Math.hypot(e.clientX - dragStartPosition.x, e.clientY - dragStartPosition.y);
      if (moved < 5 && onSelectNode && container) {
        const rect = container.getBoundingClientRect();
        const mouse = new THREE.Vector2(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          -((e.clientY - rect.top) / rect.height) * 2 + 1
        );
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(clickableMeshes);
        if (intersects.length > 0) {
          const clicked = intersects[0].object.userData.node as NodePoint;
          onSelectNode(clicked);
        }
      }
      isDragging = false;
    };

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isDragging) {
        globeGroup.rotation.y += 0.0018;
      }
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [selectedNodeId]);

  return (
    <div className="relative w-full h-[380px] lg:h-[460px] flex items-center justify-center overflow-hidden rounded-2xl glass-panel">
      <div className="absolute top-4 left-4 z-10 flex items-center space-x-2 pointer-events-none">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyberCyan opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-cyberCyan"></span>
        </span>
        <span className="text-xs font-mono uppercase tracking-wider text-gray-300">
          Portaldot Shard Topology Matrix (256 Shards)
        </span>
      </div>

      <div className="absolute bottom-4 left-4 z-10 flex items-center space-x-4 pointer-events-none text-xs font-mono text-gray-400">
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyberGreen inline-block"></span>
          <span>Active (100% SLA)</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyberYellow inline-block"></span>
          <span>Degraded / Warning</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyberCyan inline-block"></span>
          <span>Cross-Shard Relay</span>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-10 text-[11px] font-mono text-gray-500 pointer-events-none bg-surface/80 px-2.5 py-1 rounded-md border border-white/5">
        Drag to Rotate 3D Space
      </div>

      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
};
