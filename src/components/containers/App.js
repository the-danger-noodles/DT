import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
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
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${google_api}&libraries=places`)
      .then(response => response.json())
      .then(payload => {
        let results = {
          place_id: payload.results[0].place_id,
          name: payload.results[0].address_components[4].short_name,
        }
        this.setState({
          defaultCity: results,
          chosenCity: results,
        })
      })
    })
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
          <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAAEoiWOV5UYY0ogJoSMi0AgctEoQ0kQlY&libraries=places"></script>
          <Switch>
            <CityRedirect exact path='/' defaultCity={this.state.defaultCity} />
            <Route exact path='/signin' component={SignIn} />
            <Route path='/:city'>
              <Home user={this.state.user} chosenCity={this.state.chosenCity} />
            </Route>
          </Switch>
        </div>
      )
    }
  }
}
