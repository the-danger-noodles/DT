const router = require('express').Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const apiController = require('../controllers/locationController');

const db = require('../models/dbModels');

router.use('/', authController.verify);

router.get('/me', 
  userController.getUser,
  userController.getFavs,
  (req, res) => res.status(200).send(res.locals.user));

router.put('/me/favorite/:location_id', 
  userController.getUser,
  userController.toggleFav);

router.get('/location/:id', 
  apiController.getLocationData, 
  apiController.getCountryData,
  apiController.getWeatherData,
  apiController.getPlaylistData,
  (req, res) => res.status(200).json(res.locals.location)
);

module.exports = router;