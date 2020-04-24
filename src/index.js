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
      border-radius: 30px;
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
      border-radius: 30px;
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
    height: 100px;
  }
}


i{
  cursor:pointer;
}

.add-reservation {
    font-size: 30px;
    position: fixed;
    bottom: 0;
    right: 0;
    margin: 20px;
    background: black;
    color:white;
    padding: 5px;
    transition:.3s;
    border-radius: 50%;
    z-index: 100;
    &:hover{
    background:var(--select);
  }
  }

  .business-name {
    position:absolute;left:90px;top:30px;
      font-size: 30px;
    }

    .logo {
      background-size: cover;
      height: 50px;
      width: 50px;
      border-radius: 50%;
      position: absolute;
      top: 0;
      left:0;
      margin: 20px;
    }
 

@media screen and (min-width: 700px) {

.reservations-ui{
  position:absolute;
  top:60px;left:20px;
}
.reservation-form{
  position: absolute;
    left: 340px;
    top: 360px;
    width: 300px;
}
.add-reservation{
  left: 340px;
    top: 360px;
    bottom: unset;
    right: unset;
}


.calendar{
  position: absolute;
    left: 360px;
    top: 20px;
}


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
