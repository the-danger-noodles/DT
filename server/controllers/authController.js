const superagent = require('superagent');
const fetch = require('node-fetch');
const querystring = require('querystring');
const jwt = require('jsonwebtoken');

const { client_id, client_secret } = require('../secrets/secrets.js');
const redirect_uri = process.env.NODE_ENV === 'production' 
  ? 'http://localhost:3000/authorize' 
  : 'http://localhost:8080/authorize';


const authController = {};

authController.authorize = async (req, res, next) => {
  const { code } = req.query;

  if (!code) {
    const query = querystring.encode({ 
      client_id, redirect_uri,
      scope: 'user-read-private user-read-email',
      response_type: 'code'
    });

    res.redirect(`https://accounts.spotify.com/authorize?${query}`);
  } else {
    superagent.post('https://accounts.spotify.com/api/token')
      .send({ client_id, client_secret, redirect_uri, code, grant_type: 'authorization_code' })
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .end((err, { body }) => {
        if (err) {
          return next(err);
        }

        res.cookie('token', jwt.sign(body, client_secret));
        return next();
      });
  }
};

authController.verify = (req, res, next) => { 
  jwt.verify(req.cookies.token, client_secret, async (err, token) => {
    if (err) {
      return res.redirect('/');
    } else {
      res.locals.token = token;
    }

    const options = {
      method: 'get',
      headers: { 
        Authorization: `Bearer ${token.access_token}` 
      },
    };
    const data = await fetch('https://api.spotify.com/v1/me', options)
      .then(response => response.json());
    
    if (data.error) {
      res.status(403).json({ error: "Forbidden" });
    } else {
      const { display_name, email } = data;
      const user = res.locals.user || {};
      res.locals.user = { ...user, username: display_name, spotify_email: email };
      return next();
    }
  });
};

module.exports = authController;
