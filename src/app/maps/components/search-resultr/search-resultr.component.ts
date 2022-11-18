import { Component } from '@angular/core';
import { Feature } from '../../interfaces/places';
import { MapService, PlacesService } from '../../services';

@Component({
  selector: 'app-search-resultr',
  templateUrl: './search-resultr.component.html',
  styleUrls: ['./search-resultr.component.css']
})
export class SearchResultrComponent {

  public selectedId: string = '';

  constructor( private placesService: PlacesService, 
                private mapService: MapService)  { }

  get isLoadingPlaces(): boolean {
    return this.placesService.isLoadingPlaces
  }

  get places(): Feature[] {
    return this.placesService.places
  }

  flyTo( place: Feature ) {
    this.selectedId = place.id;
    const [ lng, lat ] = place.center;
    this.mapService.flyTo( [lng, lat] );
  }

  getDirections( place:Feature ) {
    if( !this.placesService.useLocation ) throw Error("No hay userLocation");
    
    this.placesService.deletePlaces();

    const start = this.placesService.useLocation;
    const end = place.center as [number,number]; // Con el as le digo que lo trate como si fuera [number,number]
    
    this.mapService.getRouteBetweenPoints( start, end );
  }

}
