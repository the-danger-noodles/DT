const fetch = require('node-fetch');
const querystring = require('querystring');
const db = require('../models/dbModels');

const { weather_api_key, google_api } = require('../secrets/secrets.js');

const apiController = {};

apiController.getLocationData = async (req, res, next) => {
  const { id } = req.params;

  const { rows } = await db.query(`
    SELECT * FROM locations WHERE id = $1`, 
    [ id ]
  );

  let city, countryCode;

  if (!rows.length) {


    const data = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${id}&key=${google_api}&result_type=locality`)
      .then(response => response.json());

    if (!data.result) {
      return next("Bad Request");
    }

    city = data.result.name;
    countryCode = data.result.address_components.pop().short_name;

    await db.query(`
      INSERT INTO locations (id, city, country) VALUES($1, $2, $3)`, 
      [ id, city, countryCode ]
    );
  } else {
    city = rows[0].city;
    countryCode = rows[0].country;
  }

  const location = res.locals.location || {};
  res.locals.location = { ...location, id, city, countryCode };
  next();
};

apiController.getCountryData = async (req, res, next) => {
  let { countryCode } = res.locals.location;
  countryCode = countryCode.toLowerCase();

  const data = await fetch(`https://restcountries.eu/rest/v2/alpha/${countryCode}`)
    .then(response => response.json());

  const { name, capital, region, area, population, flag } = data;
  const languages = data.languages.map(lang => lang.name);

  res.locals.location.country = { name, capital, region, area, population, flag, languages };
  next();
};

apiController.getWeatherData = async (req, res, next) => {
  const { city, countryCode } = res.locals.location;

  const query = querystring.encode({ 
    q: `${city}, ${countryCode}`,
    appid: weather_api_key,
    units: 'metric'
  });

  const data = await fetch(`https://api.openweathermap.org/data/2.5/weather?${query}`)
    .then((response) => response.json());

    console.log(data);

  const { temp, feels_like, temp_min, temp_max, humidity } = data.main;
  const { sunrise, sunset } = data.sys;
  const windSpeed = data.wind.speed;
  const timezone = data.timezone;
  const weather = data.weather[0].main;

  res.locals.location.weatherData = { 
    temp, feels_like, temp_min, temp_max, humidity, sunrise, sunset, timezone, weather, windSpeed
  };
  return next();
};

apiController.getPlaylistData = async (req, res, next) => {
  const url = `https://api.spotify.com/v1/browse/categories/toplists/playlists?country=${res.locals.location.countryCode}`;
  const options = {
    mode: 'no-cors',
    headers: { 
      Authorization: `Bearer ${res.locals.token.access_token}` 
    }
  };
  const data = await fetch(url, options)
    .then((response) => response.json());

  if (!data.playlists) {
    res.locals.location.trackList = [];
    return next();
  }

  let playlist = data.playlists.items.find(playlist => playlist.name.indexOf('Top 50') !== -1);

  if (!playlist) {
    playlist = data.playlists[0];
  }

  const tracks = await fetch(playlist.tracks.href, options)
    .then((response) => response.json());

  res.locals.location.trackList = tracks.items.map(({ track }) => ({
    name: track.name,
    by: track.artists[0].name,
    url: track.external_urls.spotify
  }));
  return next();
};

module.exports = apiController;
