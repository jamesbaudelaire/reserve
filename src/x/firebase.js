import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

let config = {
  apiKey: "AIzaSyD9szrun3ZLO_4FtKLloMgneKul9ii3sS8",
  authDomain: "james-baudelaire.firebaseapp.com",
  databaseURL: "https://james-baudelaire.firebaseio.com",
  projectId: "james-baudelaire",
  storageBucket: "james-baudelaire.appspot.com",
  messagingSenderId: "970218456876",
  appId: "1:970218456876:web:186d615c142b861e180e89"
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

export const FB = firebase;

let store = firebase.firestore();

export const DB = {
  add(uid, reservation) {
    store
      .collection("business")
      .doc(uid)
      .collection("reservations")
      .doc(`${reservation.id}`)
      .set(reservation);
  },

  guest(business, reservation) {
    store
      .collection("private")
      .doc(business)
      .collection("reservations")
      .doc(`${reservation.id}`)
      .set(reservation);
  },

  update(uid, reservation) {
    store
      .collection("business")
      .doc(uid)
      .collection("reservations")
      .doc(`${reservation.id}`)
      .update(reservation);
  },

  delete(uid, reservation) {
    store
      .collection("business")
      .doc(uid)
      .collection("reservations")
      .doc(`${reservation.id}`)
      .delete();
  }
};

export const AUTH = firebase.auth();
