import React from 'react';
import * as Cesium from 'cesium';

interface MapToolbarProps {
  viewer: Cesium.Viewer | null;
  onResetView: () => void;
  onFocusSelected: () => void;
  hasSelection: boolean;
}

export const MapToolbar: React.FC<MapToolbarProps> = ({
  viewer,
  onResetView,
  onFocusSelected,
  hasSelection,
}) => {
  const handleZoomIn = () => {
    if (!viewer) return;
    viewer.camera.zoomIn(150);
  };

  const handleZoomOut = () => {
    if (!viewer) return;
    viewer.camera.zoomOut(150);
  };

  const handleToggleIsometric = () => {
    if (!viewer) return;
    const camera = viewer.camera;
    const currentHeading = camera.heading;
    camera.setView({
      orientation: {
        heading: currentHeading + Cesium.Math.toRadians(45),
        pitch: Cesium.Math.toRadians(-40),
        roll: 0.0,
      },
    });
  };

  const handleTopDown = () => {
    if (!viewer) return;
    const camera = viewer.camera;
    camera.setView({
      orientation: {
        heading: camera.heading,
        pitch: Cesium.Math.toRadians(-90),
        roll: 0.0,
      },
    });
  };

  return (
    <div className="absolute bottom-6 left-6 z-20 flex items-center gap-1.5 p-1.5 bg-surface-container-lowest/90 backdrop-blur-md rounded-2xl shadow-xl border border-surface-container-high/60">
      <button
        onClick={handleZoomIn}
        className="w-9 h-9 rounded-xl flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
        title="Zoom In (+)"
      >
        <span className="material-symbols-outlined text-[20px]">add</span>
      </button>

      <button
        onClick={handleZoomOut}
        className="w-9 h-9 rounded-xl flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
        title="Zoom Out (-)"
      >
        <span className="material-symbols-outlined text-[20px]">remove</span>
      </button>

      <div className="w-[1px] h-5 bg-surface-container-high mx-0.5" />

      <button
        onClick={handleToggleIsometric}
        className="px-3 h-9 rounded-xl flex items-center gap-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-label-md text-label-sm transition-colors"
        title="Tilt 45° 3D Isometric View"
      >
        <span className="material-symbols-outlined text-[18px]">view_in_ar</span>
        <span className="hidden sm:inline">3D Tilt</span>
      </button>

      <button
        onClick={handleTopDown}
        className="px-3 h-9 rounded-xl flex items-center gap-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-label-md text-label-sm transition-colors"
        title="2D Cadastral Nadir (Top-Down)"
      >
        <span className="material-symbols-outlined text-[18px]">layers</span>
        <span className="hidden sm:inline">Top Down</span>
      </button>

      <div className="w-[1px] h-5 bg-surface-container-high mx-0.5" />

      {hasSelection && (
        <button
          onClick={onFocusSelected}
          className="px-3 h-9 rounded-xl bg-primary text-on-primary font-label-md text-label-sm font-semibold flex items-center gap-1.5 shadow-xs hover:bg-primary/90 transition-colors"
          title="Focus Selected Property"
        >
          <span className="material-symbols-outlined text-[18px]">filter_center_focus</span>
          <span>Focus</span>
        </button>
      )}

      <button
        onClick={onResetView}
        className="w-9 h-9 rounded-xl flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
        title="Reset Camera Overview"
      >
        <span className="material-symbols-outlined text-[20px]">refresh</span>
      </button>
    </div>
  );
};

export default MapToolbar;
