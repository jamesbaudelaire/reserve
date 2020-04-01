import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter, Route, Switch } from "react-router-dom";

import { Home } from "./home.js";
import { Business } from "./business";

import { createGlobalStyle } from "styled-components";

const GS = createGlobalStyle`

`;

const Pages = () => {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/:business" component={Business} />
    </Switch>
  );
};

const App = () => {
  return (
    <div id="app">
      <GS />
      <BrowserRouter>
        <Pages />
      </BrowserRouter>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
