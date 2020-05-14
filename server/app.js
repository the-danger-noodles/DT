const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');

const apiRouter = require('./routers/apiRouter');
const authController = require('./controllers/authController');

const app = express();
const port = 3000;

app.use(cookieParser(), express.json(), express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.status(200).sendFile(path.resolve(__dirname, '../index.html')));
app.use("/build", express.static(path.resolve(__dirname, "../build")));

<<<<<<< HEAD
app.get('/verify', userController.authenticate, (req, res) => {
  res.status(200).redirect('/authorize');
});

// separate authorization route to prevent spotify code from being retained in 'home' url
app.get(
  '/authorize',
  userController.authorize,
  cookieController.setCookie,
  (req, res) => res.redirect('/home'),
);

app.get(
  '/home',
  cookieController.checkCookie,
  userController.getUserData,
  (req, res) =>
    res
      .status(200)
      .sendFile(path.resolve(__dirname, '..', 'index.html')),
);

app.get(
  '/api/:city&:country',
  apiController.setQuery,
  apiController.getCountryData,
  apiController.getWeatherData,
  apiController.getSpotifyData,
  (req, res, next) => {
    return next();
  },
  (req, res) => res.status(200).send(res.locals.data),
);

// app.get('/api/user',
//   userController.getUserData,
//   (req, res) => res.status(200).send(res.locals.user));

app.post(
  '/api/toggleFav/:city&:country&:email',
  queryController.addFav,
  queryController.getFavs,
  (req, res) => {
    res.status(200).send(res.locals.user.favsArray);
  },
);

app.get(
  '/api/user',
  userController.getUserData,
  queryController.createOrFindUser,
  queryController.getFavs,
  (req, res) => res.status(200).send(res.locals.user),
);


if (process.env.NODE_ENV === "production") {
  app.use("/build", express.static(path.join(__dirname, "../build")));
  app.get('/*', (req, res) => {
    console.log(__dirname)
    res.sendFile(path.join(__dirname, '../index.html'));
  });
}

=======
app.get('/authorize', authController.authorize, (req, res) => res.status(200).send("Authorized"));

app.use('/api', apiRouter);
>>>>>>> c6afc5f30e6ff9a1f6521e51706425c858b4e5ec

app.use('/', (req, res) => res.status(404).send("Not Found"));
app.use((err, req, res, next) => res.status(500).send("Internal Server Error"));

app.listen(port, () => console.log(`listening on port ${port}...`));
