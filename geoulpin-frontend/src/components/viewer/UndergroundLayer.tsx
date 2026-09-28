import React from 'react';

interface UndergroundLayerProps {
  showUnderground: boolean;
  setShowUnderground: (show: boolean) => void;
}

const UndergroundLayer: React.FC<UndergroundLayerProps> = ({ showUnderground, setShowUnderground }) => {
  return (
    <div className="absolute bottom-space-md left-space-md lg:left-margin-md z-10">
      <div className="bg-surface-container-lowest/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg border border-surface-container-high/60 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary">
          <span className="material-symbols-outlined text-[20px]">water_voc</span>
        </div>
        <div className="flex flex-col pr-1">
          <span className="font-title-sm text-label-md text-on-surface">Subterranean Utilities</span>
          <span className="font-body-md text-label-sm text-on-surface-variant">Pipes &amp; electrical routing</span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer select-none">
          <input
            checked={showUnderground}
            onChange={(e) => setShowUnderground(e.target.checked)}
            className="sr-only peer"
            type="checkbox"
          />
          <div className="w-12 h-6.5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      </div>
    </div>
  );
};

export default UndergroundLayer;
