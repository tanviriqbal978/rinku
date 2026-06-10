import React, { useEffect, useRef } from 'react';
import { GenomeScores } from '../types';

interface DNAVisualizationProps {
  scores: GenomeScores;
  size?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export default function DNAVisualization({ scores, size = 320 }: DNAVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

  // Derive colors and shape params from genome scores
  const dominantTrait = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  const traitColors: Record<string, string[]> = {
    builder:    ['#22c55e', '#4ade80', '#86efac'],
    explorer:   ['#4ade80', '#86efac', '#bbf7d0'],
    researcher: ['#16a34a', '#22c55e', '#4ade80'],
    creator:    ['#4ade80', '#22c55e', '#a3e635'],
    collector:  ['#15803d', '#16a34a', '#22c55e'],
  };
  const colors = traitColors[dominantTrait] || traitColors.builder;

  // Strand separation based on builder score
  const strandSpread = 18 + (scores.builder / 100) * 20;
  // Speed based on explorer score
  const speed = 0.008 + (scores.explorer / 100) * 0.012;
  // Node count based on researcher score
  const nodeCount = 8 + Math.floor((scores.researcher / 100) * 6);
  // Particle density based on creator score
  const particleDensity = 0.3 + (scores.creator / 100) * 0.7;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = size;
    const H = size;
    canvas.width = W;
    canvas.height = H;

    const cx = W / 2;

    function spawnParticle(x: number, y: number) {
      particlesRef.current.push({
        x, y,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        life: 0,
        maxLife: 40 + Math.random() * 40,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 1 + Math.random() * 2,
      });
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // Background glow
      const bgGrad = ctx.createRadialGradient(cx, H / 2, 0, cx, H / 2, H * 0.5);
      bgGrad.addColorStop(0, 'rgba(34,197,94,0.04)');
      bgGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      const t = timeRef.current;
      const segH = H / nodeCount;

      // Draw DNA strands
      const strand1X: number[] = [];
      const strand2X: number[] = [];
      const strandY: number[] = [];

      for (let i = 0; i <= nodeCount; i++) {
        const y = (i / nodeCount) * H;
        const phase = t + (i / nodeCount) * Math.PI * 2;
        const x1 = cx + Math.sin(phase) * strandSpread;
        const x2 = cx + Math.sin(phase + Math.PI) * strandSpread;
        strand1X.push(x1);
        strand2X.push(x2);
        strandY.push(y);
      }

      // Draw strand 1 curve
      ctx.beginPath();
      ctx.moveTo(strand1X[0], strandY[0]);
      for (let i = 1; i < strand1X.length; i++) {
        const cpY = (strandY[i - 1] + strandY[i]) / 2;
        ctx.quadraticCurveTo(strand1X[i - 1], cpY, strand1X[i], strandY[i]);
      }
      const grad1 = ctx.createLinearGradient(0, 0, 0, H);
      grad1.addColorStop(0, colors[0] + '99');
      grad1.addColorStop(0.5, colors[1] + 'cc');
      grad1.addColorStop(1, colors[0] + '99');
      ctx.strokeStyle = grad1;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 8;
      ctx.shadowColor = colors[0];
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw strand 2 curve
      ctx.beginPath();
      ctx.moveTo(strand2X[0], strandY[0]);
      for (let i = 1; i < strand2X.length; i++) {
        const cpY = (strandY[i - 1] + strandY[i]) / 2;
        ctx.quadraticCurveTo(strand2X[i - 1], cpY, strand2X[i], strandY[i]);
      }
      const grad2 = ctx.createLinearGradient(0, 0, 0, H);
      grad2.addColorStop(0, colors[2] + '99');
      grad2.addColorStop(0.5, colors[0] + 'cc');
      grad2.addColorStop(1, colors[2] + '99');
      ctx.strokeStyle = grad2;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 8;
      ctx.shadowColor = colors[2];
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw rungs (horizontal bridges)
      for (let i = 0; i < nodeCount; i++) {
        const y = strandY[i];
        const x1 = strand1X[i];
        const x2 = strand2X[i];
        const phase = t + (i / nodeCount) * Math.PI * 2;
        const brightness = 0.3 + 0.7 * Math.abs(Math.sin(phase));

        // Rung line
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.strokeStyle = `rgba(34,197,94,${brightness * 0.5})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Node circles
        const nodeSize = 3 + brightness * 3;
        [x1, x2].forEach((nx) => {
          const grad = ctx.createRadialGradient(nx, y, 0, nx, y, nodeSize * 1.5);
          grad.addColorStop(0, colors[1] + 'ff');
          grad.addColorStop(1, colors[0] + '00');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(nx, y, nodeSize * 1.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.arc(nx, y, nodeSize * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
        });

        // Spawn particles occasionally
        if (Math.random() < particleDensity * 0.03) {
          spawnParticle(x1 + (x2 - x1) * Math.random(), y);
        }
      }

      // Update & draw particles
      particlesRef.current = particlesRef.current.filter(p => p.life < p.maxLife);
      particlesRef.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        const alpha = (1 - p.life / p.maxLife) * 0.8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });

      // Center axis glow line
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, H);
      const axisGrad = ctx.createLinearGradient(0, 0, 0, H);
      axisGrad.addColorStop(0, 'rgba(34,197,94,0)');
      axisGrad.addColorStop(0.5, 'rgba(34,197,94,0.08)');
      axisGrad.addColorStop(1, 'rgba(34,197,94,0)');
      ctx.strokeStyle = axisGrad;
      ctx.lineWidth = 1;
      ctx.stroke();

      timeRef.current += speed;
      animRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [scores, size]);

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow ring */}
      <div
        className="absolute rounded-full border border-green-500/10 animate-pulse-green"
        style={{ width: size + 40, height: size + 40 }}
      />
      <div
        className="absolute rounded-full border border-green-500/5"
        style={{ width: size + 20, height: size + 20 }}
      />

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="relative z-10 rounded-2xl"
        style={{ background: 'transparent' }}
      />

      {/* Corner decorations */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-green-500/40 rounded-tl" />
      <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-green-500/40 rounded-tr" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-green-500/40 rounded-bl" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-green-500/40 rounded-br" />

      {/* Dominant trait label */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 glass rounded-full border border-green-500/20">
        <span className="text-xs font-mono text-green-400/70 uppercase tracking-widest">
          {dominantTrait} dominant
        </span>
      </div>
    </div>
  );
}
