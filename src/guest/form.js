import React, { useState, useEffect } from "react";
import { CalendarUI } from "../business/calendar";
import { useParams } from "react-router-dom";
import { FB } from "../firebase";
import "./form.css";
export const Form = () => {
  const [day, setDay] = useState();

  let { business } = useParams();
  let logo = `https://res.cloudinary.com/baudelaire/image/upload/w_500/v1587884625/reserve/${business}.png`;

  const [name, setName] = useState();

  // useEffect(() => {

  //   FB.firestore()
  //     .collection("public")
  //     .doc(business)
  //     .get()
  //     .then(doc => {
  //       let data = doc.data();
  //       if(data){
  //     setName(data.name)
  //       }
  //     });
  // }, []);

  return (
    <div className="guest-form">
      <div className="business-name">{name}</div>
      {name && <img alt="logo" src={logo} className="logo" />}
      {<CalendarUI day={day} setDay={setDay} />}
    </div>
  );
};
