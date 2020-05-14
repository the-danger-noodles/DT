import React from "react";
import { Route, Redirect } from "react-router-dom";

export default function CountryRedirect({ component: Component, defaultCountry: defaultCountry, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => {
        return (
          <Redirect
            to={{
              pathname: `/${defaultCountry.name}`,
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
