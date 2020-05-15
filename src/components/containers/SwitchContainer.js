import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Spotify from './Spotify';
import Window from './Window';
import Favorites from './Favorites';

function SwitchContainer(props) {
  return (
    <div id="switchContainer">
      <Router>
        <div id="navBox">
          <li>
            <Link to="/Window">Country Info</Link>
          </li>
          <li>
            <Link to="/Spotify">Spotify</Link>
          </li>
          <li>
            <Link to="/Favorites">Favorites</Link>
          </li>
        </div>

        <Switch>
          <div id="contentBox">
            <Route exact path="/Spotify">
              <Spotify songs={props.trackList} />
            </Route>
            <Route exact path="/Window">
              <Window country={props.country} />
            </Route>
            <Route exact path="/Favorites">
              <Favorites
                favorites={props.favorites}
                changeFavorite={props.changeFavorite}
                updateCity={props.updateCity}
                // grabLocationData={props.grabLocationData}
                setCurrent={() => console.log("clicked set current")}
              />
            </Route>
          </div>
        </Switch>
      </Router>
    </div>
  );
}

export default SwitchContainer;
