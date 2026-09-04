import { useState, useEffect } from 'react';
import { CategoryFilters } from './CategoryFilters';
import { MapContainer } from './MapContainer';
import { LocationDrawer } from './LocationDrawer';
import { mapExplorerService, type MapPOIItem } from './mapExplorer.service';

export function MapExplorerPage() {
  const [pois, setPois] = useState<MapPOIItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [heatmapEnabled, setHeatmapEnabled] = useState(false);
  const [selectedPOI, setSelectedPOI] = useState<MapPOIItem | null>(null);

  useEffect(() => {
    mapExplorerService.getPOIs(activeCategory).then(setPois);
  }, [activeCategory]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
            Live Map Explorer
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Interactive GIS geospatial nodes across commercial corridors, footfall anchors, and available properties.
          </p>
        </div>
      </div>

      <CategoryFilters
        activeCategory={activeCategory}
        onChange={setActiveCategory}
        heatmapEnabled={heatmapEnabled}
        onToggleHeatmap={() => setHeatmapEnabled(!heatmapEnabled)}
      />

      <div className="relative">
        <MapContainer
          pois={pois}
          selectedPOI={selectedPOI}
          onSelectPOI={setSelectedPOI}
          heatmapEnabled={heatmapEnabled}
        />

        <LocationDrawer item={selectedPOI} onClose={() => setSelectedPOI(null)} />
      </div>
    </div>
  );
}

