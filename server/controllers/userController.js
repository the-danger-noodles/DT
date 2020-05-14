const db = require('../models/dbModels');

const userController = { };

// Add user to database
userController.getUser = async (req, res, next) => {
  const { spotify_email, username } = res.locals.user;

  if (spotify_email && username) {
    let data = await db.query(`
      SELECT * FROM users WHERE spotify_email = $1`, 
      [ spotify_email ]
    );

<<<<<<< HEAD
// posts a request to spotify to get an authorization token
userController.authorize = (req, res, next) => {
  const reqbody = {
    client_id,
    client_secret,
    grant_type: 'authorization_code',
    code: req.query.code,
    redirect_uri,
  };
  // AFTER AUTH CODE HAS BEEN RECEIVED:
  // make a post request to https://accounts.spotify.com/api/token
  // body contains the following parameters encoded in application/x-www-form-urlencoded:
  // client_id
  // cient_secret
  // grant_type: "authorization_code"
  // code: authorization code returned from initial request
  // redirect_uri: redirect_uri supplied when requesting code
  // header should specify content type as 'application/x-www-form-urlencoded'
  // on success, spotify's response body will contain the following properties:
  // access_token, token_type, scope, expires_in, refresh_token

  // access_token, token_type, scope, expires_in, refresh_token
  superagent
    .post('https://accounts.spotify.com/api/token')
    .send(reqbody)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .end((err, resp) => {
      if (err) {
        console.log(err);
        return next({ err: 'ERROR WITH AUTHORIZATION' });
      }
      res.locals.token = resp.body;
      return next();
    });
};

// redirects to spotify page prompting user to login
userController.authenticate = (req, res, next) => {
  // //define access scopes
  const scopes = 'user-read-private user-read-email';
  // redirect url must contain client_id, scopes, redirect_uri
  //* can also contain an optional 'state' parameter */
  res.redirect(
    `${
      'https://accounts.spotify.com/authorize' +
      '?response_type=code' +
      '&client_id='
    }${client_id}${
      scopes ? `&scope=${encodeURIComponent(scopes)}` : ''
    }&redirect_uri=${encodeURIComponent(redirect_uri)}`
  );
  // on spotify login page, user is asked to accept or deny terms of scope
  // if accepted, response query string contains authorization code
  // if denied, query string contains error
  // *query string will also contain value of 'state' if one was provided in params
=======
    if (!data.rows.length) {
      data = await db.query(`
        INSERT INTO users (spotify_email, username) VALUES ($1, $2) RETURNING *`, 
        [ spotify_email, username ]
      );
    } 

    res.locals.user = data.rows[0];
    return next();
  } else {
    return res.status(400).send("Bad Request");
  }
>>>>>>> c6afc5f30e6ff9a1f6521e51706425c858b4e5ec
};

userController.toggleFav = async (req, res, next) => {
  const { location_id } = req.params;
  const { toggle } = req.body;
  const user_id = res.locals.user.id;

  if (user_id && location_id && toggle !== undefined) {
    if (toggle === true) {
      const { rows } = await db.query(`
        SELECT * FROM favorites WHERE user_id = $1 AND location_id = $2`, 
        [ user_id, location_id ]
      );

      if (rows.length === 0) {
        await db.query(`
          INSERT INTO favorites (user_id, location_id) VALUES($1, $2)`, 
          [ user_id, location_id ]
        );
      }
    } else if (toggle === false) {
      await db.query(`
        DELETE FROM favorites WHERE user_id = $1 AND location_id = $2`, 
        [ user_id, location_id ]
      );
    }

    return res.status(200).send();
  } else {
    return res.status(400).send("Bad Request");
  }
};

<<<<<<< HEAD
// REFRESHING TOKENS:
// after tokens expire, new ones must be requested using the refresh_token property on token object
// POST https://accounts.spotify.com/api/token
// body must contain grant_type and refresh_token encoded in application/x-www-form-urlencoded
// header must contain following parameter:
// Authorization: Basic <base64 encoded client_id:client_secret>
// * alternatively, the client id and secret could be sent in request body as in authorize
=======
userController.getFavs = async (req, res, next) => {
  const user_id = res.locals.user.id;
  const { rows } = await db.query(`
    SELECT locations.city, locations.country FROM favorites 
    INNER JOIN locations ON favorites.location_id = locations.id
    WHERE user_id = $1`, 
    [ user_id ]
  );
  res.locals.user.favsArray = rows;
  return next();
};
>>>>>>> c6afc5f30e6ff9a1f6521e51706425c858b4e5ec

module.exports = userController;
