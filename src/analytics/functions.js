import {FB} from "../x/firebase"

export const getEmails = (uid,reservations) => {
  if (uid) {
    FB.firestore()
      .collection("business")
      .doc(uid)
      .collection("reservations")
      .where("email", ">", "")
      .get()
      .then(q => {
        let res = [];
        q.forEach(d => {
          let r = d.data();
          res.push(r.email);
        });

        let emails = [...new Set(res)].join(", ");

        if (emails) {
          prompt("Remember to set BCC for email privacy!", emails);
        } else {
          alert("No emails found!");
        }
      });
  } else {
    let emails = [
      ...new Set(reservations.map(r => r.email).filter(e => e !== ""))
    ].join(", ");

    if (emails) {
      prompt("Remember to set BCC for email privacy!", emails);
    } else {
      alert("No emails found!");
    }
  }
};