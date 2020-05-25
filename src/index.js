import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter, Route, Switch } from "react-router-dom";

import { Home } from "./home";
import { createGlobalStyle } from "styled-components";

import { Provider } from "react-redux";
import { store } from "./redux/reducers";

import { useAnimation } from "./x/animation";
import { Form } from "./guest/form";

const GS = createGlobalStyle`

:root{
--font:'Ubuntu', sans-serif;
--shadow:0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
--inset:black 1px 1px 3px 0 inset;
--theme:#6b63ff;
--select:#3acc6c;
--grey:rgb(200, 200, 200);

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
      padding: 5px 10px;
      border-radius: 5px;
      border: none;
      background:white;
  :focus {outline:0;};
  :hover{
    background:var(--select);
    color:white;
  }

}

input {
      margin: 10px;
      border: none;
      box-shadow: var(--inset);
      border-radius: 5px;
      padding: 5px 10px;
      outline: none;
    }



button,.nav i,.add-reservation,.reservation{
  box-shadow: var(--inset);

}

body{
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  touch-action: manipulation;
  user-select:none;
  margin:0;padding:0;
  ::after {
    content: "";
    display: block;
    height: 300px;
  }
  background:rgb(250,250,250);
  color:#3f3d56;
}


.loader{
  position:fixed;top:0;right:0;
  margin:10px;
height:50px;
width:50px;
animation: rotate 1s linear infinite;

circle {
fill: none;
stroke: var(--theme);
stroke-width: 3;
stroke-dasharray: 100;
stroke-dashoffset: 200;
animation: loading 3s linear infinite;
}

@keyframes loading {
to {
  stroke-dashoffset: 0;
}
}
@keyframes rotate{
  to{
       transform:rotate(360deg);
  }
}

}

#app{
  opacity:0;
transition:.7s;
  &.loaded{
    opacity:1;
  }
}

@media screen and (min-width: 1000px) {

#app{
  position: absolute;
  overflow:scroll;
  width: calc(100% - 400px);
    height: calc(100% - 240px);
    box-shadow: var(--shadow);
    border-radius: 5px;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
}

}



`;

const Pages = () => {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/:business" component={Form} />
    </Switch>
  );
};

const App = () => {
  const load = useAnimation();
  return (
    <div id="app" {...load}>
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
