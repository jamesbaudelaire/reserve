import React from "react";

import { BrowserRouter, Route, Switch } from "react-router-dom";

import { Home } from "./home";
import { createGlobalStyle } from "styled-components";

import { useAnimation } from "./x/animation";
import { Form } from "./guest/form";

const GS = createGlobalStyle`

:root{
--font:'Ubuntu', sans-serif;
--shadow:0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
--inset:black 1px 1px 3px 0 inset;
--theme:#6b63ff;
--green:#3acc6c;
--red:#d50000;

--dark:rgb(30,30,30);
--light:rgb(240,240,240);
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
  :focus {outline:0;};


}

a{
  text-decoration:none;
}

input {
      margin: 10px;
      border: none;
      box-shadow: var(--inset);
      border-radius: 5px;
      padding: 5px 10px;
      outline: none;
      -webkit-appearance: none;
    }


button,.add-reservation,.reservation{
  box-shadow: var(--shadow);
  &:active{
    background:var(--green) !important;
    color:white !important;
  }
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

}

body,button,input,.add-reservation,.reservation-form,#guest-form .inputs,.top-shelf{
  background:var(--light);
  color:var(--dark);
  @media (prefers-color-scheme: dark) {
  background:var(--dark);
  color:var(--light)
}

}

.loading-line{
  position:fixed;
  bottom:0;left:0;
  width:100%;
  height:0;
  background:black;
  transition:.5s;

  div{
    width:0;height:100%;
    background:var(--green);
    animation: loading 2s ease-out infinite;
    margin:auto;
  }

  &.loaded{
    height:7px;
  }
  
}
@keyframes loading {
  
  0%   {
    opacity:0;
  }
  50%  {
        opacity:1;
width:100%;

  }
  100% {
width:100%;
    opacity:0;
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
  width: calc(100% - 440px);
    height: calc(100% - 250px);
    box-shadow: var(--shadow);
    border-radius: 5px;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
}

button{
  &:hover{
    background:var(--green) !important;
    color:white !important;
  }
}

.loading-line{
  position:absolute;
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

export const App = () => {
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
