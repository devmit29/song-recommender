import { MapComponent } from '@/components/map';
import { MapProvider } from '@/providers/map-provider';
import React from 'react';

function Search() {
  return (
    <MapProvider>
      <MapComponent/>
    </MapProvider>
  );
}

export default Search;
