
var isMapInitialized = false;

var setupMiniMap = function( lat, lon ) {

  if ( isMapInitialized ) {
    console.log( 'map already initiatlized' );
    return;
  }

  isMapInitialized = true;

  console.log( 'setupMiniMap' );

  if ( !lat || !lon ) {
    return;
  }

  var newLat;
  var newLng;
  var map;

  var layer = L.tileLayer( "https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiamVkZGF3c29uIiwiYSI6ImMxYjczZWRkNzFkNWU3YzhmMTAyNzdjMjBlYThiODk2In0.HsgA69IWdvwYJyaCT7TUUg" );

  var map = L.map('interactive_map', {
    zoomControl: false,
    attributionControl: false,
    minZoom: 18
  }).addLayer( layer );

  map.setView( [lat, lon], 18 );

  var markerOld = L.marker( map.getCenter() ).addTo( map );
  markerOld.setOpacity( 0.3 );

  var markerNew = L.marker( map.getCenter() ).addTo( map );

  map.on( 'move', function(){
    markerNew.setLatLng( map.getCenter() );
  } );

  map.on( 'moveend', function() {

    newLat = markerNew.getLatLng().lat;
    newLng = markerNew.getLatLng().lng;

    _wastemate['viewModel'].userLatLon({
      lat: newLat,
      lon: newLng
    });

    console.log( _wastemate['viewModel'].userLatLon() );

  } );

};