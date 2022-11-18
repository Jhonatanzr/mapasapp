import { Injectable } from '@angular/core';
import { AnySourceData, LngLatBounds, LngLatLike, Map, Marker, Popup } from 'mapbox-gl';
import { DirectionsApiClient } from '../api';
import { DirectionsResponse, Route } from '../interfaces/directions';
import { Feature } from '../interfaces/places';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private map?: Map;
  private markers: Marker[] = [];

  get isMapReady() {
    return !!this.map;
  }

  constructor( private directionsApi: DirectionsApiClient ) {}

  setMap( map: Map ) {
    this.map = map;
  }

  flyTo( coords: LngLatLike ) {
    if ( !this.isMapReady ) throw new Error("El mapa no esta inicializado");

    this.map?.flyTo({
      zoom: 14,
      center: coords
    });
    
  }

  createMarkersFromPlaces( places: Feature[], userLocation: [number,number] ) {
    if ( !this.map ) throw new Error("Mapa no inicializado");
    this.markers.forEach( marker => marker.remove() ); //Eliminamos cada marcador del mapa
    const newMarkers = [];

    for (const place of places) {
      const [ lng, lat ] = place.center;
      const popup = new Popup()
        .setHTML(`
          <h6>${ place.text }</h6>
          <span>${ place.place_name }</span>
        `);
      const newMarker = new Marker()
        .setLngLat( [lng,lat] )
        .setPopup( popup )
        .addTo( this.map );
      newMarkers.push( newMarker );
    }

    this.markers = newMarkers;

    if ( places.length === 0 ) return;

    //limites del mapa

    const bounds = new LngLatBounds();
    newMarkers.forEach( marker => bounds.extend( marker.getLngLat() )); //Añadimos los lnglat a bounds
    // esparecido a un push pero el extend es propio de la clase LngLatBounds
    bounds.extend( userLocation );//Esto para que en el limite tambien quede mi ubicacion
    this.map.fitBounds( bounds, {
      padding: 200
    });

  }

  getRouteBetweenPoints( start: [number,number], end: [number,number] ) {//Obtenemos la distancia entre las coordenadas

    this.directionsApi.get<DirectionsResponse>(`/${ start.join(',') };${ end.join(',') }`)
      .subscribe( resp =>  this.drawPolyline( resp.routes[0] ) );

  }

  private drawPolyline( route: Route ) {
    console.log( {kms: route.distance / 1000, duration: route.duration / 60} );

    if( !this.map ) throw Error("Mapa no inicializado");

    const coords = route.geometry.coordinates;

    const bounds = new LngLatBounds(); // Llenamos las coordenadas al bounds, este permite que el mapa se ajuste a las rutas entre los dos puntos
    coords.forEach( ([ lng, lat ]) => {
      bounds.extend( [ lng, lat ] );
    });

    this.map?.fitBounds( bounds, {// Cargamos los bounds al mapa
      padding: 200
    });

    //Polyline
    const sourceData: AnySourceData = {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coords
            }
          }
        ]
      }
    }

    //Todo: Limpiar ruta previa esto para que cada vez que se busquen rutas se limpie la anterior
    if ( this.map.getLayer('RouteString') ) {
      this.map.removeLayer( 'RouteString' );
      this.map.removeSource( 'RouteString' );
    }

    this.map.addSource( 'RouteString',sourceData ); //Añadimos la polyline al mapa, el RouteString se puede cambiar por un nombre que queramos

    this.map.addLayer({
      id: 'RouteString',//Este es el id del layer, puede ser diferente al del map.addSource
      type: 'line',
      source: 'RouteString',//Este es el del source, debe coincidir con el id del map.addSource
      layout: {
        'line-cap': 'round',
        'line-join': 'round'
      },
      paint: {
        'line-color': 'black',//Color de la linea
        'line-width': 3 //Ancho de la linea
      }
    });

  }

  deletePolyline() {
    if( !this.map ) throw Error("Mapa no inicializado");
    
    if ( this.map.getLayer('RouteString') ) {
      this.map.removeLayer( 'RouteString' );
      this.map.removeSource( 'RouteString' );
    }
  }

}
