import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { PointOfInterest, ComercioWithLocation } from '@/hooks/useMapData';

// Tipo para o item selecionado, para sabermos o tipo e o ID
type SelectedItem = { id: string; type: 'comercio' | 'poi' };

interface MapViewProps {
  pointsOfInterest: PointOfInterest[];
  comercios: ComercioWithLocation[];
  onComercioLocationUpdate: (id: string, latitude: number, longitude: number) => void;
  onPoiLocationUpdate: (id: string, latitude: number, longitude: number) => void;
  selectedItem?: SelectedItem | null;
}

const CIDADE_INTELIGENTE_CENTER: [number, number] = [-48.318956, -15.944808];
const CIDADE_INTELIGENTE_ZOOM = 14;

export function MapView({ 
  pointsOfInterest, 
  comercios, 
  onComercioLocationUpdate, 
  onPoiLocationUpdate,
  selectedItem 
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1Ijoid2lsbGJpbyIsImEiOiJjbWR1Z2lvNmMwM2x4MnFwcnM4dmprMjUyIn0.9K8joxkaeNBYtunymoH86w';
  }, []);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: CIDADE_INTELIGENTE_CENTER,
      zoom: CIDADE_INTELIGENTE_ZOOM,
    });
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(new MapboxGeocoder({ accessToken: mapboxgl.accessToken, mapboxgl: mapboxgl as any, placeholder: 'Buscar...' }), 'top-left');
    map.current.on('load', () => setIsMapReady(true));

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Efeito para Pontos de Interesse (agora arrastáveis e selecionáveis)
  useEffect(() => {
    if (!isMapReady || !map.current) return;
    pointsOfInterest.forEach(poi => {
      const markerId = `poi-${poi.id}`;
      if (markersRef.current[markerId]) markersRef.current[markerId].remove();
      
      if (poi.latitude && poi.longitude) {
        const isSelected = selectedItem?.type === 'poi' && selectedItem.id === poi.id;
        const el = document.createElement('div');
        el.className = `w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg cursor-grab transition-all ${isSelected ? 'ring-4 ring-blue-300 scale-125' : ''}`;
        
        const marker = new mapboxgl.Marker(el, { draggable: true })
          .setLngLat([poi.longitude, poi.latitude])
          .addTo(map.current!);
        
        marker.on('dragend', () => onPoiLocationUpdate(poi.id, marker.getLngLat().lat, marker.getLngLat().lng));
        markersRef.current[markerId] = marker;
      }
    });
  }, [pointsOfInterest, isMapReady, selectedItem, onPoiLocationUpdate]);

  // Efeito para Comércios (lógica de seleção atualizada)
  useEffect(() => {
    if (!isMapReady || !map.current) return;
    comercios.forEach(comercio => {
      const markerId = `comercio-${comercio.id}`;
      if (markersRef.current[markerId]) markersRef.current[markerId].remove();
      
      if (comercio.latitude && comercio.longitude) {
        const isSelected = selectedItem?.type === 'comercio' && selectedItem.id === comercio.id;
        const el = document.createElement('div');
        el.className = `w-8 h-8 bg-green-500 rounded-full border-2 border-white shadow-lg cursor-grab flex items-center justify-center text-xl transition-all ${isSelected ? 'ring-4 ring-green-300 scale-125' : ''}`;
        el.innerHTML = '🏪';
        
        const marker = new mapboxgl.Marker(el, { draggable: true })
          .setLngLat([comercio.longitude, comercio.latitude])
          .addTo(map.current!);
        
        marker.on('dragend', () => onComercioLocationUpdate(comercio.id, marker.getLngLat().lat, marker.getLngLat().lng));
        markersRef.current[markerId] = marker;
      }
    });
  }, [comercios, isMapReady, selectedItem, onComercioLocationUpdate]);

  // Efeito de Foco no item selecionado (agora genérico)
  useEffect(() => {
    if (selectedItem && map.current) {
      const itemSource = selectedItem.type === 'comercio' ? comercios : pointsOfInterest;
      const item = itemSource.find(i => i.id === selectedItem.id);
      if (item?.latitude && item.longitude) {
        map.current.flyTo({ center: [item.longitude, item.latitude], zoom: 18, duration: 1200, essential: true });
      }
    }
  }, [selectedItem, comercios, pointsOfInterest]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainer} className="h-full w-full rounded-lg" />
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 max-w-xs">
        <h4 className="font-semibold text-sm mb-2">Legenda</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-blue-500 rounded-full border border-white"></div><span>Pontos de Interesse</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-500 rounded-full border border-white flex items-center justify-center text-xs">🏪</div><span>Comércios</span></div>
        </div>
      </div>
    </div>
  );
}
