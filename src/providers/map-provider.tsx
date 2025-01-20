//Since the map will be laoded and displayed on client side
'use client';

// Import necessary modules and functions from external libraries and our own project
import { Libraries, useJsApiLoader } from '@react-google-maps/api';
import { createContext, ReactNode, useContext } from 'react';

// Define a list of libraries to load from the Google Maps API
const libraries = ['places', 'drawing', 'geometry'];
const MapContext = createContext<{ isLoaded: boolean; loadError: Error | undefined } | undefined>(undefined);

// Define a function component called MapProvider that takes a children prop
export function MapProvider({ children }: { children: ReactNode }) {

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API as string,
    libraries: libraries as Libraries,
  });

  if(loadError) return <p>Encountered error while loading google maps</p>

  if(!isLoaded) return <p>Map Script is loading ...</p>

  return (
    <MapContext.Provider value={{ isLoaded, loadError }}>
    {children}
    </MapContext.Provider>
  )
}

export const useMapContext = () => {
  const context = useContext(MapContext);
  if (!context) {
      throw new Error('useMapContext must be used within a MapProvider');
  }
  return context;
};