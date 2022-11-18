import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import Mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"

Mapboxgl.accessToken = 'pk.eyJ1Ijoid29sZjQyMTEiLCJhIjoiY2w4dzZ4NWMzMDNpYzQzbGc1YnQ0aHNtZyJ9.6fwPNxgJGy5s-IZyyDCJKg';

if ( !navigator.geolocation ) {
  alert('El navegador no soporta geolocation');
  throw new Error('El navegador no soporta geolocation');
}

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
