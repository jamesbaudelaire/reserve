import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter, Route, Switch } from "react-router-dom";

import { Home } from "./home";
import { createGlobalStyle } from "styled-components";

import { Provider } from "react-redux";
import { store } from "./redux/reducers";

import { useAnimation } from "./x/animation";

const GS = createGlobalStyle`

:root{
--font:'Ubuntu', sans-serif;
--shadow:0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
--select:#6b63ff;
--theme:#3acc6c;

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
      padding: 5px 10px;
      border-radius: 5px;
      border: none;
      color: white;
  :focus {outline:0;}
  &:hover{
    background:var(--select);
    box-shadow:var(--shadow);
  }
&:active{
  background:black;
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
  color:#3f3d56;
}


i{
  cursor:pointer;
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

button{
background:#3f3d56;
}

#app{
  opacity:0;
transition:1s;
  &.loaded{
    opacity:1
  }
}

@media screen and (min-width: 1000px) {

#app{
  position: absolute;
  overflow:scroll;
  width: calc(100% - 400px);
    height: calc(100% - 200px);
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
