import { useState, useEffect } from 'react';
import { CategoryFilters } from './CategoryFilters';
import { MapContainer } from './MapContainer';
import { LocationDrawer } from './LocationDrawer';
import { mapExplorerService, type MapPOIItem } from './mapExplorer.service';
import { sqlVault } from '@/system/database/sqlVault';

export function MapExplorerPage() {
  const [pois, setPois] = useState<MapPOIItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [heatmapEnabled, setHeatmapEnabled] = useState(false);
  const [selectedPOI, setSelectedPOI] = useState<MapPOIItem | null>(null);
  const [harvestCount, setHarvestCount] = useState(() => sqlVault.getHarvestedPlaces().length);

  const loadPOIs = () => {
    mapExplorerService.getPOIs(activeCategory).then(setPois);
    setHarvestCount(sqlVault.getHarvestedPlaces().length);
  };

  useEffect(() => {
    loadPOIs();
  }, [activeCategory]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
            Live Map Explorer & Real POI Harvester
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Interactive GIS geospatial nodes across commercial corridors, footfall anchors, and harvested real establishments.
          </p>
        </div>
      </div>

      <CategoryFilters
        activeCategory={activeCategory}
        onChange={setActiveCategory}
        heatmapEnabled={heatmapEnabled}
        onToggleHeatmap={() => setHeatmapEnabled(!heatmapEnabled)}
        harvestCount={harvestCount}
      />

      <div className="relative">
        <MapContainer
          pois={pois}
          selectedPOI={selectedPOI}
          onSelectPOI={setSelectedPOI}
          heatmapEnabled={heatmapEnabled}
          onRefreshPOIs={loadPOIs}
        />

        <LocationDrawer item={selectedPOI} onClose={() => setSelectedPOI(null)} />
      </div>
    </div>
  );
}

