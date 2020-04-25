import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter, Route, Switch } from "react-router-dom";

import { Home } from "./home.js";
import { Business } from "./business";

import { createGlobalStyle } from "styled-components";

import { Provider } from "react-redux";
import { store } from "./redux/reducers";

const GS = createGlobalStyle`

:root{
--font:'Ubuntu', sans-serif;
--shadow:0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
--select:#2962ff;
--theme:#00c853;

}

::-webkit-scrollbar {
display: none;
}

body,input,button{
  font-family:var(--font);
}

button{
  cursor:pointer;
  text-transform:uppercase;
  transition:.3s;
  margin: 0 20px 20px 0;
      background: black;
      padding: 5px 10px;
      border-radius: 5px;
      border: none;
      color: white;
  :focus {outline:0;}
  &:hover{
    background:var(--select);
  }
&:active{
  background:white;
}
}

input {
      margin: 10px;
      border: none;
      box-shadow: rgba(0, 0, 0, 0.75) 0px 2px 5px 0px inset;
      border-radius: 5px;
      padding: 5px 10px;
      outline: none;
    }




body{
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  touch-action: manipulation;
  user-select:none;
  margin:0;padding:0;
  ::after {
    content: "";
    display: block;
    height: 200px;
  }
  background:rgb(250,250,250);
  color:rgb(50,50,50);
}


i{
  cursor:pointer;
}





`;

const Pages = () => {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/:url" component={Business} />
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
