// App.j
import Child from "./Child";

<Route path="/:country" children={<Child />} />


// Child.js
import React from 'react';
import { useParams, useRouteMatch, Switch, Route } from "react-router-dom";


export default function Child() {
  let { country } = useParams();
  let { path } = useRouteMatch();
  console.log("INSIDE CHILD")
  return (
    <div>
      <Switch>
        <Route path={`${path}/spotify`}>
          <h1>{country}</h1>
          <h2>spotify</h2>
        </Route>
      </Switch>
    </div>
  )
}