import { useState, useEffect } from 'react';
import { PropertyCard } from './PropertyCard';
import { PropertyFilters } from './PropertyFilters';
import { TourModal } from './TourModal';
import { propertiesService } from './properties.service';
import type { CommercialProperty } from '@/types/schema';

export function PropertiesPage() {
  const [properties, setProperties] = useState<CommercialProperty[]>([]);
  const [city, setCity] = useState('All');
  const [type, setType] = useState('All');
  const [selectedProperty, setSelectedProperty] = useState<CommercialProperty | null>(null);

  useEffect(() => {
    propertiesService.getProperties({ city, type }).then(setProperties);
  }, [city, type]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
          Commercial Properties
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Explore prime high-street shops, food kiosks, and commercial floors with normalized footfall scoring.
        </p>
      </div>

      <PropertyFilters
        city={city}
        onCityChange={setCity}
        type={type}
        onTypeChange={setType}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        {properties.map(property => (
          <PropertyCard
            key={property.id}
            property={property}
            onBookTour={setSelectedProperty}
          />
        ))}
      </div>

      <TourModal
        property={selectedProperty}
        isOpen={Boolean(selectedProperty)}
        onClose={() => setSelectedProperty(null)}
      />
    </div>
  );
}

