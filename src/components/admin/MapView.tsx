import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { PointOfInterest, ComercioWithLocation } from '@/hooks/useMapData';

interface MapViewProps {
  pointsOfInterest: PointOfInterest[];
  comercios: ComercioWithLocation[];
  onComercioLocationUpdate: (id: string, latitude: number, longitude: number) => void;
  selectedComercio?: string;
}

// Coordenadas do loteamento Cidade Inteligente
const CIDADE_INTELIGENTE_CENTER: [number, number] = [-48.2982, -15.8267]; // Aproximação baseada no link
const CIDADE_INTELIGENTE_ZOOM = 14;

export function MapView({ 
  pointsOfInterest, 
  comercios, 
  onComercioLocationUpdate, 
  selectedComercio 
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});

  // Configurar token do Mapbox
  useEffect(() => {
    // IMPORTANTE: Para que o mapa funcione, você precisa configurar um token válido do Mapbox
    // Visite https://mapbox.com/ e crie uma conta para obter seu token público
    // Por enquanto, deixamos em branco para evitar erros
    mapboxgl.accessToken = 'pk.eyJ1Ijoid2lsbGJpbyIsImEiOiJjbWR1Z2lvNmMwM2x4MnFwcnM4dmprMjUyIn0.9K8joxkaeNBYtunymoH86w';
  }, []);

  // Inicializar mapa
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Verificar se o token do Mapbox está configurado
    if (!mapboxgl.accessToken) {
      console.warn('Token do Mapbox não configurado');
      return;
    }

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: CIDADE_INTELIGENTE_CENTER,
      zoom: CIDADE_INTELIGENTE_ZOOM,
      maxZoom: 22,
      minZoom: 1
    });

    // Adicionar controles de navegação
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    // Adicionar controle de geolocalização
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      }),
      'top-right'
    );
    
    // Adicionar controle de busca de endereço
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      placeholder: 'Buscar localização...',
      countries: 'br',
      language: 'pt'
    });
    map.current.addControl(geocoder, 'top-left');
    
    // Adicionar controle de mudança de estilo de mapa
    const styleSelector = document.createElement('div');
    styleSelector.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
    styleSelector.innerHTML = `
      <button type="button" class="mapboxgl-ctrl-icon" title="Alterar estilo do mapa">
        🗺️
      </button>
    `;
    
    const mapStyles = [
      { name: 'Satélite', style: 'mapbox://styles/mapbox/satellite-streets-v12' },
      { name: 'Ruas', style: 'mapbox://styles/mapbox/streets-v12' },
      { name: 'Terreno', style: 'mapbox://styles/mapbox/outdoors-v12' },
      { name: 'Escuro', style: 'mapbox://styles/mapbox/dark-v11' }
    ];
    
    let currentStyleIndex = 0;
    styleSelector.addEventListener('click', () => {
      currentStyleIndex = (currentStyleIndex + 1) % mapStyles.length;
      map.current?.setStyle(mapStyles[currentStyleIndex].style);
    });
    
    map.current.addControl({
      onAdd: () => styleSelector,
      onRemove: () => {}
    } as any, 'bottom-right');

    map.current.on('load', () => {
      setIsMapReady(true);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Adicionar marcadores dos pontos de interesse
  useEffect(() => {
    if (!isMapReady || !map.current) return;

    // Limpar marcadores dos pontos de interesse existentes
    Object.keys(markersRef.current).forEach(key => {
      if (key.startsWith('poi-')) {
        markersRef.current[key].remove();
        delete markersRef.current[key];
      }
    });

    // Adicionar marcadores dos pontos de interesse
    pointsOfInterest.forEach(poi => {
      if (poi.latitude && poi.longitude) {
        const el = document.createElement('div');
        el.className = 'w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg cursor-pointer';
        el.title = poi.name;

        const marker = new mapboxgl.Marker(el)
          .setLngLat([poi.longitude, poi.latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(`
                <div class="p-2">
                  <h3 class="font-semibold">${poi.name}</h3>
                  <p class="text-sm text-gray-600">${poi.category}</p>
                  ${poi.phone ? `<p class="text-sm">${poi.phone}</p>` : ''}
                  ${poi.operating_hours ? `<p class="text-sm">${poi.operating_hours}</p>` : ''}
                </div>
              `)
          )
          .addTo(map.current!);

        markersRef.current[`poi-${poi.id}`] = marker;
      }
    });
  }, [pointsOfInterest, isMapReady]);

  // Adicionar marcadores dos comércios
  useEffect(() => {
    if (!isMapReady || !map.current) return;

    // Limpar marcadores dos comércios existentes
    Object.keys(markersRef.current).forEach(key => {
      if (key.startsWith('comercio-')) {
        markersRef.current[key].remove();
        delete markersRef.current[key];
      }
    });

    // Adicionar marcadores dos comércios
    comercios.forEach(comercio => {
      if (comercio.latitude && comercio.longitude) {
        const el = document.createElement('div');
        el.className = `w-8 h-8 bg-green-500 rounded-full border-2 border-white shadow-lg cursor-pointer ${
          selectedComercio === comercio.id ? 'ring-4 ring-green-300' : ''
        }`;
        el.innerHTML = '🏪';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'center';
        el.style.fontSize = '16px';
        el.title = comercio.nome;

        const marker = new mapboxgl.Marker(el, { draggable: true })
          .setLngLat([comercio.longitude, comercio.latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(`
                <div class="p-2">
                  <h3 class="font-semibold">${comercio.nome}</h3>
                  <p class="text-sm text-gray-600">${comercio.categoria || 'Sem categoria'}</p>
                  ${comercio.descricao ? `<p class="text-sm">${comercio.descricao}</p>` : ''}
                </div>
              `)
          )
          .addTo(map.current!);

        // Event listener para arrastar
        marker.on('dragend', () => {
          const lngLat = marker.getLngLat();
          onComercioLocationUpdate(comercio.id, lngLat.lat, lngLat.lng);
        });

        markersRef.current[`comercio-${comercio.id}`] = marker;
      }
    });
  }, [comercios, isMapReady, selectedComercio, onComercioLocationUpdate]);

  // Focagem no comércio selecionado
  useEffect(() => {
    if (selectedComercio && map.current) {
      const comercio = comercios.find(c => c.id === selectedComercio);
      if (comercio && comercio.latitude && comercio.longitude) {
        map.current.flyTo({
          center: [comercio.longitude, comercio.latitude],
          zoom: 18,
          duration: 1000
        });
      }
    }
  }, [selectedComercio, comercios]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainer} className="h-full w-full rounded-lg" />
      
      {/* Loading overlay ou mensagem de configuração */}
      {!isMapReady && !mapboxgl.accessToken && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded-lg">
          <div className="text-center max-w-md p-6">
            <div className="text-6xl mb-4">🗺️</div>
            <h3 className="text-lg font-semibold mb-2">Configuração do Mapa</h3>
            <p className="text-sm text-gray-600 mb-4">
              Para utilizar o mapa, é necessário configurar um token do Mapbox.
            </p>
            <div className="bg-blue-50 p-3 rounded-lg text-left">
              <p className="text-xs text-blue-800 mb-2"><strong>Como configurar:</strong></p>
              <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
                <li>Acesse <a href="https://mapbox.com/" target="_blank" className="underline">mapbox.com</a></li>
                <li>Crie uma conta gratuita</li>
                <li>Obtenha seu token público</li>
                <li>Configure no código do mapa</li>
              </ol>
            </div>
          </div>
        </div>
      )}
      
      {!isMapReady && mapboxgl.accessToken && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Carregando mapa...</p>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 max-w-xs">
        <h4 className="font-semibold text-sm mb-2">Legenda</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full border border-white"></div>
            <span>Pontos de Interesse</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full border border-white flex items-center justify-center text-xs">🏪</div>
            <span>Comércios (arrastáveis)</span>
          </div>
        </div>
      </div>
    </div>
  );
}