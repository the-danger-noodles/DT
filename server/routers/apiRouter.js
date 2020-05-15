const router = require('express').Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const locationController = require('../controllers/locationController');

const db = require('../models/dbModels');

router.use('/', authController.verify);
router.use((err, req, res, next) => res.status(403).send("Forbidden"));

router.get('/me', 
  userController.getAuthUser,
  userController.getFavs,
  (req, res) => res.status(200).json(res.locals.user));

router.put('/me/favorite/:location_id', 
  userController.getAuthUser,
  userController.toggleFav,
  (req, res) => res.status(200).send());

router.get('/location/:id', 
  locationController.getLocationData, 
  locationController.getCountryData,
  locationController.getWeatherData,
  locationController.getPlaylistData,
  (req, res) => res.status(200).json(res.locals.location)
);

router.use((err, req, res, next) => res.status(400).send("Bad Request"));

module.exports = router;