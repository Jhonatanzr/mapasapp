import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PlacesApiClient } from '../api';
import { Feature, PlacesResponse } from '../interfaces/places';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  public useLocation: [number,number] | undefined;
  //La linea de arriba seria exactamente lo mismo a:
  // useLocation?: [number,number];
  public isLoadingPlaces: boolean = false;
  public places: Feature[] = [];

  get isUserLocationReady(): boolean {
    return !!this.useLocation; //El doble signo de admiracion sirve para castear la variable a boolean
    //si la variable tiene datos o es true retorna true, si no retorna un false.
  }

  constructor( 
    private placesApi: PlacesApiClient,
    private mapService: MapService
    ) { 
    this.getUserLocation();
  }

  async getUserLocation(): Promise<[number, number]> {

    return new Promise( ( resolve, reject ) => {

      navigator.geolocation.getCurrentPosition(
        ( { coords } ) => {
          this.useLocation = [ coords.longitude, coords.latitude ];
          resolve( this.useLocation );
        },
        ( err ) => {
          alert('No se pudo obtener la geolocalización');
          console.log( err );
          reject();
        }
      );

    });

  }

  getPlacesByQuery( query: string = '' ) {
    // console.log(query);
    if ( !this.useLocation ) throw new Error("No hay userLocation");

    if( query.length === 0 ) {
      this.places = [];
      this.isLoadingPlaces = false;
      this.mapService.createMarkersFromPlaces( this.places, this.useLocation );//limpio los marcadores
      this.mapService.deletePolyline();
      return;
    }

    // if ( !this.useLocation ) throw new Error("No hay userLocation");
    
    this.isLoadingPlaces = true;
    this.placesApi.get<PlacesResponse>(`/${ query }.json`, {
      params: {
        proximity: this.useLocation.join(',') //Como es un array con el join los unimos con una ,
      }
    })
      .subscribe( resp => {
        // console.log( resp.features );
        this.isLoadingPlaces = false;
        this.places = resp.features;
        this.mapService.createMarkersFromPlaces( this.places, this.useLocation! );
      });    
  }

  deletePlaces() {
    this.places = [];
  }

}
