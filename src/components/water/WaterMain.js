import React, { useState, useEffect } from "react";
import "../../css/WaterMain.css";
// import Chart from "../Chart";
import { Chart } from "react-google-charts";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import { useStateValue } from "../../Stateprovider";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { db, functions } from "../../firebase";
import firebase from "firebase";

function WaterMain(props) {
  const [{ user, profile }, dispatch] = useStateValue();
  const [timeTypes, setTimeTypes] = useState([
    { name: "Last week", index: 0 },
    { name: "Last month", index: 1 },
    { name: "Last year", index: 2 },
  ]);
  const [timeType, setTimeType] = useState(0);
  const [dataApi, setDataApi] = useState([]);
  const [dataToday, setDataToday] = useState([]);

  const waterIntake = functions.httpsCallable("waterIntake");
  useEffect(() => {
    waterIntake({ type: 0, username: "test" }).then((doc) => console.log(doc));
    var today = new Date();
    var day = today.getDate();
    var month = today.getMonth();
    var year = today.getFullYear();
    console.log(year, month, day, profile?.username);

    // db.collection("users")
    //   .doc(profile?.username)
    //   .collection("calender")
    //   .doc(`${year}`)
    //   .collection(`${month}`)
    //   .doc(`${day}`)
    //   .get()
    //   .then((doc) => {
    //     console.log(doc.data());
    //     setDataToday(doc.data().waterIntake);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    db.collection("users")
      .doc(profile?.username)
      .collection("calender")
      .doc(`${year}`)
      .collection(`${month}`)
      .onSnapshot((docs) => {
        docs.forEach((doc) => {
          if (doc.id === `${day}`) {
            console.log(doc.data());
            setDataToday(doc.data().waterIntake);
          }
        });
      });
  }, [profile]);

  // useEffect(() => {
  //   fetch("http://localhost:3001/test/waterintake/lastweek", {
  //     method: "GET", // or 'PUT',

  //     headers: {
  //       accept: "text/html,application/json",
  //       Connection: "keep - alive",
  //     },
  //   })
  //     .then((res) => res.json())
  //     .then((json) => {
  //       console.log(json);
  //       setDataApi(json);
  //     });
  // }, []);

  const data = [
    ["Day of week", "Water Intake (ml)", { role: "style" }],
    ["mo", 800, "red"], // RGB value
    ["tue", 1100, "red"], // English color name
    ["wed", 1500, "yellow"],
    ["thu", 2100, "green"], // CSS-style declaration
    ["fri", 2200, "green"],
    ["sat", 2500, "green"],
    ["sun", 2300, "green"],
  ];

  function addWater() {
    var today = new Date();
    var day = today.getDate();
    var month = today.getMonth();
    var year = today.getFullYear();
    db.collection("users")
      .doc(profile?.username)
      .collection("calender")
      .doc(`${year}`)
      .collection(`${month}`)
      .doc(`${day}`)
      .update({
        waterIntake: firebase.firestore.FieldValue.increment(100),
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <div className="water">
      <div className="water__header">
        <h1>Water intake</h1>
      </div>
      <div className="water_table_con">
        <div className="water_table_con_h">
          {timeTypes[timeType].name}{" "}
          <ChangeCircleIcon
            className="water_h_icon"
            fontSize="large"
            onClick={() => {
              if (timeType < 2) {
                setTimeType(timeType + 1);
              } else {
                setTimeType(0);
              }
            }}
          />
        </div>
        <Chart className="water_table" chartType="ColumnChart" width="100%" height="400px" data={data} />
      </div>
      <div className="water_today">
        <div className="water_today_h">Today</div>
        <div className="water_today_h">{profile?.streak} streak</div>
        <div className="water_today_con">
          <div className="water_today_con_val">{dataToday}</div>
          <div className="water_today_con_plus">
            <AddCircleIcon onClick={() => addWater()} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default WaterMain;
