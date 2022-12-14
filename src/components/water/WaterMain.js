import React, { useState, useEffect } from "react";
import "../../css/WaterMain.css";
// import Chart from "../Chart";
import { Chart } from "react-google-charts";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import { useStateValue } from "../../Stateprovider";
import AddCircleIcon from "@mui/icons-material/AddCircle";

import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";

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
  const [waterToday, setWaterToday] = useState([]);
  const [waterLastWeek, setWaterLastWeek] = useState([]);
  const [show, setShow] = useState(false);
  const [streak,setStreak]=useState()

  // const waterIntake = functions.httpsCallable("waterIntake");

  const [dataTable, setDataTable] = useState([
    ["Day of week", "Water Intake (ml)", { role: "style" }],
    ["mo", 800, "red"], // RGB value
    ["tue", 1100, "red"], // English color name
    ["wed", 1500, "yellow"],
    ["thu", 2100, "green"], // CSS-style declaration
    ["fri", 2200, "green"],
    ["sat", 2500, "green"],
    ["sun", 2300, "green"],
  ]);
  useEffect(() => {
    // waterIntake({ type: 0, username: "test" }).then((doc) => {
    //   console.log(doc.data);
    //   setDataToday([doc.data]);
    // });
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
    //   .onSnapshot((docs) => {
    //     docs.forEach((doc) => {
    //       if (doc.id === `${day}`) {
    //         console.log(doc.data());
    //         setWaterToday(doc.data().waterIntake);
    //       }
    //     });
    //   });
  }, [profile]);

  useEffect(() => {
    console.log(profile.username);
    if (profile.username) {
      getWaterToday()
      getWaterLastWeek()
  getStreak()
      
    }
  }, [profile]);

  function getWaterToday(){
    fetch(`https://ms-waterintake.web.app/api/users/${profile.username}/waterintake/today`, {
        method: "GET", // or 'PUT',

        headers: {
          accept: "text/html,application/json",
          Connection: "keep - alive",
        },
      })
        .then((res) => res.json())
        .then((json) => {
          console.log(json);
          setDataToday(json.data);
        });

      fetch(`https://ms-waterintake.web.app/api/users/${profile.username}/waterintake/today`, {
        method: "GET", // or 'PUT',

        headers: {
          accept: "text/html,application/json",
          Connection: "keep - alive",
        },
      })
        .then((res) => res.json())
        .then((json) => {
         
          setWaterToday(json.data);
        }).catch((err)=>{
          console.log(err)
        });

  }
  function getStreak(){
     fetch(`https://us-central1-ms-users.cloudfunctions.net/app/api/users/${profile.username}/streak`, {
       method: "GET", // or 'PUT',

       headers: {
         accept: "text/html,application/json",
          Connection: "keep - alive",
       }
     })
       .then((res) => res.json())
       .then((json) => {
        //  console.log(json.streak);
          setStreak(json.streak)
       });
  }

  function getWaterLastWeek(){
    console.log("hi")
    fetch(`https://ms-waterintake.web.app/api/users/${profile.username}/waterintake/lastweek`, {
      method: "GET", // or 'PUT',

      headers: {
        accept: "text/html,application/json",
        Connection: "keep - alive",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json.data);
        setWaterLastWeek(json.data);
      })
      .catch((err) => {
        console.log(err);
      });

  }

  useEffect(() => {
    let days=["mon","tue","wed","thu","fri","sat","sun"]
    
    if (waterLastWeek?.length === 7) {
      console.log(new Date(waterLastWeek[0].data.date._seconds*1000).getUTCDay());
      setDataTable([
        ["Day of week", "Water Intake (ml)", { role: "style" }],
        [days[new Date(waterLastWeek[0].data.date._seconds * 1000).getUTCDay()], waterLastWeek[0].data.waterIntake, "red"], // RGB value
        [days[new Date(waterLastWeek[1].data.date._seconds * 1000).getUTCDay()], waterLastWeek[1].data.waterIntake, "red"], // English color name
        [days[new Date(waterLastWeek[2].data.date._seconds*1000).getUTCDay()], waterLastWeek[2].data.waterIntake, "yellow"],
        [days[new Date(waterLastWeek[3].data.date._seconds*1000).getUTCDay()], waterLastWeek[3].data.waterIntake, "green"], // CSS-style declaration
        [days[new Date(waterLastWeek[4].data.date._seconds*1000).getUTCDay()], waterLastWeek[4].data.waterIntake, "green"],
        [days[new Date(waterLastWeek[5].data.date._seconds*1000).getUTCDay()], waterLastWeek[5].data.waterIntake, "green"],
        [days[new Date(waterLastWeek[6].data.date._seconds*1000).getUTCDay()], waterLastWeek[6].data.waterIntake, "green"],
      ]);
      setShow(true);
    }
  }, [waterLastWeek]);

  function addWater() {
    var details = {
      oldAmount: waterToday.waterIntake,
      amount: 100,
    };
    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    fetch(`https://ms-waterintake.web.app/api/users/${profile.username}/waterintake/today`, {
      method: "PUT", // or 'PUT',

      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: formBody,
    })
      .then((res) => res.json())
      .then((json) => {
        // console.log(json);
        // setWaterToday(json.data);
        getWaterToday()
        getWaterLastWeek()
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
        {show && <Chart className="water_table" chartType="ColumnChart" width="100%" height="400px" data={dataTable} />}
        {/* <Chart className="water_table" chartType="ColumnChart" width="100%" height="400px" data={data} /> */}
      </div>
      <div className="water_today">
        <div className="water_today_h">Today</div>
        <div className="water_today_streak">
          <div className="water_today_title">
            Streak <LocalFireDepartmentIcon />
          </div>
          <div className="water_today_value">{streak}</div>
        </div>
        <div className="water_today_streak">
          <div className="water_today_title">
            WaterIntake
          </div>
          <div className="water_today_value">
            <div className="water_today_con">
          <div className="water_today_con_val">{waterToday.waterIntake}</div>
          <div className="water_today_con_plus">
            <AddCircleIcon onClick={() => addWater()} />
          </div>
        </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default WaterMain;
