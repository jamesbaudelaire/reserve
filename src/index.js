import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter, Route, Switch } from "react-router-dom";

import { Home } from "./home.js";
import { Business } from "./business";

import { createGlobalStyle } from "styled-components";

import { createStore } from "redux";
import { Provider } from "react-redux";
import { Reducers } from "./redux/reducers";

import { LS } from "./functions";

const store = createStore(Reducers);

store.subscribe(() => {
  LS.save(store.getState().reservations);
});

const GS = createGlobalStyle`

:root{
--font:'Ubuntu', sans-serif;
--shadow:0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);

}

::-webkit-scrollbar {
display: none;
}


body{
  touch-action: manipulation;
  user-select:none;
  font-family:var(--font);
  margin:0;padding:0;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  ::after {
    content: "";
    display: block;
    height: 200px;
  }
}


i{
  cursor:pointer;
}
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

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
