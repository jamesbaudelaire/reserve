import React from "react";
import {A} from "./firebase"

import styled from "styled-components"

const S = styled.div`
.login{
  margin:20px;
}
`

export const Login = () => {
  

let inputs=[
  {
      input: "email",
      type: "email",
  },
  {
    input:'password',
    type:'password'
  }
]

let getInputs=()=>{
  let login={}
  inputs.forEach(x=>{
    login[x.input]=document.getElementById(x.input).value
  })
  // console.log(login)
  A.login(login)
}
  return(
    <S>
   
   <div className="login">
   {
     inputs.map(x=>
      <input
              id={x.input}
              key={x.input}
              placeholder={x.input}
              type={x.type}
            />
      )
   }
   <button
   onClick={()=>{
     getInputs()
   }}
   >login</button>
   </div>
      </S>
  )
};
