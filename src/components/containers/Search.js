import React, { Component } from 'react';
import { Redirect } from 'react-router';
import CityRedirect from '../CityRedirect';

export default class Search extends Component {
  constructor(props){
    super(props)
    this.handlePlaceChanged = this.handlePlaceChanged.bind(this);
    this.place = null;
  }
  
  componentDidMount() {
    let input = document.getElementById('autocomplete');

    this.autocomplete = new google.maps.places.Autocomplete(input,{types: ['(cities)']});
    console.log(this.autocomplete)
    // Add event listener to element to capture typing
    this.autocomplete.addListener('place_changed', this.handlePlaceChanged)
  }

  handlePlaceChanged(){
    const place = this.autocomplete.getPlace();
    let resultObj = {
      name: place.name,
      place_id: place.place_id,
    }
    this.props.updateCity(resultObj);
  }
  
  render() {
    return (
      <form id="searchForm" onSubmit={(event)=>{
        event.preventDefault()
      }}>
        <input type="text" id="autocomplete"/>
      </form>
    );
  }
}
