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

module.exports = userController;
