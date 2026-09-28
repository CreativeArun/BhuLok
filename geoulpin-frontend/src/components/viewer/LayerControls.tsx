import React from 'react';

const LayerControls: React.FC = () => {
  return (
    <div className="absolute bottom-space-md left-1/2 -translate-x-1/2 lg:-translate-x-[220px] z-10 flex items-center gap-1.5 p-1.5 bg-surface-container-lowest/90 backdrop-blur-md rounded-full shadow-lg border border-surface-container-high/60">
      <button className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" title="Zoom In">
        <span className="material-symbols-outlined text-[20px]">add</span>
      </button>
      <button className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" title="Zoom Out">
        <span className="material-symbols-outlined text-[20px]">remove</span>
      </button>
      <div className="w-[1px] h-5 bg-outline-variant/40 mx-0.5"></div>
      <button className="px-3.5 h-10 rounded-full flex items-center gap-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" title="Rotate Camera">
        <span className="material-symbols-outlined text-[18px]">rotate_90_degrees_cw</span>
        <span className="font-label-md text-label-sm">Rotate 45°</span>
      </button>
      <button className="px-3.5 h-10 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-1.5" title="Reset Perspective">
        <span className="material-symbols-outlined text-[18px]">view_in_ar</span>
        <span className="font-label-md text-label-sm font-semibold">Isometric</span>
      </button>
    </div>
  );
};

export default LayerControls;
