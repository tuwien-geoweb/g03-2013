// Base map
var osmLayer = new ol.layer.Tile({source: new ol.source.OSM()});

// Census map layer
var wmsLayer = new ol.layer.Image({
  source: new ol.source.ImageWMS({
    url: '/geoserver/wms',
    params: {'LAYERS': 'g03_2013:g03_2013_bev'}
  }),
  opacity: 0.6
});


// Map object
olMap = new ol.Map({
  target: 'map',
  renderer: ol.RendererHint.CANVAS,
  layers: [osmLayer, wmsLayer],
  view: new ol.View2D({
    center: ol.proj.transform([16.37, 48.21], 'EPSG:4326', 'EPSG:3857'),
    zoom: 12,
    maxZoom: 18
       })
});


function init(){
            map.addControl(new OpenLayers.Control.Navigation());
            map.addControl(new OpenLayers.Control.LayerSwitcher({'div':OpenLayers.Util.getElement('layerswitcher')}));
            
            var jpl_wms = new OpenLayers.Layer.WMS( "Haltestellen",
            http:"//student.ifip.tuwien.ac.at/geoserver/g03_2013/wms?service=WMS&version=1.1.0&request=GetMap&layers=g03_2013:HALTESTELLEWLOGD&styles=&bbox=16.19862001168549,48.122380065848354,16.54939001353065,48.311100066016664&width=613&height=330&srs=EPSG:4326&format=application/openlayers", 
            {layers: "Haltestellen"}, {'isBaseLayer': false});

            var dm_wms = new OpenLayers.Layer.WMS( "DM Solutions Demo",
            "http://www2.dmsolutions.ca/cgi-bin/mswms_gmap",
            {layers: "bathymetry,land_fn,park,drain_fn,drainage," +
                         "prov_bound,fedlimit,rail,road,popplace",
            transparent: "true", format: "image/png" });

            jpl_wms.setVisibility(false);
            dm_wms.setVisibility(false);

            map.addLayers([jpl_wms, dm_wms]);
           
        }
            



//Geolocation
var geolocation = new ol.Geolocation();
geolocation.setTracking(true); // here the browser may ask for confirmation
geolocation.on('change:position', function setPosition() {
  olMap.getView().setCenter(ol.proj.transform(geolocation.getPosition(),"EPSG:4326", "EPSG:3857"));
});


// Add behaviour to dropdown
var topics = document.getElementById('topics');
topics.onchange = function() {
  wmsLayer.getSource().updateParams({
    'viewparams': 'column:' + topics.options[topics.selectedIndex].value
  });
};

// Load variables into dropdown
var xhr = new XMLHttpRequest();
xhr.open("GET", "../data/DataDict.txt");
xhr.onload = function() {
  var lines = xhr.responseText.split('\n');
  // We start at line 3 - line 1 is column names, line 2 is not a variable
  for (var i = 2, ii = lines.length; i < ii; ++i) {
    var option = document.createElement('option');
    option.value = lines[i].substr(0, 10).trim();
    option.innerHTML = lines[i].substr(10, 105).trim();
    topics.appendChild(option);
  }
};
xhr.send();

// Add behaviour to the popup's close button
var popupContainer = document.getElementById('popup');
document.getElementById('popup-closer').onclick = function() {
  popupContainer.style.display = 'none';
  return false;
};

// Create an ol.Overlay with the popup so it is anchored to the map
var popup = new ol.Overlay({
  element: popupContainer
});
olMap.addOverlay(popup);

// Handle map clicks to send a GetFeatureInfo request and open the popup
olMap.on('singleclick', function(evt) {
  olMap.getFeatureInfo({
    pixel: evt.getPixel(),
    success: function (info) {
      var mapCoordinate = evt.getCoordinate();
      popup.setPosition(mapCoordinate);
      document.getElementById('popup-content').innerHTML = info.join('');
      popupContainer.style.display = 'block';
    }
  });
});

// Submit query to Nominatim and zoom map to the result's extent
var form = document.forms[0];
form.onsubmit = function(evt) {
  var url = 'http://nominatim.openstreetmap.org/search?format=json&q=';
  url += form.query.value;
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onload = function() {
    var result = JSON.parse(xhr.responseText);
    if (result.length > 0) {
      var bbox = result[0].boundingbox;
      olMap.getView().fitExtent(ol.proj.transform([parseFloat(bbox[2]),
          parseFloat(bbox[0]), parseFloat(bbox[3]), parseFloat(bbox[1])],
          'EPSG:4326', 'EPSG:3857'), olMap.getSize());
    }
  };
  xhr.send();
  evt.preventDefault();
};




