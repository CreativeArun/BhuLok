import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', showSubtitle = true, className = '' }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-3 select-none group ${className}`}>
      {/* 3D Isometric Spatial Cadastral Gem/Cube Icon */}
      <div className={`relative ${iconSizes[size]} flex-shrink-0 transition-transform duration-300 group-hover:scale-105`}>
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
          <defs>
            {/* Top Isometric Facet (Emerald / Cyan Sky) */}
            <linearGradient id="bhulokTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            {/* Left Facet (Royal Blue) */}
            <linearGradient id="bhulokLeftGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#003ea8" />
            </linearGradient>
            {/* Right Facet (Deep Navy / Cobalt) */}
            <linearGradient id="bhulokRightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1d4ed8" />
              <stop offset="100%" stopColor="#002166" />
            </linearGradient>
            {/* Base Land Substratum (Emerald Green) */}
            <linearGradient id="bhulokLandGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <filter id="bhulokGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Bottom Cadastral Base Plate (Land/Earth Layer) */}
          <polygon
            points="24,35 42,25 24,15 6,25"
            fill="url(#bhulokLandGrad)"
            opacity="0.9"
          />
          <polygon
            points="6,25 24,35 24,41 6,31"
            fill="#047857"
          />
          <polygon
            points="24,35 42,25 42,31 24,41"
            fill="#065f46"
          />

          {/* Floating Spatial 3D Property Volume (Cube) */}
          {/* Left Wall */}
          <polygon
            points="10,21 24,29 24,15 10,7"
            fill="url(#bhulokLeftGrad)"
          />
          {/* Right Wall */}
          <polygon
            points="24,29 38,21 38,7 24,15"
            fill="url(#bhulokRightGrad)"
          />
          {/* Top Roof Cap */}
          <polygon
            points="24,15 38,7 24,-1 10,7"
            fill="url(#bhulokTopGrad)"
          />

          {/* Cadastral Spatial Coordinate Grid Overlay Lines */}
          <line x1="24" y1="15" x2="24" y2="29" stroke="#67e8f9" strokeWidth="1.2" strokeOpacity="0.8" />
          <line x1="17" y1="11" x2="17" y2="25" stroke="#93c5fd" strokeWidth="0.8" strokeOpacity="0.6" />
          <line x1="31" y1="11" x2="31" y2="25" stroke="#93c5fd" strokeWidth="0.8" strokeOpacity="0.6" />

          {/* Central Pulsing Vertex Pin */}
          <circle cx="24" cy="15" r="2.5" fill="#ffffff" stroke="#2563eb" strokeWidth="1.5" filter="url(#bhulokGlow)" />
          <circle cx="24" cy="15" r="1" fill="#38bdf8" />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col text-left leading-none">
        <div className="flex items-center tracking-tight">
          <span className={`font-headline-md ${textSizes[size]} font-extrabold text-on-surface group-hover:text-primary transition-colors`}>
            Bhu
          </span>
          <span className={`font-headline-md ${textSizes[size]} font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent`}>
            Lok
          </span>
        </div>
        {showSubtitle && (
          <span className="font-label-sm text-[11px] text-on-surface-variant font-medium tracking-normal mt-0.5">
            3D Digital Cadastre &amp; Registry
          </span>
        )}
      </div>
    </div>
  );
};

export default Logo;
