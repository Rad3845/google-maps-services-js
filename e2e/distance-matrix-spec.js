var arrayContaining = jasmine.arrayContaining;
var objectContaining = jasmine.objectContaining;

describe('distance matrix client library', function() {
  var googleMaps = require('./service');

  var inOneHour = new Date().getTime() + 60 * 60 * 1000;

  function expectOK(response) {
    expect(response.status).toBe(200);
    expect(response.json.status).toBe('OK');
    return response;
  }

  it('gets the distance matrix for Sydney Town Hall to Parramatta, NSW', function(done) {
    googleMaps.distanceMatrix({
      origins: [
        'Perth, Australia', 'Sydney, Australia', 'Melbourne, Australia',
        'Adelaide, Australia', 'Brisbane, Australia', 'Darwin, Australia',
        'Hobart, Australia', 'Canberra, Australia'
      ],
      destinations: [
        'Uluru, Australia', 'Kakadu, Australia', 'Blue Mountains, Australia',
        'Bungle Bungles, Australia', 'The Pinnacles, Australia'
      ]
    })
    .asPromise()
    .then(expectOK)
    .then(function(response) {
      expect(response.json)
      .toEqual(objectContaining({
        destination_addresses: arrayContaining(['Uluru NT 0872, Australia']),
        origin_addresses: arrayContaining(['Perth WA, Australia'])
      }));
    })
    .then(done, fail);
  });

  it('accepts localization options', function(done) {
    googleMaps.distanceMatrix({
      origins: ['Hornsby Station, NSW', 'Chatswood Station, NSW'],
      destinations: ['Central Station, NSW', 'Parramatta Station, NSW'],
      language: 'en',
      units: 'metric',
      region: 'au'
    })
    .asPromise()
    .then(expectOK)
    .then(done, fail);
  });

  it('accepts transit options', function(done) {
    googleMaps.distanceMatrix({
      origins: ['Hornsby Station, NSW', 'Chatswood Station, NSW'],
      destinations: ['Central Station, NSW', 'Parramatta Station, NSW'],
      arrival_time: inOneHour,
      mode: 'transit',
      transit_mode: ['bus', 'rail'],
      transit_routing_preference: 'fewer_transfers'
    })
    .asPromise()
    .then(expectOK)
    .then(done, fail);
  });

  it('accepts driving options', function(done) {
    googleMaps.distanceMatrix({
      origins: ['Hornsby Station, NSW', 'Chatswood Station, NSW'],
      destinations: ['Central Station, NSW', 'Parramatta Station, NSW'],
      departure_time: inOneHour,
      mode: 'driving',
      avoid: ['tolls', 'ferries'],
      traffic_model: 'best_guess'
    })
    .asPromise()
    .then(expectOK)
    .then(done, fail);
  });

});
