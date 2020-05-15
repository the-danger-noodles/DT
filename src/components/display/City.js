/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';

function City(props) {
  return (
    <div
      className="cityCard"
      onClick={() => {
        props.updateCity({ name: props.name, place_id: props.place_id });
        // props.grabLocationData(`${props.name.city}, ${props.name.country}`)
      }}>
      <div className="cityName">{props.name}</div>
      <button id="deleteFav" onClick={() => props.changeFavorite(props.place_id, false)}>X</button>
    </div>
  );
}

export default City;
