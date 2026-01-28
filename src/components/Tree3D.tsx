import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Cylinder, Cone, Sphere } from '@react-three/drei';
import { TreeStage } from '../types';
import * as THREE from 'three';

interface Tree3DProps {
  stage: TreeStage;
}

const COLORS = {
  trunk: "#8c5638",       // Earthy brown
  leavesLight: "#9ebd8d", // Sage green
  leavesDark: "#5e8249",  // Forest green
  soil: "#5d4037",        // Dark soil
  pot: "#eaddc8"          // Beige/Sand
};

const LowPolyPine = ({ stage }: { stage: TreeStage }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating/swaying animation
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1;
    }
  });

  // Render logic based on stage
  const renderTree = () => {
    switch (stage) {
      case 'SEED':
        return (
          <group>
            {/* 0% - Just a tiny mound of earth and a seed */}
            <Sphere args={[0.3, 8, 8]} position={[0, 0, 0]} scale={[1, 0.4, 1]}>
              <meshStandardMaterial color={COLORS.trunk} />
            </Sphere>
            <Sphere args={[0.05, 8, 8]} position={[0, 0.15, 0]}>
               <meshStandardMaterial color="#fcd34d" /> {/* Gold seed */}
            </Sphere>
          </group>
        );

      case 'SPROUT':
        return (
          <group>
             {/* 25% - Tiny stem and two leaves */}
            <Cylinder args={[0.04, 0.04, 0.3, 8]} position={[0, 0.15, 0]}>
              <meshStandardMaterial color={COLORS.leavesLight} />
            </Cylinder>
            {/* Leaves */}
            <Cone args={[0.12, 0.3, 4]} position={[0.1, 0.35, 0]} rotation={[0, 0, -0.6]}>
              <meshStandardMaterial color={COLORS.leavesLight} />
            </Cone>
            <Cone args={[0.12, 0.3, 4]} position={[-0.1, 0.35, 0]} rotation={[0, 0, 0.6]}>
              <meshStandardMaterial color={COLORS.leavesLight} />
            </Cone>
          </group>
        );

      case 'SAPLING':
        return (
          <group>
            {/* 50% - Small trunk, one distinct foliage layer */}
            <Cylinder args={[0.08, 0.1, 0.6, 8]} position={[0, 0.3, 0]}>
              <meshStandardMaterial color={COLORS.trunk} />
            </Cylinder>
            {/* Foliage */}
            <Cone args={[0.5, 0.8, 7]} position={[0, 0.7, 0]}>
              <meshStandardMaterial color={COLORS.leavesDark} flatShading />
            </Cone>
          </group>
        );

      case 'YOUNG':
        return (
          <group>
             {/* 75% - Taller trunk, two foliage layers */}
            <Cylinder args={[0.12, 0.15, 1.0, 8]} position={[0, 0.5, 0]}>
              <meshStandardMaterial color={COLORS.trunk} />
            </Cylinder>
            {/* Foliage Layers */}
            <Cone args={[0.8, 0.8, 7]} position={[0, 0.8, 0]}>
              <meshStandardMaterial color={COLORS.leavesDark} flatShading />
            </Cone>
            <Cone args={[0.6, 0.7, 7]} position={[0, 1.3, 0]}>
              <meshStandardMaterial color={COLORS.leavesLight} flatShading />
            </Cone>
          </group>
        );

      case 'MATURE':
        return (
          <group>
            {/* 100% - Full Pine Tree, 3 layers, thick trunk */}
            <Cylinder args={[0.2, 0.25, 1.4, 8]} position={[0, 0.7, 0]}>
              <meshStandardMaterial color={COLORS.trunk} />
            </Cylinder>
            {/* Foliage Layers - Full Pine */}
            <Cone args={[1.1, 1.0, 8]} position={[0, 1.0, 0]}>
              <meshStandardMaterial color={COLORS.leavesDark} flatShading />
            </Cone>
            <Cone args={[0.9, 0.9, 8]} position={[0, 1.6, 0]}>
              <meshStandardMaterial color={COLORS.leavesLight} flatShading />
            </Cone>
            <Cone args={[0.6, 0.8, 8]} position={[0, 2.1, 0]}>
              <meshStandardMaterial color={COLORS.leavesDark} flatShading />
            </Cone>
          </group>
        );
        
      default:
        return null;
    }
  };

  return (
    <group ref={groupRef}>
      {/* The Soil Base (Always present to ground the tree) */}
      <Cylinder args={[1.8, 1.5, 0.5, 32]} position={[0, -0.25, 0]}>
        <meshStandardMaterial color={COLORS.soil} />
      </Cylinder>
      
      {/* The Tree */}
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        {renderTree()}
      </Float>
    </group>
  );
};

export const Tree3DScene: React.FC<Tree3DProps> = ({ stage }) => {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
      <spotLight position={[-5, 5, 0]} intensity={0.5} color="#ffd700" />
      
      <LowPolyPine stage={stage} />
    </>
  );
};
