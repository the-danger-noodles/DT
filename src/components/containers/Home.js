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

// LOCATION DATA EXAMPLE
// {
//   "id": "ChIJKcumLf2bP44RFDmjIFVjnSM",
//   "city": "Bogota",
//   "countryCode": "CO",
//   "country": {
//     "name": "Colombia",
//     "capital": "Bogotá",
//     "region": "Americas",
//     "area": 1141748,
//     "population": 48759958,
//     "flag": "https://restcountries.eu/data/col.svg",
//     "languages": [
//       "Spanish"
//     ]
//   },
//   "weatherData": {
//     "temp": 17,
//     "feels_like": 15.77,
//     "temp_min": 17,
//     "temp_max": 17,
//     "humidity": 72,
//     "sunrise": 1589452976,
//     "sunset": 1589497353,
//     "timezone": -18000,
//     "weather": "Clouds"
//   },
//   "trackList": [
//     {
//       "name": "Rojo",
//       "by": "J Balvin",
//       "url": "https://open.spotify.com/track/380HmhwTE2NJgawn1NwkXi"
//     },
    
//   ]
// }



export default class Home extends Component {
  constructor(props){
    super(props)
    this.state = {}
  }

  componentDidMount() {
    this.getLocationData();
  }

  getLocationData() {
    fetch(`/api/location/${this.props.chosenCity.place_id}`)
      .then(response => response.json())
      .then(payload => {
        console.log("LOCATION RESPONSE", payload);
        this.setState(payload)
      })
  }

  // User data is passed down as props.user
  
  render() {
    console.log("STATE IN HOME", this.state)
    if (this.state.id === undefined) {
      return(
        <h1>Loading</h1>
      )
    } else {
      return (
        <div id="main">
          <Search updateCity={(cityDetails) => this.props.updateCity(cityDetails)} user={this.props.user} history={this.props.history} />
  
          <div className="welcoming">Welcome {this.props.user.username}!</div>
  
          <Weather
            query={()=> console.log("CLICK")}
            placeId={this.state.id}
            weather={this.state.weatherData}
            cityName={this.state.city}
            changeFavorite={this.props.changeFavorite}
          />
  
          <SwitchContainer
            // city = {this.state.city}
            changeFavorite={this.props.changeFavorite}
            country={this.state.country}
            updateCity={this.props.updateCity}
            favorites={this.props.user.favsArray}
            trackList={this.state.trackList}
          />
        </div>
      )
    }
  }
}

