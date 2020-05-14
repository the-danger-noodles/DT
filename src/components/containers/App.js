import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './Home';
import SignIn from '../SignIn';
import CountryRedirect from '../CountryRedirect';

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoggedIn: undefined,
      defaultCountry: {
        place_id: null,
        name: null,
      },
      user: {}
      // chosenCountry: null,
    }
  }

  componentDidMount() {
    
    if (!this.state.isLoggedIn) this.checkLoggedIn()
    if (!this.state.defaultCountry.name) this.getDefaultCountry()
    // check if user is logged in
    // if defaultCountry === null get geolocation and add details to defaultLocation
  }

  checkLoggedIn () {
    console.log("DOING LOG IN CHECK")
    console.log("state logged in", this.state.isLoggedIn)
    fetch('/api/me')
      .then(response => {
        if (response.status === 403) {
          console.log("in 403")
          this.setState({isLoggedIn: false});
        }
        return response.json()
      })
      .then(payload => {
        this.setState({
          user: payload,
          isLoggedIn: true
        });
      })
      .catch(error => console.log(error));
  }

  getDefaultCountry () {
    console.log("INSIDE DEFAULT COUNTRY REQUEST")
    let lat;
    let long;
    navigator.geolocation.getCurrentPosition(x => { 
      lat = x.coords.latitude 
      long = x.coords.longitude
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=AIzaSyAAEoiWOV5UYY0ogJoSMi0AgctEoQ0kQlY&libraries=places`)
      .then(response => response.json())
      .then(payload => this.setState({defaultCountry: {
        place_id: payload.results[0].place_id,
        name: payload.results[0].address_components[4].short_name,
      }}))
    })
  }


  render() {
    
    console.log("state logged in RENDER", this.state.isLoggedIn)
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
            <CountryRedirect exact path='/' defaultCountry={this.state.defaultCountry} />
            <Route exact path='/signin' component={SignIn} />
            <Route path='/:country' component={Home} />
          </Switch>
        </div>
      )
    }
  }
}
