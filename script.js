import turf from 'turf';

function adres(postcode, huisnummer){
  // Maak variabele aan
  var bagurl, straat, huisletter, toevoeging, plaats, lat, lon;
  // Check op huisletter / toevoeging
  switch(checkHuisnummer(huisnummer)) {
    case 1:
      // Verkrijg huisletter
      var pattern1 = new RegExp(/[A-Z]/i);
      huisletter = pattern1.exec(huisnummer);
      // Verkrijg toevoeging
      var pattern2 = new RegExp(/\-(.*)/);
      toevoeging = pattern2.exec(huisnummer)[1];
      // Verkrijg huisnummer
      var pattern3 = new RegExp(/[1-9]*/);
      huisnummer = pattern3.exec(huisnummer);
        // Stel BAG-url op
      bagurl = "https://bag.basisregistraties.overheid.nl/api/v1/nummeraanduidingen?postcode="+postcode+"&huisnummer="+huisnummer+"&huisletter="+huisletter+"&huisnummertoevoeging="+toevoeging+"";
      break;

    case 2:
      // Verkrijg toevoeging
      var pattern1 = new RegExp(/\-(.*)/);
      toevoeging = pattern1.exec(huisnummer)[1];
      // Verkrijg huisnummer
      var pattern2 = new RegExp(/[1-9]*/);
      huisnummer = pattern2.exec(huisnummer);
      // Stel BAG-url op
      bagurl = "https://bag.basisregistraties.overheid.nl/api/v1/nummeraanduidingen?postcode="+postcode+"&huisnummer="+huisnummer+"&huisnummertoevoeging="+toevoeging+"";
      break;

    case 3:
      // Verkrijg huisletter
      var pattern1 = new RegExp(/[A-Z]/i);
      huisletter = pattern1.exec(huisnummer);
      // Verkrijg huisnummer
      var pattern2 = new RegExp(/[1-9]*/);
      huisnummer = pattern2.exec(huisnummer);
      // Stel BAG-url op
      bagurl = "https://bag.basisregistraties.overheid.nl/api/v1/nummeraanduidingen?postcode="+postcode+"&huisnummer="+huisnummer+"&huisletter="+huisletter+"";
      break;

    default:
      bagurl = "https://bag.basisregistraties.overheid.nl/api/v1/nummeraanduidingen?postcode="+postcode+"&huisnummer="+huisnummer+"";
  }

  // API: Vraag BAG of deze combinatie bekend is
  var data = getRequest(bagurl);
  data = data._embedded.nummeraanduidingen[0];
  if (data != undefined){
    // Verkrijg URLs
    var coordinatenURL = data._links.adresseerbaarObject.href;
    var straatnaamURL = data._links.bijbehorendeOpenbareRuimte.href;

    var straatnaamData = getRequest(straatnaamURL);
    straat = straatnaamData.naam;

    // Zoek bijbehorende plaatsnaam
    var plaatsnaamURL = straatnaamData._links.bijbehorendeWoonplaats.href;
    var plaatsnaamData = getRequest(plaatsnaamURL);
    plaats = plaatsnaamData.naam;

    // Zoek bijbehorende coordinaten
    var coordinatenData = getRequest(coordinatenURL);
    if (coordinatenData._embedded.geometrie.type === "Point"){
      // Indien het adres een 'point' betreft, haal de coordinaten op.
      lon = coordinatenData._embedded.geometrie.coordinates[0];
      lat = coordinatenData._embedded.geometrie.coordinates[1];
    } else {
      // Indien het adres een 'polygon' betreft, zoek doormiddel van 'turf.js' het middelpunt voor de coordinaten.
      var polygon = turf.polygon(coordinatenData._embedded.geometrie.coordinates);
      var centroid = turf.centroid(polygon);
      lon = centroid.geometry.coordinates[0];
      lat = centroid.geometry.coordinates[1];
    }
    return {'straatnaam': straat, 'huisnummer': huisnummer, 'huisletter': huisletter, 'toevoeging': toevoeging, 'plaats': plaats, 'postcode': postcode, 'coordinaten': {'lat': lat, 'lon':lon}};

  } else {
      // Indien onbekend, geef foutmelding
      return 'Fout: De opgegeven postcode/huisnummer combinatie resulteert niet in een gelig adres.';
  }
}

function checkHuisnummer(huisnummerAanduiding) {
  // 1. Check op huisletters met een toevoeging vb: 11A-1
  var pattern1 = new RegExp(/[A-Z]\-(.*)/i);
  // 2. Check op BIS als toevoeging vb: 1-BIS
  var pattern2 = new RegExp(/\-/);
  // 3. Check op huisletter vb: 11A
  var pattern3 = new RegExp(/[A-Z]$/i);

  if (pattern1.test(huisnummerAanduiding)) {
    return 1;
  } else if (pattern2.test(huisnummerAanduiding)) {
    return 2;
  } else if (pattern3.test(huisnummerAanduiding)) {
    return 3;
  }
}

function getRequest(url){
  var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", url, false);
  xmlHttp.setRequestHeader('X-Api-Key', 'key here', 'Accept', 'application/hal+json');
  xmlHttp.send( null );
  var data = JSON.parse(xmlHttp.responseText);
  return data
}
