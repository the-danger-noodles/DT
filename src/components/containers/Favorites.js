import React from 'react';

import City from '../display/City';

function Favorites(props) {
  // props.favorites(array of cities)   props.setCurrent(function to change current)
  if (props.favorites.length === 0)
    return <div id="favorites">You don't have any favorites yet</div>;
  const arrayOfCities = [];
  // console.log('Favorites on the props: ', props.favorites);
  props.favorites.forEach((fav, index) => {
    arrayOfCities.push(
      <City
        changeFavorite={props.changeFavorite}
        updateCity={props.updateCity}
        // grabLocationData={props.grabLocationData}
        // setCurrent={props.setCurrent}
        key={`fav` + index}
        place_id={fav.place_id}
        name={fav.city}
        // locationString={props.cityCountrySearch}
      />
    );
  });

  return (
    <div>
      <h2>Your Favorites</h2>
      <div id="favorites">{arrayOfCities}</div>
    </div>
  );
}

export default Favorites;
