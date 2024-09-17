import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export const MapboxMap = ({ itineraries }: { itineraries: any[] }) => {
  //   const mapContainerRef = useRef<HTMLDivElement>(null);
  //   const mapRef = useRef<mapboxgl.Map | null>(null);
  //   useEffect(() => {
  //     if (mapContainerRef.current && itineraries.length > 0) {
  //       mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';
  //       mapRef.current = new mapboxgl.Map({
  //         container: mapContainerRef.current,
  //         style: 'mapbox://styles/mapbox/streets-v11',
  //         center: [0, 0], // Initial center
  //         zoom: 2, // Initial zoom
  //       });
  //       const bounds = new mapboxgl.LngLatBounds();
  //       itineraries.forEach((day) => {
  //         day.destinations.forEach((destination: any) => {
  //           const { Longitude, Latitude, DestinationName, OrderNumber } = destination;
  //           // Create a custom marker element
  //           const markerElement = document.createElement('div');
  //           markerElement.className = 'marker';
  //           markerElement.style.backgroundImage = 'url(/path/to/pin-icon.png)'; // Custom pin image
  //           markerElement.style.width = '30px';
  //           markerElement.style.height = '30px';
  //           markerElement.style.backgroundSize = 'cover';
  //           markerElement.style.cursor = 'pointer';
  //           new mapboxgl.Marker(markerElement)
  //             .setLngLat([parseFloat(Longitude), parseFloat(Latitude)])
  //             .setPopup(
  //               new mapboxgl.Popup({ offset: 25 })
  //                 .setHTML(`<strong>Day ${day.DayNumber}</strong><br>${DestinationName}`)
  //             )
  //             .addTo(mapRef.current);
  //           bounds.extend([parseFloat(Longitude), parseFloat(Latitude)]);
  //         });
  //       });
  //       mapRef.current.fitBounds(bounds, { padding: 50 });
  //     }
  //   }, [itineraries]);
  //   return <div ref={mapContainerRef} style={{ width: '100%', height: '100vh' }} />;
};
