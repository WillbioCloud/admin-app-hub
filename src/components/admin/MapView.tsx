import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { PointOfInterest, ComercioWithLocation } from '@/hooks/useMapData';
import { ImageUploadDialog } from './ImageUploadDialog';

interface MapViewProps {
  pointsOfInterest: PointOfInterest[];
  comercios: ComercioWithLocation[];
  onComercioLocationUpdate: (id: string, latitude: number, longitude: number) => void;
  onPOIImageUpdate: (id: string, imageUrl: string) => void;
  onComercioImageUpdate: (id: string, imageUrl: string) => void;
  selectedComercio?: string;
}

// Coordenadas do loteamento Cidade Inteligente
const CIDADE_INTELIGENTE_CENTER: [number, number] = [-48.318956, -15.944808]; // Aproximação baseada no link
const CIDADE_INTELIGENTE_ZOOM = 14;

export function MapView({ 
  pointsOfInterest, 
  comercios, 
  onComercioLocationUpdate,
  onPOIImageUpdate,
  onComercioImageUpdate,
  selectedComercio 
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const [uploadDialog, setUploadDialog] = useState<{
    open: boolean;
    entityId: string;
    entityType: 'comercio' | 'poi';
    title: string;
  }>({
    open: false,
    entityId: '',
    entityType: 'poi',
    title: ''
  });

  // Configurar token do Mapbox
  useEffect(() => {
    // IMPORTANTE: Para que o mapa funcione, você precisa configurar um token válido do Mapbox
    // Visite https://mapbox.com/ e crie uma conta para obter seu token público
    // Por enquanto, deixamos em branco para evitar erros
    mapboxgl.accessToken = 'pk.eyJ1Ijoid2lsbGJpbyIsImEiOiJjbWR1Z2lvNmMwM2x4MnFwcnM4dmprMjUyIn0.9K8joxkaeNBYtunymoH86w';
    
    // Adicionar função global para editar localização
    (window as any).editLocation = (comercioId: string) => {
      console.log('Editando localização do comércio:', comercioId);
      // A edição é feita arrastando o marcador
    };

    // Adicionar função global para upload de imagem dos POIs
    (window as any).uploadPOIImage = (poiId: string, poiName: string) => {
      setUploadDialog({
        open: true,
        entityId: poiId,
        entityType: 'poi',
        title: `Atualizar imagem - ${poiName}`
      });
    };

    // Adicionar função global para upload de imagem dos comércios
    (window as any).uploadComercioImage = (comercioId: string, comercioName: string) => {
      setUploadDialog({
        open: true,
        entityId: comercioId,
        entityType: 'comercio',
        title: `Atualizar imagem - ${comercioName}`
      });
    };
  }, []);

  // Inicializar mapa
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Verificar se o token do Mapbox está configurado
    if (!mapboxgl.accessToken) {
      console.warn('Token do Mapbox não configurado');
      return;
    }

    // Adicionar estilos customizados para popups
    const style = document.createElement('style');
    style.textContent = `
      .mapboxgl-popup-content {
        padding: 0 !important;
        border-radius: 8px !important;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
      }
      .mapboxgl-popup-close-button {
        font-size: 20px !important;
        padding: 8px !important;
        color: #6b7280 !important;
      }
      .mapboxgl-popup-close-button:hover {
        background: rgba(0, 0, 0, 0.05) !important;
        color: #374151 !important;
      }
      .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    `;
    document.head.appendChild(style);

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

        const popup = new mapboxgl.Popup({ 
          offset: 25,
          className: 'custom-popup'
        }).setHTML(`
          <div class="bg-white rounded-lg shadow-lg overflow-hidden min-w-[280px]">
            ${poi.image_url ? `
              <div class="h-32 bg-cover bg-center" style="background-image: url('${poi.image_url}')"></div>
            ` : `
              <div class="h-32 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <span class="text-white text-2xl">${poi.category === 'Lazer' ? '🎯' : poi.category === 'Esportes' ? '⚽' : poi.category === 'Saúde' ? '🏥' : poi.category === 'Educação' ? '🎓' : poi.category === 'Segurança' ? '🛡️' : '📍'}</span>
              </div>
            `}
            <div class="p-4">
              <h3 class="font-bold text-lg text-gray-900 mb-1">${poi.name}</h3>
              <p class="text-sm text-blue-600 font-medium mb-2">${poi.category}</p>
              ${poi.phone ? `
                <div class="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <span>📞</span>
                  <span>${poi.phone}</span>
                </div>
              ` : ''}
              ${poi.operating_hours ? `
                <div class="flex items-center gap-2 text-sm text-gray-600">
                  <span>🕒</span>
                  <span>${poi.operating_hours}</span>
                </div>
              ` : ''}
              </div>
              <div class="p-3 border-t border-gray-100">
                <button 
                  onclick="window.uploadPOIImage('${poi.id}', '${poi.name.replace(/'/g, "\\'")}')"
                  class="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-medium py-2 px-3 rounded-lg transition-colors duration-200"
                >
                  📷 Atualizar Imagem
                </button>
              </div>
            </div>
          </div>
        `);

        const marker = new mapboxgl.Marker(el)
          .setLngLat([poi.longitude, poi.latitude])
          .setPopup(popup)
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

        const popup = new mapboxgl.Popup({ 
          offset: 25,
          className: 'custom-popup'
        }).setHTML(`
          <div class="bg-white rounded-lg shadow-lg overflow-hidden min-w-[320px]">
            ${comercio.image_url || comercio.capa_url ? `
              <div class="h-36 bg-cover bg-center" style="background-image: url('${comercio.image_url || comercio.capa_url}')"></div>
            ` : `
              <div class="h-36 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <span class="text-white text-3xl">🏪</span>
              </div>
            `}
            <div class="p-4">
              <div class="flex items-start justify-between mb-2">
                <div>
                  <h3 class="font-bold text-lg text-gray-900 mb-1">${comercio.nome}</h3>
                  <span class="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    ${comercio.categoria || 'Comércio'}
                  </span>
                </div>
                ${comercio.logo_url ? `
                  <img src="${comercio.logo_url}" alt="Logo" class="w-12 h-12 rounded-lg object-cover border-2 border-white shadow-sm">
                ` : ''}
              </div>
              ${comercio.descricao ? `
                <p class="text-sm text-gray-600 mb-3 line-clamp-2">${comercio.descricao}</p>
              ` : ''}
              <div class="space-y-2">
                ${comercio.whatsapp ? `
                  <div class="flex items-center gap-2 text-sm">
                    <span class="text-green-600">📱</span>
                    <a href="https://wa.me/${comercio.whatsapp.replace(/\D/g, '')}" target="_blank" class="text-green-600 hover:underline font-medium">
                      WhatsApp
                    </a>
                  </div>
                ` : ''}
                ${comercio.instagram ? `
                  <div class="flex items-center gap-2 text-sm">
                    <span class="text-pink-600">📷</span>
                    <a href="https://instagram.com/${comercio.instagram.replace('@', '')}" target="_blank" class="text-pink-600 hover:underline font-medium">
                      ${comercio.instagram}
                    </a>
                  </div>
                ` : ''}
                ${comercio.horario_func?.display_text ? `
                  <div class="flex items-center gap-2 text-sm text-gray-600">
                    <span>🕒</span>
                    <span>${comercio.horario_func.display_text}</span>
                  </div>
                ` : ''}
              </div>
              <div class="mt-3 pt-3 border-t border-gray-100 space-y-2">
                <button 
                  onclick="window.editLocation('${comercio.id}')"
                  class="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-medium py-2 px-3 rounded-lg transition-colors duration-200"
                >
                  📍 Editar Localização (Arraste o marcador)
                </button>
                <button 
                  onclick="window.uploadComercioImage('${comercio.id}', '${comercio.nome.replace(/'/g, "\\'")}')"
                  class="w-full bg-green-50 hover:bg-green-100 text-green-600 text-sm font-medium py-2 px-3 rounded-lg transition-colors duration-200"
                >
                  📷 Atualizar Imagem
                </button>
              </div>
            </div>
          </div>
        `);

        const marker = new mapboxgl.Marker(el, { draggable: true })
          .setLngLat([comercio.longitude, comercio.latitude])
          .setPopup(popup)
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
        <div className="mt-2 pt-2 border-t text-xs text-gray-500">
          💡 Dica: Arraste os marcadores verdes para reposicionar comércios
        </div>
      </div>

      {/* Image Upload Dialog */}
      <ImageUploadDialog
        open={uploadDialog.open}
        onOpenChange={(open) => setUploadDialog(prev => ({ ...prev, open }))}
        title={uploadDialog.title}
        entityId={uploadDialog.entityId}
        entityType={uploadDialog.entityType}
        onImageUploaded={(imageUrl) => {
          if (uploadDialog.entityType === 'poi') {
            onPOIImageUpdate(uploadDialog.entityId, imageUrl);
          } else {
            onComercioImageUpdate(uploadDialog.entityId, imageUrl);
          }
        }}
      />

    </div>
  );
}