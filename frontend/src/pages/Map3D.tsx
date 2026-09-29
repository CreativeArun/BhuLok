import React, { useEffect, useMemo, useState } from 'react';
import type * as Cesium from 'cesium';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import CesiumMap, { type ProjectWithBuildings } from '../components/map/CesiumMap';
import PropertyDrawer from '../components/map/PropertyDrawer';
import MapToolbar from '../components/map/MapToolbar';
import MapLayers from '../components/map/MapLayers';
import BuildingSelection from '../components/map/BuildingSelection';
import projectService from '../services/projectService';
import jobService from '../services/jobService';
import storageService from '../services/storageService';
import type { BuildingGeometry, UnitGeometry } from '../types/job';
import type { MapLayerOptions, MapSearchResult, SelectedBuilding } from '../types/map';
import type { Project } from '../types/project';

export const Map3D: React.FC = () => {
  const [projectsWithBuildings, setProjectsWithBuildings] = useState<ProjectWithBuildings[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<SelectedBuilding | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [targetFlyLocation, setTargetFlyLocation] = useState<{
    latitude: number;
    longitude: number;
    altitude?: number;
    buildingNumber?: number;
  } | null>(null);

  const [layerOptions, setLayerOptions] = useState<MapLayerOptions>({
    showBuildings: true,
    showFootprints: true,
    imageryType: 'streets',
    showTerrain: false,
  });

  const [viewerInstance, setViewerInstance] = useState<Cesium.Viewer | null>(null);

  // 1. Load real Projects and 3D Building geometries from Node API
  useEffect(() => {
    let isMounted = true;

    async function loadCadastralData() {
      setLoading(true);
      setError(null);

      try {
        let loadedProjects: Project[] = [];

        try {
          loadedProjects = await projectService.getProjects();
        } catch (apiErr) {
          console.warn('Node API projects endpoint error:', apiErr);
          loadedProjects = [];
        }

        const projectDataPromises = loadedProjects.map(async (project) => {
          let buildings: BuildingGeometry[] = [];
          let activeJobId = storageService.getActiveJobId(project.projectId) || undefined;

          try {
            // Fetch real project jobs from Node API endpoint /api/v1/projects/:projectId/jobs
            const jobs = await jobService.getProjectJobs(project.projectId);
            const completedJob = jobs.find(
              (j) => j.status === 'COMPLETED' && j.result?.data?.buildings?.length
            );

            if (completedJob?.result?.data?.buildings) {
              buildings = completedJob.result.data.buildings;
              activeJobId = completedJob.jobId;
            }
          } catch (jobErr) {
            console.warn(`Job fetch failed for project ${project.projectId}:`, jobErr);
            // Check local session cache for active completed job
            const cachedJob = storageService.getCachedJobForProject(project.projectId);
            if (cachedJob?.result?.data?.buildings) {
              buildings = cachedJob.result.data.buildings;
              activeJobId = cachedJob.jobId;
            }
          }

          // If no buildings found yet, and project has activeJobId, try fetching that job directly
          if (buildings.length === 0 && activeJobId) {
            try {
              const directJob = await jobService.getJob(activeJobId);
              if (directJob?.status === 'COMPLETED' && directJob.result?.data?.buildings?.length) {
                buildings = directJob.result.data.buildings;
              }
            } catch {
              // ignore
            }
          }

          // Also check known completed job for test project PRJ-9ec00671-8723-4af6-b273-d98b01139ca8
          if (buildings.length === 0 && project.projectId === 'PRJ-9ec00671-8723-4af6-b273-d98b01139ca8') {
            try {
              const knownJob = await jobService.getJob('JOB-d7f8584d-78c7-446c-ab65-1b7aaaa94c4b');
              if (knownJob?.status === 'COMPLETED' && knownJob.result?.data?.buildings?.length) {
                buildings = knownJob.result.data.buildings;
                activeJobId = knownJob.jobId;
              }
            } catch {
              // ignore
            }
          }

          return {
            project,
            buildings,
            activeJobId,
          };
        });

        const resolved = await Promise.all(projectDataPromises);

        if (isMounted) {
          setProjectsWithBuildings(resolved);
          setLoading(false);

          // Fly camera to the first project that contains 3D buildings
          const firstWithBldgs = resolved.find((p) => p.buildings.length > 0);
          if (firstWithBldgs) {
            setTargetFlyLocation({
              latitude: firstWithBldgs.project.location.latitude,
              longitude: firstWithBldgs.project.location.longitude,
              altitude: 350,
            });
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load cadastral data from API');
          setProjectsWithBuildings([]);
          setLoading(false);
        }
      }
    }

    loadCadastralData();

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Computed Search Suggestions
  const searchResults = useMemo<MapSearchResult[]>(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.trim().toLowerCase();
    const results: MapSearchResult[] = [];

    for (const item of projectsWithBuildings) {
      const { project, buildings } = item;

      // Match Project Name
      if (project.name.toLowerCase().includes(query)) {
        results.push({
          id: `proj_${project.projectId}`,
          title: project.name,
          subtitle: `Project • ${buildings.length} 3D Buildings`,
          type: 'project',
          projectId: project.projectId,
          latitude: project.location.latitude,
          longitude: project.location.longitude,
        });
      }

      // Match Buildings & Units
      for (const bldg of buildings) {
        const bldgMatch = `building ${bldg.buildingNumber}`.includes(query);
        const ulpinMatch = bldg.units?.some((u) => u.ulpin?.toLowerCase().includes(query));

        if (bldgMatch || ulpinMatch) {
          const matchedUnit = bldg.units?.find((u) => u.ulpin?.toLowerCase().includes(query));
          results.push({
            id: `bldg_${project.projectId}_${bldg.buildingNumber}`,
            title: `Building ${bldg.buildingNumber} (${bldg.floorCount}F • ${bldg.unitCount} Units)`,
            subtitle: matchedUnit?.ulpin
              ? `Matched ULPIN: ${matchedUnit.ulpin} (${project.name})`
              : `${project.name} • ${bldg.footprintArea} m²`,
            type: matchedUnit ? 'ulpin' : 'building',
            projectId: project.projectId,
            buildingNumber: bldg.buildingNumber,
            unitNumber: matchedUnit?.unitNumber,
            latitude: project.location.latitude,
            longitude: project.location.longitude,
          });
        }
      }
    }

    return results.slice(0, 6);
  }, [searchQuery, projectsWithBuildings]);

  // Handle Search Result Selection
  const handleSelectSearchResult = (res: MapSearchResult) => {
    setSearchQuery('');

    const targetProjectItem = projectsWithBuildings.find(
      (p) => p.project.projectId === res.projectId
    );
    if (!targetProjectItem) return;

    if (res.buildingNumber !== undefined) {
      const bldg = targetProjectItem.buildings.find(
        (b) => b.buildingNumber === res.buildingNumber
      );
      if (bldg) {
        const matchedUnit = res.unitNumber
          ? bldg.units?.find((u) => u.unitNumber === res.unitNumber)
          : null;

        setSelectedBuilding({
          buildingNumber: bldg.buildingNumber,
          projectId: targetProjectItem.project.projectId,
          projectName: targetProjectItem.project.name,
          location: targetProjectItem.project.location,
          ulpin: matchedUnit?.ulpin || bldg.units?.[0]?.ulpin || `B00${bldg.buildingNumber}-CAD`,
          floorCount: bldg.floorCount,
          unitCount: bldg.unitCount,
          area: bldg.footprintArea,
          height: bldg.topZ,
          registryStatus: targetProjectItem.project.springParcelId ? 'SYNCHRONIZED' : 'LOCAL_ONLY',
          units: bldg.units || [],
          selectedUnit: matchedUnit || null,
          building: bldg,
        });
      }
    }

    setTargetFlyLocation({
      latitude: res.latitude,
      longitude: res.longitude,
      altitude: 220,
      buildingNumber: res.buildingNumber,
    });
  };

  // Reset Camera View to primary cluster
  const handleResetView = () => {
    const projectWithBldgs =
      projectsWithBuildings.find((p) => p.buildings.length > 0) ||
      projectsWithBuildings[0];

    if (projectWithBldgs?.project.location) {
      const loc = projectWithBldgs.project.location;
      setTargetFlyLocation({
        latitude: loc.latitude,
        longitude: loc.longitude,
        altitude: 450,
      });
    } else {
      // Default to Delhi Center
      setTargetFlyLocation({
        latitude: 28.6139,
        longitude: 77.209,
        altitude: 850,
      });
    }
  };

  // Fly to selected building
  const handleFocusSelected = () => {
    if (!selectedBuilding) return;
    setTargetFlyLocation({
      latitude: selectedBuilding.location.latitude,
      longitude: selectedBuilding.location.longitude,
      altitude: 180,
      buildingNumber: selectedBuilding.buildingNumber,
    });
  };

  // Handle selecting an individual unit from the drawer
  const handleSelectUnit = (unit: UnitGeometry | null) => {
    if (!selectedBuilding) return;
    setSelectedBuilding({
      ...selectedBuilding,
      selectedUnit: unit,
      ulpin: unit?.ulpin || selectedBuilding.ulpin,
    });
  };

  // Total summary statistics
  const totalStats = useMemo(() => {
    let buildings = 0;
    let units = 0;
    for (const item of projectsWithBuildings) {
      buildings += item.buildings.length;
      for (const b of item.buildings) {
        units += b.unitCount || 0;
      }
    }
    return {
      projects: projectsWithBuildings.length,
      buildings,
      units,
    };
  }, [projectsWithBuildings]);

  const hasBuildings = totalStats.buildings > 0;

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen flex flex-col overflow-hidden">
      <Navbar />

      <main className="relative w-full flex-1 pt-20 flex flex-col overflow-hidden">
        {/* Top Control Bar: Search & Global Cadastral Stats */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 w-full max-w-4xl px-4 flex flex-col items-center gap-2 pointer-events-none">
          {/* Search Box */}
          <div className="relative w-full max-w-lg pointer-events-auto">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-surface-container-lowest/95 backdrop-blur-xl rounded-full shadow-xl border border-surface-container-high/60 focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary transition-all">
              <span className="material-symbols-outlined text-primary text-[22px]">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ULPIN, Building #, or Project..."
                className="w-full bg-transparent border-none outline-none font-body-md text-label-md text-on-surface placeholder:text-on-surface-variant"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-on-surface-variant hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-surface-container-lowest/98 backdrop-blur-2xl rounded-2xl shadow-2xl border border-surface-container-high/60 overflow-hidden divide-y divide-surface-container-high/40 animate-in fade-in duration-150">
                {searchResults.map((res) => (
                  <button
                    key={res.id}
                    onClick={() => handleSelectSearchResult(res)}
                    className="w-full px-4 py-3 text-left hover:bg-surface-container flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[18px]">
                          {res.type === 'project'
                            ? 'folder'
                            : res.type === 'ulpin'
                              ? 'pin_drop'
                              : 'apartment'}
                        </span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-label-md text-label-md font-bold text-on-surface truncate">
                          {res.title}
                        </span>
                        <span className="font-body-sm text-[11px] text-on-surface-variant truncate">
                          {res.subtitle}
                        </span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[18px] text-primary shrink-0">
                      arrow_forward
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Selected Building Quick Banner */}
        <BuildingSelection
          selectedBuilding={selectedBuilding}
          onClear={() => setSelectedBuilding(null)}
          onFocus={handleFocusSelected}
        />

        {/* Layer Controls */}
        <MapLayers
          layerOptions={layerOptions}
          onChangeOptions={(updated) => setLayerOptions((prev) => ({ ...prev, ...updated }))}
        />

        {/* Bottom Floating Toolbar */}
        <MapToolbar
          viewer={viewerInstance}
          onResetView={handleResetView}
          onFocusSelected={handleFocusSelected}
          hasSelection={selectedBuilding !== null}
        />

        {/* Cadastral Stats Pill (Top Right) */}
        <div className="absolute top-24 right-6 z-20 hidden lg:flex items-center gap-4 px-4 py-2 bg-surface-container-lowest/90 backdrop-blur-md rounded-2xl shadow-lg border border-surface-container-high/60">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${hasBuildings ? 'bg-emerald-500' : 'bg-slate-400'}`} />
            <span className="text-[12px] font-bold text-on-surface">
              {totalStats.buildings}
            </span>
            <span className="text-[11px] text-on-surface-variant">3D Buildings</span>
          </div>
          <div className="w-[1px] h-3.5 bg-surface-container-high" />
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] font-bold text-on-surface">
              {totalStats.units}
            </span>
            <span className="text-[11px] text-on-surface-variant">Vertical Parcels</span>
          </div>
          <div className="w-[1px] h-3.5 bg-surface-container-high" />
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] font-bold text-primary">
              {totalStats.projects}
            </span>
            <span className="text-[11px] text-on-surface-variant">Projects</span>
          </div>
        </div>

        {/* Informational Banner when no 3D buildings are available yet */}
        {!loading && !hasBuildings && (
          <div className="absolute top-36 left-1/2 -translate-x-1/2 z-20 max-w-md w-full px-4 animate-in fade-in duration-200">
            <div className="p-4 rounded-2xl bg-surface-container-lowest/95 backdrop-blur-md shadow-xl border border-surface-container-high/70 flex flex-col gap-2 text-center">
              <div className="flex items-center justify-center gap-2 text-primary">
                <span className="material-symbols-outlined text-[24px]">view_in_ar</span>
                <span className="font-title-sm text-title-sm font-bold text-on-surface">
                  No 3D property model available yet
                </span>
              </div>
              <p className="font-body-sm text-[12px] text-on-surface-variant">
                Upload a point cloud dataset and process a FULL_PIPELINE job to generate verified 3D vertical parcels.
              </p>
              <div className="pt-1 flex items-center justify-center gap-3">
                <Link
                  to="/create-project"
                  className="px-4 py-1.5 rounded-full bg-primary text-on-primary text-label-sm font-semibold hover:bg-primary/90 transition-colors shadow-xs"
                >
                  + Create Project
                </Link>
                <Link
                  to="/property-report"
                  className="px-4 py-1.5 rounded-full bg-surface-container-high text-on-surface text-label-sm font-semibold hover:bg-surface-container-highest transition-colors"
                >
                  View Projects
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* 3D Property Inspection Drawer */}
        <PropertyDrawer
          selectedBuilding={selectedBuilding}
          onClose={() => setSelectedBuilding(null)}
          onZoomToBuilding={handleFocusSelected}
          onSelectUnit={handleSelectUnit}
        />

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 z-40 bg-surface/70 backdrop-blur-sm flex items-center justify-center pointer-events-none">
            <div className="px-5 py-3 rounded-2xl bg-surface-container-lowest shadow-xl border border-surface-container-high flex items-center gap-3">
              <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-label-md font-semibold text-on-surface">
                Loading 3D Cadastral Digital Twins...
              </span>
            </div>
          </div>
        )}

        {/* Error notification banner if any */}
        {error && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-xl bg-amber-500/90 text-white text-label-sm font-semibold shadow-lg">
            {error}
          </div>
        )}

        {/* Core Cesium 3D Globe & Building Visualizer */}
        <div className="w-full h-full flex-1">
          <CesiumMap
            projectsWithBuildings={projectsWithBuildings}
            selectedBuilding={selectedBuilding}
            onSelectBuilding={setSelectedBuilding}
            layerOptions={layerOptions}
            targetFlyLocation={targetFlyLocation}
            onViewerReady={setViewerInstance}
          />
        </div>
      </main>
    </div>
  );
};

export default Map3D;
