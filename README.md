# BAG Adresvalidatie
Zoek aan de hand van de postcode huisnummer combinatie adressen op uit de Basis Administratie Gebouwen. 

## Getting Started  
Het script maakt gebruik van de RESTful API van het Kadaster. Om hiervan gebruik te maken is een gratis verkrijgbare API-key vereist. Een basisregistraties API-key kan verkregen worden door een e-mail te sturen naar dataplatform@kadaster.nl en kan gebruikt worden voor zowel de BAG API als de BRT API. Zie ook [deze pagina](https://bag.basisregistraties.overheid.nl/restful-api?articleid=1927964).
De verkregen API-key kan op regel 106 `key here` worden geplaatst.

Verder wordt er gebruik gemaakt van [Turf.js](https://turfjs.org/). Turf.js kan in de browser gemakkelijk worden gebruikt middels:
```html
<script src='https://npmcdn.com/@turf/turf/turf.min.js'></script>
```
## Gebruik
Een adres kan worden opgevraagd doormiddel van:
```javascript
var postcode = "1011AB";
var huisnummer = "107";
adres(postcode, huisnummer)
```
Bij een geldig adres zullen de volgende velden worden gegeven:
```javascript
{ 
  straatnaam: 'De Ruijterkade',
  huisnummer: '107',
  huisletter: undefined,
  toevoeging: undefined,
  plaats: 'Amsterdam',
  postcode: '1011AB',
  coordinaten: { lat: 52.3778166, lon: 4.9053859 } 
}
```

### Huisnummer variaties
In Nederland zijn diverse huisnummer combinaties mogelijk. Ook deze toevoegingen kunnen worden ingegeven.
```javascript
var huisnummer = "1" // huisnummer zonder letter en toevoeging
var huisnummer = "1A" // huisnummer met letter, zonder toevoeging
var huisnummer = "1-1" // huisnummer met toevoeging, zonder letter
var huisnummer = "1A-1" // huisnummer met letter en toevoeging. 
```
Ook andere toevoegingen (o.a. `1-HS`, `1-ZW`, `1-RD`, `1-BIS`) kunnen worden gebruikt. Let op! Deze toevoegingen zijn hoofdlettergevoelig. De schrijfwijze worden door elkaar heen gebruikt in de BAG. Zo zij de schrijfwijzen voor `1-BIS`:
1. `1-BIS`
2. `1-bis`
3. `1-Bis`

## Live demo
Een demo is [hier](https://adressen.sjorsluyckx.nl) te vinden. 
