import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Home from './Home';
import SignIn from '../SignIn';
import CityRedirect from '../CityRedirect';
import { google_api } from '../../../server/secrets/secrets'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoggedIn: undefined,
      defaultCity: {
        place_id: null,
        name: null,
      },
      user: {
        favsArray: [],
        id: "",
        spotify_email: "",
        username: ""
      },
      chosenCity: {
        place_id: null,
        name: null,
      },
    }
    this.setCurrentCity = this.setCurrentCity.bind(this);
    this.changeFavorite = this.changeFavorite.bind(this);
  }

  componentDidMount() {
    if (!this.state.isLoggedIn) this.checkLoggedIn()
    if (!this.state.defaultCity.name) this.getDefaultCity()
  }

  checkLoggedIn () {
    fetch('/api/me')
      .then(response => {
        if (response.status === 403) {
          this.setState({isLoggedIn: false});
          throw Error("Not logged in")
        } else {
          return response.json()
        }
      })
      .then(payload => {
        this.setState({
          user: payload,
          isLoggedIn: true,
        });
      })
      .catch(error => console.log(error));
  }

  getDefaultCity () {
    console.log("INSIDE DEFAULT CITY")
    let lat;
    let long;
    navigator.geolocation.getCurrentPosition(x => { 
      lat = x.coords.latitude 
      long = x.coords.longitude
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${google_api}&libraries=places&result_type=locality`)
      .then(response => response.json())
      .then(payload => {
        let countryObj = payload.results[0].address_components.filter(obj => obj.types[0] === 'locality')
        console.log(countryObj[0].city)
        let results = {
          place_id: payload.results[0].place_id,
          name: countryObj[0].long_name,
        }
        this.setState({
          defaultCity: results,
          chosenCity: results,
        })
      })
    })
  }

  setCurrentCity(cityDetails){
    console.log("Inside setCurrentCity: ", cityDetails)
    this.setState({chosenCity: cityDetails})
  }

  changeFavorite(place_id, value) {
    const options = {
      method: "PUT", 
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        toggle: value
      })
    };

    fetch(`/api/me/favorite/${place_id}`, options)
      .then(() => {
        //success
      })
      .catch(err => {
        //error
      });
  }

  render() {
    console.log("STATE IN RENDER", this.state)
    if (!this.state.isLoggedIn){
      return (
        <div id="app">
          <SignIn />
        </div>
      )
    } else {
      return (
        <div id="app">
          <Switch>
            <CityRedirect exact path='/' defaultCity={this.state.defaultCity} chosenCity={this.state.chosenCity} />
            <Route exact path='/signin' component={SignIn} />
            <Route path='/:city'>
              <Home user={this.state.user} 
                chosenCity={this.state.chosenCity} 
                changeFavorite={(place_id, value) => this.changeFavorite(place_id, value)}
                updateCity={(cityDetails) => this.setCurrentCity(cityDetails)} />
            </Route>
          </Switch>
        </div>
      )
    }
  }
}
