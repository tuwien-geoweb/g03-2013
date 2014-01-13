// Base map
var osmLayer = new ol.layer.Tile({source: new ol.source.OSM()});

// Census map layer
var wmsLayer = new ol.layer.Image({
  source: new ol.source.ImageWMS({
    url: '/geoserver/wms',
    params: {'LAYERS': 'Anteile'}
  }),
  opacity: 0.6
});

var cityBikeLayer = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: 'http://student.ifip.tuwien.ac.at/geoserver/g03_2013/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=g03_2013:CITYBIKEOGD&outputFormat=json',
    parser: new ol.parser.GeoJSON()
  }),
            style: new ol.style.Style({
                     symbolizers: [
               new ol.style.Icon({
			url: '../../images/Citybike.png',
		       })
                  ]
            })
  });

var fahrradabstell = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: 'http://student.ifip.tuwien.ac.at/geoserver/g03_2013/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=g03_2013:FAHRRADABSTELLANLAGEOGD&outputFormat=json',
    parser: new ol.parser.GeoJSON()
  }),
            style: new ol.style.Style({
                     symbolizers: [
               new ol.style.Icon({
			url: '../../images/fahrradabstellanlage1.png',
		       })
                  ]
            })
  });

var trinkbrunnen = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: '/geoserver/g03_2013/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=g03_2013:TRINKBRUNNENOGD&outputFormat=json',
    parser: new ol.parser.GeoJSON()
  }),
            style: new ol.style.Style({
                     symbolizers: [
               new ol.style.Icon({
			url: '../../images/Trinkbrunnen.png',
		       })
                  ]
            })
  });

var haltestellen = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: 'http://student.ifip.tuwien.ac.at/geoserver/g03_2013/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=g03_2013:HALTESTELLEWLOGD&outputFormat=json',
    parser: new ol.parser.GeoJSON()
  }),
            style: new ol.style.Style({
                     symbolizers: [
               new ol.style.Icon({
			url: '../../images/Haltestellen.png',
		       })
                  ]
            })
  });

var oefflinien = new ol.layer.Image({
  source: new ol.source.ImageWMS({
    url: '/geoserver/wms',
    params: {'LAYERS': 'g03_2013:OEFFLINIENOGDLine'}
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
    zoom: 11,
    maxZoom: 18
       })
});


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
xhr.open("GET", "DataDictTest.txt");
xhr.onload = function() {
  var lines = xhr.responseText.split('\n');
  // We start at line 3 - line 1 is column names, line 2 is not a variable
  for (var i = 2, ii = lines.length; i < ii; ++i) {
    var option = document.createElement('option');
    option.value = lines[i].substr(0, 17).trim();
    option.innerHTML = lines[i].substr(17, 105).trim();
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

document.getElementById('featureCityBike').onclick = function(e){
  if(this.checked==1){
    olMap.addLayer(cityBikeLayer);
  }else{
    olMap.removeLayer(cityBikeLayer);
  }
};
document.getElementById('featureAbstell').onclick = function(e){
  if(this.checked==1){
    olMap.addLayer(fahrradabstell);
  }else{
    olMap.removeLayer(fahrradabstell);
  }
};
document.getElementById('featureBrunnen').onclick = function(e){
  if(this.checked==1){
    olMap.addLayer(trinkbrunnen);
  }else{
    olMap.removeLayer(trinkbrunnen);
  }
};
document.getElementById('featureHaltestellen').onclick = function(e){
  if(this.checked==1){
    olMap.addLayer(haltestellen);
  }else{
    olMap.removeLayer(haltestellen);
  }
};
document.getElementById('featureOeffi').onclick = function(e){
  if(this.checked==1){
    olMap.addLayer(oefflinien);
  }else{
    olMap.removeLayer(oefflinien);
  }
};

