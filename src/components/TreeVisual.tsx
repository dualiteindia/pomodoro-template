import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { TreeStage } from '../types';
import { Tree3DScene } from './Tree3D';
import { cn } from '../lib/utils';

interface TreeVisualProps {
  stage: TreeStage;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';
}

export const TreeVisual: React.FC<TreeVisualProps> = ({ stage, className, size = 'md' }) => {
  // Size mapping for the container
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-48 h-48', 
    lg: 'w-64 h-64',
    full: 'w-full h-full'
  };

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      {/* 3D Canvas */}
      <div className="w-full h-full">
        <Canvas 
          camera={{ position: [0, 1.5, 4], fov: 45 }} 
          dpr={[1, 2]} // Handle high DPI screens
        >
          <Suspense fallback={null}>
            <Tree3DScene stage={stage} />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};
