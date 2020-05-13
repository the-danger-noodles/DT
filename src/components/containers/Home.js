/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { FontAwesomeIcon as FAIcon } from '@fortawesome/react-fontawesome';
import { faStar as regStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';

import Weather from './Weather';
import Search from './Search';
import SwitchContainer from './SwitchContainer';

import Favorites from './Favorites';
// import { ProgressPlugin } from 'webpack';

function Home() {
  // const useHistory =
  const [current, setCurrent] = useState({});
  //current is the bigAssObject we receive from "grabLocationData" that feeds most of the components with data
  const [username, setUserName] = useState('');
  //for welcoming
  const [email, setEmail] = useState('');
  //unique name to add favs to db
  const [favorites, setFavorites] = useState([]);
  //array of favs we got on initial load
  const [query, setQuery] = useState('');
  //save users search in case he wants to add it to favs(we only save his query, not actual country data
  //since its different every time)

  //initial load
  useEffect(() => {
    fetch('/api/user')
      .then((res) => res.json())
      .then((user) => {
        setUserName(user.display_name);
        setEmail(user.email);
        setFavorites(user.favsArray);
      })
      .catch((err) => err);
  }, []);
  //fires up on search submit and on click of fav city
  const grabLocationData = (location) => {
    if (!location) return;
    //change the format of incoming string to add if as params
    const locationString = location
      .split(',')
      .map((word) => word.trim())
      .join('&');
    fetch(`/api/${locationString}`)
      .then((data) => data.json())
      .then((response) => {
        setCurrent(response);
        setQuery(email + ', ' + response.userQuery);
        // const destUrl = `/home/${response.userQuery}`;
        // history.push(destUrl);
      });
  };
  //toggle fav doesnt toggle, only adds fav, there is no way to remove it, sorry guys, we had no time:(
  const toggleFav = (queryString) => {
    //format the string for params
    const values = queryString.split(',').map((elem) => elem.trim());
    const city = values[1];
    const country = values[2];
    const userEmail = values[0];
    fetch(`/api/toggleFav/${city}&${country}&${userEmail}`, {
      method: 'POST',
    })
      .then((data) => data.json())
      .then((updatedFavs) => {
        setFavorites(updatedFavs);
        //receive new array of favs and change the state
      });
  };

  if (!Object.keys(current).length) {
    //there is no current - render only these..
    return (
      <div>
        <div>
          <Search grabLocationData={grabLocationData} />
        </div>
        <div className="welcoming">Welcome, {username}!</div>
        <div>
          <Favorites
            favorites={favorites}
            grabLocationData={grabLocationData}
            setCurrent={setCurrent}
          />
        </div>
      </div>
    );
  }

  return (
    <div id="main">
      <Search grabLocationData={grabLocationData} />

      <div className="welcoming">Welcome {username}!</div>

      <Weather
        query={query}
        weather={current.weatherData}
        toggleFav={toggleFav}
      />

      <SwitchContainer
        current={current}
        favorites={favorites}
        grabLocationData={grabLocationData}
        setCurrent={setCurrent}
      />
    </div>
  );
}

export default Home;
