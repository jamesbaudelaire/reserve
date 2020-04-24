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

  update(uid, reservation) {
    store
      .collection("business")
      .doc(uid)
      .collection("reservations")
      .doc(`${reservation.id}`)
      .update(reservation);
  },
  arrived(uid, id, toggle) {
    store
      .collection("business")
      .doc(uid)
      .collection("reservations")
      .doc(`${id}`)
      .update({ arrived: toggle });
  }
};

let auth = firebase.auth();

export const A = {
  login(inputs) {
    auth.signInWithEmailAndPassword(inputs.email, inputs.password).catch(error => {
      console.log(error.code, error.message);
    });
  },

  logout() {
    auth.signOut();
  }
};

let email = "the.rialto.restaurant@gmail.com";
let password = "36542108";
// USER.logout()

// USER.login(email,password)
// USER.state()
