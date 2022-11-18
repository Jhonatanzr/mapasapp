import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapsScreenComponent } from './screens/maps-screen/maps-screen.component';
import { LoadingComponent } from './components/loading/loading.component';
import { MapViewComponent } from './components/map-view/map-view.component';
import { BtnMyLocationComponent } from './components/btn-my-location/btn-my-location.component';
import { AngularLogoComponent } from './components/angular-logo/angular-logo.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { SearchResultrComponent } from './components/search-resultr/search-resultr.component';



@NgModule({
  declarations: [
    MapsScreenComponent,
    LoadingComponent,
    MapViewComponent,
    BtnMyLocationComponent,
    AngularLogoComponent,
    SearchBarComponent,
    SearchResultrComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MapsScreenComponent
  ]
})
export class MapsModule { }
