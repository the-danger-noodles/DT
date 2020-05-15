const db = require('../models/dbModels');

const userController = { };

/*
  
*/
userController.getAuthUser = async (req, res, next) => {
  const { spotify_email, username } = res.locals.user;

  if (!spotify_email || !username) {
    next("Bad Request");
  }

  let data = await db.query(`
    SELECT * FROM users WHERE spotify_email = $1`, 
    [ spotify_email ]
  );

  if (!data.rows.length) {
    data = await db.query(`
      INSERT INTO users (spotify_email, username) VALUES ($1, $2) RETURNING *`, 
      [ spotify_email, username ]
    );
  } 

  res.locals.user = data.rows[0];
  return next();
};

userController.toggleFav = async (req, res, next) => {

  const { location_id } = req.params;
  const { toggle } = req.body;
  const user_id = res.locals.user.id;

  if (!user_id || !location_id || typeof toggle !== 'boolean') {
    next("Bad Request");
  }

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
  } else {
    await db.query(`
      DELETE FROM favorites WHERE user_id = $1 AND location_id = $2`, 
      [ user_id, location_id ]
    );
  }

  return next();
};

userController.getFavs = async (req, res, next) => {
  const user_id = res.locals.user.id;

  if (!user_id) {
    next("Bad Request");
  }

  const { rows } = await db.query(`
    SELECT locations.city, locations.country FROM favorites 
    INNER JOIN locations ON favorites.location_id = locations.id
    WHERE user_id = $1`, 
    [ user_id ]
  );

  res.locals.user.favsArray = rows;
  return next();
};

module.exports = userController;
