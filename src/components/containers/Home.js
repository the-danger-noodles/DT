/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React, { Component } from 'react'
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

// APP STATE
// this.state = {
//   isLoggedIn: undefined,
//   defaultCity: {
//     place_id: null,
//     name: null,
//   },
//   user: {
//     favsArray: [],
//     id: "",
//     spotify_email: "",
//     username: ""
//   },
//   chosenCity: {
//     place_id: null,
//     name: null,
//   },
// }

export default class Home extends Component {
  constructor(props){
    super(props)
    this.state = {

    }
  }

  componentDidMount() {
    this.getLocationData();
  }

  getLocationData() {
    fetch(`/location/${this.props.chosenCity.place_id}`)
      .then(response => response.json())
      .then(payload => console.log(payload))
  }

  changeFavorite() {

  }

  // User data is passed down as props.user
  
  render() {
    return (
      <div id="main">
        {/* <Search // grabLocationData={grabLocationData}
         />

        <div className="welcoming">Welcome {this.props.user.username}!</div>

        <Weather
          // query={query}
          // weather={current.weatherData}
          // toggleFav={toggleFav}
        />

        <SwitchContainer
          // current={current}
          // favorites={props.user.favorites}
          // grabLocationData={grabLocationData}
          // setCurrent={setCurrent}
        /> */}
      </div>
    )
  }
}

