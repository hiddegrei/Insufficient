import React, { useState, useEffect } from "react";
import "../css/DailyIntakePage.css";
// import ChatOptie from "./ChatOptie";
import { db } from "../firebase";
import { useStateValue } from "../Stateprovider";
import SearchIcon from "@material-ui/icons/Search";
import { Link } from "react-router-dom";
import { Avatar } from "@material-ui/core";
// import AddnewChat from "./AddnewChat";

function DailyIntakePage() {
  const [messages, setMessages] = useState([]);

  const [{ user, profile }, dispatch] = useStateValue();
  const [addnew, setAddnew] = useState(true);

  useEffect(() => {
    if (user && profile.username) {
      db.collection("messages")
        .where("senderUsername", "==", profile.username)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log( doc.data());
            setMessages((dat) => {
              const newdata = { data: doc.data(), id: doc.id };
              const olddata = dat.filter((dat) => dat.id !== newdata.id);
              return [...olddata, newdata];
            });
          });
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
      //
      //
      db.collection("messages")
        .where("receiverUsername", "==", profile.username)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log( doc.data());
            setMessages((dat) => {
              const newdata = { data: doc.data(), id: doc.id };
              const olddata = dat.filter((dat) => dat.id !== newdata.id);
              return [...olddata, newdata];
            });
          });
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    }
  }, [user, profile.username]);

  function personalWaterIntake() {
    const weightInput = document.getElementById("weightInput").value;
    const waterOutput = document.getElementById("waterOutput");
    const waterIntake = weightInput * 0.035;
    waterOutput.innerHTML = waterIntake.toFixed(1) + "L per day";
  }

  return (
    <div className="dailyIntake">
      <div>
        <div className="dailyIntake__header">
          <h2>Personal waterintake</h2>
          <h3>Calculate your personal daily waterintake</h3>
        </div>

        <div className="dailyIntake__form">
          <form>
            <label>Insert your bodyweight in kg</label>
            <input type="int" id="weightInput" placeholder="your bodyweight" />
            <button type="button" onClick={personalWaterIntake}>Calculate</button>
          </form>
        </div>

        <div className="dailyIntake__p">
          <p type="int" id="waterOutput"></p>
        </div>

      </div>
    </div>
  );
}
export default DailyIntakePage;
