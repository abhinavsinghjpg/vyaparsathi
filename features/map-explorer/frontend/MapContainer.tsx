import { sqlVault } from '@/system/database/sqlVault';
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Search, X, Loader2, MapPin, Globe, Navigation } from 'lucide-react';
import { osmClientService } from './osm.service';
import type { MapPOIItem } from './mapExplorer.service';
import { mapExplorerDb } from '../backend/mapExplorer.db';

interface MapContainerProps {
  pois: MapPOIItem[];
  selectedPOI: MapPOIItem | null;
  onSelectPOI: (poi: MapPOIItem) => void;
  heatmapEnabled: boolean;
}

type TileLayerType = 'google-maps' | 'google-satellite' | 'osm-standard' | 'osm-humanitarian';

interface TileConfig {
  label: string;
  provider: 'Google' | 'OSM';
  url: string;
  subdomains?: string[];
  attribution: string;
  maxZoom: number;
}

const TILE_CONFIGS: Record<TileLayerType, TileConfig> = {
  'google-maps': {
    label: 'Google Maps',
    provider: 'Google',
    url: 'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: 'Map data &copy; Google Maps',
    maxZoom: 20,
  },
  'google-satellite': {
    label: 'Google Satellite',
    provider: 'Google',
    url: 'https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: 'Imagery &copy; Google Maps',
    maxZoom: 20,
  },
  'osm-standard': {
    label: 'OSM Standard',
    provider: 'OSM',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },
  'osm-humanitarian': {
    label: 'OSM Vibrant',
    provider: 'OSM',
    url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors, HOT style',
    maxZoom: 19,
  },
};

// Quick Jump City Hubs across India
const CITY_SHORTCUTS = [
  { name: 'Bengaluru', lat: 12.9716, lng: 77.5946, zoom: 13 },
  { name: 'Delhi NCR', lat: 28.6139, lng: 77.2090, zoom: 13 },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777, zoom: 13 },
  { name: 'Hyderabad', lat: 17.3850, lng: 78.4867, zoom: 13 },
  { name: 'Pune', lat: 18.5204, lng: 73.8567, zoom: 13 },
  { name: 'Jaipur', lat: 26.9124, lng: 75.7873, zoom: 13 },
];

// Well-known commercial hotspots
const POPULAR_CORRIDORS = [
  { name: 'Koramangala 5th Block', city: 'Bengaluru', lat: 12.9352, lng: 77.6245 },
  { name: 'Connaught Place', city: 'New Delhi', lat: 28.6315, lng: 77.2167 },
  { name: 'Bandra West (Linking Rd)', city: 'Mumbai', lat: 12.9784, lng: 77.6408 },
  { name: 'Indiranagar 100ft Rd', city: 'Bengaluru', lat: 12.9784, lng: 77.6408 },
  { name: 'DLF Cyber City', city: 'Gurugram', lat: 28.4952, lng: 77.0892 },
  { name: 'FC Road', city: 'Pune', lat: 18.5204, lng: 73.8415 },
  { name: 'Banjara Hills Rd No. 12', city: 'Hyderabad', lat: 17.4156, lng: 78.4350 },
  { name: 'C-Scheme', city: 'Jaipur', lat: 26.9080, lng: 75.8010 },
];

interface MapContainerProps {
  pois: MapPOIItem[];
  selectedPOI: MapPOIItem | null;
  onSelectPOI: (poi: MapPOIItem) => void;
  heatmapEnabled: boolean;
  onRefreshPOIs?: () => void;
}

export function MapContainer({
  pois,
  selectedPOI,
  onSelectPOI,
  heatmapEnabled,
  onRefreshPOIs,
}: MapContainerProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const heatLayerRef = useRef<L.LayerGroup | null>(null);
  const searchPinLayerRef = useRef<L.LayerGroup | null>(null);

  // Map state
  const [activeTileType, setActiveTileType] = useState<TileLayerType>('google-maps');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeLocationLabel, setActiveLocationLabel] = useState<string | null>(null);
  const [selectedHarvestCategory, setSelectedHarvestCategory] = useState('All');
  const [isHarvesting, setIsHarvesting] = useState(false);
  const [harvestSuccess, setHarvestSuccess] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

    const handleHarvestClick = async () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    setIsHarvesting(true);
    const center = map.getCenter();
    const resolvedLocality = activeLocationLabel ? activeLocationLabel.split(',')[0].trim() : 'Local Catchment';
    const resolvedCity = activeLocationLabel ? (activeLocationLabel.split(',')[1]?.trim() || 'Jaipur') : 'Jaipur';

    try {
      // 1. Call real OSM Overpass Harvester
      const harvested = await osmClientService.harvestEstablishments(
        center.lat,
        center.lng,
        selectedHarvestCategory,
        resolvedLocality,
        resolvedCity,
        35
      );

      // 2. Persist directly to SQL DB Vault
      sqlVault.saveBatchHarvestedPlaces(harvested);

      // 3. Save to mapExplorerDb for immediate display on Leaflet map
      mapExplorerDb.saveHarvestedShops(harvested.map(h => ({
        name: h.name,
        category: h.category,
        address: h.address,
        locality: h.locality,
        city: h.city,
        lat: h.lat,
        lng: h.lng,
        source: h.source,
        dailyFootfallEst: h.footfallEstimate,
        rating: h.rating,
      })));

      setHarvestSuccess(true);
      if (onRefreshPOIs) onRefreshPOIs();
      setTimeout(() => setHarvestSuccess(false), 3000);
    } catch (e) {
      console.warn('[MapContainer] Harvesting error', e);
    } finally {
      setIsHarvesting(false);
    }
  };

  // Close search dropdown on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSearchOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Default center around central India
    const map = L.map(mapRef.current, {
      center: [20.5937, 78.9629],
      zoom: 5,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Initial tile layer: Google Maps Roadmap (or OSM fallback)
    const initialConfig = TILE_CONFIGS['google-maps'];
    const tileLayer = L.tileLayer(initialConfig.url, {
      maxZoom: initialConfig.maxZoom,
      subdomains: initialConfig.subdomains || ['a', 'b', 'c'],
      attribution: initialConfig.attribution,
    }).addTo(map);

    tileLayerRef.current = tileLayer;
    mapInstanceRef.current = map;
    markersLayerRef.current = L.layerGroup().addTo(map);
    heatLayerRef.current = L.layerGroup().addTo(map);
    searchPinLayerRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update tile layer when activeTileType changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const config = TILE_CONFIGS[activeTileType];
    const newLayer = L.tileLayer(config.url, {
      maxZoom: config.maxZoom,
      subdomains: config.subdomains || ['a', 'b', 'c'],
      attribution: config.attribution,
    }).addTo(map);

    tileLayerRef.current = newLayer;
  }, [activeTileType]);

  // Update markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    pois.forEach(poi => {
      const isSelected = selectedPOI?.id === poi.id;
      const markerColor =
        poi.category === 'Corridor Hub'
          ? '#c59b27'
          : poi.category === 'Shop'
          ? '#3b82f6'
          : poi.category === 'Office'
          ? '#8b5cf6'
          : '#10b981';

      const iconSvg = `
        <svg width="34" height="42" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
          <filter id="shadow-${poi.id}" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.35"/>
          </filter>
          <path d="M16 0C7.16 0 0 7.16 0 16c0 10 16 24 16 24s16-14 16-24C32 7.16 24.84 0 16 0z" 
                fill="${markerColor}" 
                stroke="#ffffff" 
                stroke-width="${isSelected ? 3.5 : 2}" 
                filter="url(#shadow-${poi.id})"/>
          <circle cx="16" cy="16" r="6" fill="#ffffff"/>
        </svg>
      `;

      const customIcon = L.divIcon({
        className: 'custom-marker-icon',
        html: iconSvg,
        iconSize: [34, 42],
        iconAnchor: [17, 42],
      });

      const marker = L.marker([poi.lat, poi.lng], { icon: customIcon });
      
      const popupHtml = `
        <div style="font-family: inherit; min-width: 180px;">
          <div style="font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; color: #c59b27; margin-bottom: 2px;">
            ${poi.category} • ${poi.city}
          </div>
          <div style="font-size: 13px; font-weight: bold; color: inherit; margin-bottom: 6px;">
            ${poi.name}
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 11px; margin-bottom: 8px; padding: 6px; background: rgba(148,163,184,0.12); border-radius: 8px;">
            <div>
              <span style="color: #888; font-size: 9px; display: block; text-transform: uppercase;">Footfall</span>
              <strong style="color: #3b82f6;">${poi.footfallDensity}</strong>
            </div>
            <div>
              <span style="color: #888; font-size: 9px; display: block; text-transform: uppercase;">Est. Rent</span>
              <strong>₹${poi.avgRentSqft}/sqft</strong>
            </div>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px;">
            <span style="color: #c59b27; font-weight: bold;">Score: ${poi.opportunityScore}/10</span>
            <span style="font-size: 10px; color: #94a3b8;">Inspected in Drawer ↗</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        className: 'vyapar-map-popup',
        autoPan: true,
        autoPanPaddingTopLeft: L.point(40, 140),
        autoPanPaddingBottomRight: L.point(40, 40),
        offset: L.point(0, -38),
      });

      marker.bindTooltip(`<b>${poi.name}</b><br/><span style="font-size:11px;color:#888;">${poi.category} • ${poi.city}</span>`, {
        direction: 'top',
        offset: [0, -38],
      });
      
      marker.on('click', () => {
        onSelectPOI(poi);
        map.flyTo([poi.lat, poi.lng], Math.max(map.getZoom(), 13), { duration: 1.2 });
        marker.openPopup();
      });

      layer.addLayer(marker);
    });
  }, [pois, selectedPOI, onSelectPOI]);

  // Heatmap layer simulation
  useEffect(() => {
    const map = mapInstanceRef.current;
    const heatLayer = heatLayerRef.current;
    if (!map || !heatLayer) return;

    heatLayer.clearLayers();

    if (heatmapEnabled) {
      pois.forEach(poi => {
        const radius = Math.max(12000, poi.avgRentSqft * 300);
        const circle = L.circle([poi.lat, poi.lng], {
          color: '#ea580c',
          fillColor: '#f97316',
          fillOpacity: 0.18,
          radius: radius,
          weight: 1,
        });
        heatLayer.addLayer(circle);
      });
    }
  }, [heatmapEnabled, pois]);

  // Fly to target coordinate and drop a search pulse pin
  const handleFlyTo = (lat: number, lng: number, label: string, zoom = 14, cityName?: string) => {
    const map = mapInstanceRef.current;
    const searchLayer = searchPinLayerRef.current;
    if (!map) return;

    map.flyTo([lat, lng], zoom, { duration: 1.4 });
    setActiveLocationLabel(label);
    setSearchOpen(false);

    // Harvest 35 local establishments for the persistent real data store
    const resolvedCity = cityName || (label.includes(',') ? label.split(',').pop()?.trim() : label) || 'Jaipur';
    try {
      mapExplorerDb.harvestArea(label.split(',')[0].trim(), resolvedCity, lat, lng, 35);
    } catch (e) {
      console.warn('[MapExplorer] Harvesting skipped:', e);
    }

    if (searchLayer) {
      searchLayer.clearLayers();

      const pulseHtml = `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-8 h-8 rounded-full bg-gold-400/40 animate-ping"></div>
          <div class="relative w-5 h-5 rounded-full bg-gold-500 border-2 border-white shadow-lg flex items-center justify-center text-[10px] font-black text-black">
            ✦
          </div>
        </div>
      `;

      const pulseIcon = L.divIcon({
        className: 'search-pulse-icon',
        html: pulseHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const searchMarker = L.marker([lat, lng], { icon: pulseIcon }).addTo(searchLayer);
      searchMarker.bindPopup(`
        <div style="font-family: inherit; padding: 4px; min-width: 180px;">
          <div style="font-size: 10px; font-weight: bold; color: #c59b27; text-transform: uppercase;">Searched Zone</div>
          <strong style="font-size: 13px; color: inherit; display: block; margin-top: 2px;">${label}</strong>
          <div style="font-size: 11px; color: #888; margin-top: 3px;">
            Target Commercial Zone • Lat: ${lat.toFixed(4)}, Lon: ${lng.toFixed(4)}
          </div>
        </div>
      `, {
        className: 'vyapar-map-popup',
        autoPan: true,
        autoPanPaddingTopLeft: L.point(40, 140),
        autoPanPaddingBottomRight: L.point(40, 40),
        offset: L.point(0, -20),
      }).openPopup();
    }
  };

  // Perform geocode search via OSM Nominatim
  const handleSearchSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    // Check if matches a known corridor first
    const matchedCorridor = POPULAR_CORRIDORS.find(c =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.city.toLowerCase().includes(query.toLowerCase())
    );

    if (matchedCorridor) {
      handleFlyTo(matchedCorridor.lat, matchedCorridor.lng, `${matchedCorridor.name}, ${matchedCorridor.city}`, 15, matchedCorridor.city);
      return;
    }

    // Check if matches a city
    const matchedCity = CITY_SHORTCUTS.find(c =>
      c.name.toLowerCase().includes(query.toLowerCase())
    );

    if (matchedCity) {
      handleFlyTo(matchedCity.lat, matchedCity.lng, matchedCity.name, matchedCity.zoom, matchedCity.name);
      return;
    }

    // Fallback to live geocoding
    setIsSearching(true);
    try {
      const res = await osmClientService.geocode(query);
      if (res) {
        handleFlyTo(res.latitude, res.longitude, res.displayName.split(',')[0], 14);
      } else {
        alert(`Could not locate "${query}". Try searching a city like "Indiranagar", "Connaught Place", or "Bandra".`);
      }
    } finally {
      setIsSearching(false);
    }
  };

  // Filter corridors for autocomplete
  const matchingCorridors = POPULAR_CORRIDORS.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative w-full h-[580px] sm:h-[650px] rounded-2xl overflow-hidden border border-border/80 shadow-md">
      {/* Map Canvas */}
      <div
        ref={mapRef}
        className="w-full h-full"
      />

      {/* TOP-LEFT: Floating Location Search Bar & Quick Jump Shortcuts */}
      <div ref={searchContainerRef} className="absolute top-4 left-4 z-[1000] w-[calc(100%-2rem)] sm:w-96 space-y-2">
        {/* Search Input Box */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative flex items-center rounded-2xl bg-card/95 backdrop-blur-md border border-border/90 shadow-2xl overflow-visible transition-all focus-within:ring-2 focus-within:ring-gold-500/50"
        >
          <div className="pl-3.5 text-muted-foreground">
            {isSearching ? (
              <Loader2 size={16} className="animate-spin text-gold-400" />
            ) : (
              <Search size={16} className="text-gold-400" />
            )}
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            placeholder="Search city, area or street…"
            className="w-full h-11 bg-transparent px-3 text-xs text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSearchOpen(false);
              }}
              className="p-1 mr-1 text-muted-foreground hover:text-foreground rounded-md"
            >
              <X size={15} />
            </button>
          )}

          <button
            type="submit"
            disabled={isSearching || !searchQuery.trim()}
            className="mr-1.5 px-3 py-1.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-brand-dark font-bold text-xs shadow-sm transition-all disabled:opacity-40 shrink-0"
          >
            Search
          </button>

          {/* Autocomplete Dropdown - high contrast solid, auto-close on mouse leave, triggers >= 3 chars */}
          {searchOpen && searchQuery.trim().length >= 3 && (
            <div
              onMouseLeave={() => setSearchOpen(false)}
              className="absolute top-full left-0 right-0 mt-1.5 max-h-72 overflow-y-auto rounded-2xl border-2 border-gold-500/50 bg-slate-900 text-white p-2 shadow-2xl z-[2000] text-xs"
            >
              <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-gold-400 font-bold border-b border-white/10 mb-1 flex items-center justify-between">
                <span>Commercial Corridors</span>
                <span className="text-slate-400 font-normal">Exit hover to close</span>
              </div>

              {matchingCorridors.slice(0, 6).map((c, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setSearchQuery(c.name);
                    handleFlyTo(c.lat, c.lng, `${c.name}, ${c.city}`, 15, c.city);
                  }}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-100 hover:bg-slate-800 hover:text-gold-300 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <MapPin size={13} className="text-gold-400 shrink-0" />
                    <span className="font-semibold">{c.name}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">{c.city}</span>
                </div>
              ))}

              {matchingCorridors.length === 0 && (
                <div className="px-3 py-2 text-slate-400 text-xs italic">
                  No preset corridors matching &quot;{searchQuery}&quot;
                </div>
              )}

              <div
                onClick={() => handleSearchSubmit()}
                className="flex items-center gap-2 px-3 py-2 mt-1 rounded-xl text-gold-400 hover:bg-gold-500/15 cursor-pointer border-t border-white/10 transition-colors font-medium"
              >
                <Navigation size={13} />
                <span>Geocode & Jump to &quot;{searchQuery}&quot; (Live OSM Scan)</span>
              </div>
            </div>
          )}
        </form>

        {/* Quick City Jump Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {CITY_SHORTCUTS.map(city => (
            <button
              key={city.name}
              onClick={() => {
                setSearchQuery(city.name);
                handleFlyTo(city.lat, city.lng, city.name, city.zoom, city.name);
              }}
              className="px-2.5 py-1 rounded-full bg-card/90 hover:bg-muted/90 backdrop-blur-md border border-border/80 text-[11px] font-medium text-foreground whitespace-nowrap shadow-sm transition-all hover:border-gold-500/50"
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>

      {/* TOP-RIGHT: Map Provider & Tile Layer Switcher + Harvest Action */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-wrap items-center gap-2">
        {/* Harvest Category Selector & Harvest Action Button */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-card/95 backdrop-blur-md border border-border/90 shadow-xl">
          <select
            value={selectedHarvestCategory}
            onChange={e => setSelectedHarvestCategory(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-background text-foreground text-xs font-mono font-medium border border-border/70 focus:outline-none cursor-pointer"
            title="Select commercial category to harvest from OpenStreetMap"
          >
            <option value="All">All Commercial POIs</option>
            <option value="Cafes & Dining">Cafes & Dining</option>
            <option value="Malls & Retail">Malls & Retail</option>
            <option value="IT & Gaming">IT & Gaming Lounges</option>
            <option value="Footwear & Leather">Footwear & Crafts</option>
            <option value="Healthcare">Healthcare & Clinics</option>
            <option value="Offices & Commercial">Offices & Coworking</option>
          </select>

          <button
            type="button"
            onClick={handleHarvestClick}
            disabled={isHarvesting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-brand-dark text-xs font-mono font-bold shadow-md transition-all cursor-pointer select-none"
            title="Scrape and harvest real OpenStreetMap commercial establishments into local SQL Database Vault"
          >
            {isHarvesting ? (
              <>
                <Loader2 size={13} className="animate-spin text-brand-dark" />
                <span>Harvesting OSM...</span>
              </>
            ) : harvestSuccess ? (
              <>
                <span>✓ 35 Saved in SQL DB</span>
              </>
            ) : (
              <>
                <span>📡 Harvest Real Shops</span>
              </>
            )}
          </button>
        </div>

        {/* Map Source Tabs: Google Maps vs OpenStreetMap vs Satellite */}
        <div className="flex items-center p-1 rounded-2xl bg-card/95 backdrop-blur-md border border-border/90 shadow-xl text-xs font-mono">
          <div className="px-2 py-1 text-muted-foreground flex items-center gap-1.5 hidden md:flex">
            <Globe size={13} className="text-gold-400" />
            <span>Tiles:</span>
          </div>

          {(['google-maps', 'osm-standard', 'google-satellite'] as TileLayerType[]).map(type => (
            <button
              key={type}
              onClick={() => setActiveTileType(type)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTileType === type
                  ? 'bg-gold-500 text-brand-dark font-bold shadow-md'
                  : 'text-foreground/80 hover:bg-muted/80'
              }`}
            >
              {TILE_CONFIGS[type].label}
            </button>
          ))}
        </div>
      </div>

      {/* BOTTOM-LEFT: Active Location & Provider Attribution Pill */}
      <div className="absolute bottom-4 left-4 z-[1000] flex flex-wrap items-center gap-2 pointer-events-none">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/95 backdrop-blur-md border border-border/90 text-[11px] font-mono text-foreground shadow-lg pointer-events-auto">
          <span
            className={`h-2 w-2 rounded-full ${
              TILE_CONFIGS[activeTileType].provider === 'Google'
                ? 'bg-emerald-400'
                : 'bg-blue-400'
            } animate-pulse`}
          ></span>
          <span className="font-bold text-gold-400">
            {TILE_CONFIGS[activeTileType].provider === 'Google'
              ? 'Google Maps Engine'
              : 'OpenStreetMap Engine'}
          </span>
          {activeLocationLabel && (
            <span className="text-muted-foreground hidden sm:inline">
              • Focused on {activeLocationLabel}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
