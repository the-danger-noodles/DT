import React from "react";
import { Route, Redirect } from "react-router-dom";

export default function CityRedirect({ component: Component, defaultCity: defaultCity, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => {
        return (
          <Redirect
            to={{
              pathname: `/${defaultCity.name}`,
              state: {
                from: props.location,
              },
            }}
          />
        )
      }}
    />
  );
}
