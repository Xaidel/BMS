// src/pages/BarangayMap.tsx
import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function BarangayMapPage() {
  useEffect(() => {
    const map = L.map('map', {
      minZoom: 0,
      maxZoom: 2, // limit zoom to match your 5-tile setup
      center: [0, 0],
      zoom: 0,
      crs: L.CRS.Simple,
    });

    // Updated image dimensions from tilemapresource.xml BoundingBox values
    const imageWidth = 5120;  // width from BoundingBox maxx - minx
    const imageHeight = 3840; // height from BoundingBox maxy - miny

    const southWest = map.unproject([0, imageHeight], map.getMaxZoom());
    const northEast = map.unproject([imageWidth, 0], map.getMaxZoom());
    const bounds = new L.LatLngBounds(southWest, northEast);

    // Use a single image overlay instead of tiles
    L.imageOverlay('/images/barangay-map.jpeg', bounds).addTo(map);

    map.fitBounds(bounds);

    // Restrict panning and zooming to the image bounds
    map.setMaxBounds(bounds);

    // Example markers array with pixel coordinates and popup text
    const exampleMarkers = [
      { x: 1000, y: 800, popup: "Household H001" },
      { x: 2000, y: 1500, popup: "Household H002" },
      { x: 3000, y: 1200, popup: "Household H003" },
    ];

    // Add example markers to the map
    exampleMarkers.forEach(({ x, y, popup }) => {
      const coords = map.unproject([x, y], map.getMaxZoom());
      L.marker(coords).addTo(map).bindPopup(popup);
    });

    // Add click-to-add marker functionality
    map.on('click', (e) => {
      L.marker(e.latlng).addTo(map).bindPopup("New Marker").openPopup();
    });

    return () => {
      map.remove();
    };
  }, []);

  return <div id="map" style={{ width: '100%', height: '100vh' }} />;
}