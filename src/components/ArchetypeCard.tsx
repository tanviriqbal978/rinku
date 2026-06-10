import React, { useState } from 'react';
import { Archetype } from '../types';
import { ARCHETYPES } from '../lib/genome';

interface ArchetypeCardProps {
  archetypeName: string;
  compact?: boolean;
}

export default function ArchetypeCard({ archetypeName, compact = false }: ArchetypeCardProps) {
  const [hovered, setHovered] = useState(false);
  const archetype: Archetype = ARCHETYPES[archetypeName as keyof typeof ARCHETYPES] || ARCHETYPES['The Innovator'];

  if (compact) {
    return (
      <div
        className="glass rounded-xl border border-green-500/20 p-4 flex items-center gap-4 transition-all duration-300 hover:border-green-400/40 hover:shadow-green-sm"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 transition-all duration-300"
          style={{
            background: `${archetype.color}15`,
            border: `1px solid ${archetype.color}40`,
            boxShadow: hovered ? `0 0 20px ${archetype.color}30` : 'none',
          }}
        >
          {archetype.icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-mono text-white/40 uppercase tracking-widest mb-0.5">Archetype</p>
          <p className="font-mono font-bold text-white text-sm">{archetype.name}</p>
          <p className="text-xs text-white/50 truncate">{archetype.description.split('.')[0]}.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="glass rounded-2xl border border-green-500/20 p-6 transition-all duration-300 hover:border-green-400/30 relative overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ boxShadow: hovered ? `0 0 40px ${archetype.color}15` : 'none' }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 opacity-5 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 50%, ${archetype.color}, transparent 60%)`,
          opacity: hovered ? 0.08 : 0.03,
        }}
      />

      {/* Header */}
      <div className="flex items-start gap-4 mb-5 relative z-10">
        {/* Icon orb */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 transition-all duration-500"
          style={{
            background: `linear-gradient(135deg, ${archetype.color}20, ${archetype.color}08)`,
            border: `1px solid ${archetype.color}40`,
            boxShadow: hovered ? `0 0 30px ${archetype.color}30, inset 0 0 20px ${archetype.color}10` : `0 0 10px ${archetype.color}15`,
          }}
        >
          <span className={`transition-transform duration-300 ${hovered ? 'scale-110' : 'scale-100'}`}>
            {archetype.icon}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          {/* Tag */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-2"
            style={{ background: `${archetype.color}15`, border: `1px solid ${archetype.color}30` }}
          >
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: archetype.color }} />
            <span className="text-xs font-mono tracking-widest uppercase" style={{ color: archetype.color }}>
              Primary Archetype
            </span>
          </div>

          {/* Name */}
          <h3 className="font-mono font-bold text-xl text-white leading-tight">
            {archetype.name}
          </h3>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-white/60 leading-relaxed mb-5 relative z-10">
        {archetype.description}
      </p>

      {/* Strengths */}
      <div className="relative z-10">
        <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-3">
          Special Strengths
        </p>
        <div className="grid grid-cols-2 gap-2">
          {archetype.strengths.map((strength, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200"
              style={{
                background: `${archetype.color}08`,
                border: `1px solid ${archetype.color}20`,
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: archetype.color }}
              />
              <span className="text-xs font-mono text-white/70">{strength}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, transparent, ${archetype.color}60, transparent)`,
          opacity: hovered ? 1 : 0.3,
        }}
      />
    </div>
  );
}
