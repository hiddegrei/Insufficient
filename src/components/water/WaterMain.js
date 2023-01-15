import React, { useState, useEffect } from "react";
import "../../css/WaterMain.css";
// import Chart from "../Chart";
import { Chart } from "react-google-charts";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import { useStateValue } from "../../Stateprovider";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import WaterSensor from "./WaterSensor";

function WaterMain(props) {
  const [{ user, profile }, dispatch] = useStateValue();
  const [timeTypes, setTimeTypes] = useState([
    { name: "Last week", index: 0, path: "lastweek" },
    { name: "Last month", index: 1, path: "lastmonth" },
    { name: "Last year", index: 2 },
  ]);
  const [timeType, setTimeType] = useState(0);
  const [dataApi, setDataApi] = useState([]);
  const [dataToday, setDataToday] = useState([]);
  const [waterToday, setWaterToday] = useState([]);
  const [waterLastWeek, setWaterLastWeek] = useState([]);
  const [waterLastMonth, setWaterLastMonth] = useState([]);
  const [show, setShow] = useState(false);
  const [streak, setStreak] = useState();
  const [waterOptions, setWaterOptions] = useState([
     { amount: -1000 },
     { amount: -900 },
     { amount: -800 },
     { amount: -700 },
    { amount: -600 },
    { amount: -500 },
    { amount: -400 },
    { amount: -300 },
     { amount: -200 }, 
     { amount: -100 }, 
     { amount: 100 }, 
     { amount: 200 },
     {amount:300},
    { amount: 400 },
  { amount: 500 },
{ amount: 600 },
 { amount: 700 },
 { amount: 800 },
 { amount: 900 },
 { amount: 1000 },]);
  const [waterOptionIndex,setWaterOptionIndex]=useState(14)
  const [options, setOptions] = useState({
    hAxis: {
      textColor: "#0085FF",
      gridlines: {
        color: "#0085FF",
      },
      baselineColor: "#0085FF",
    },
    vAxis: {
      textColor: "#0085FF",
      gridlines: {
        color: "#0085FF",
      },
      baselineColor: "#0085FF",
    },
  });

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
    console.log(profile.username);
    if (profile.username) {
      getWaterToday()
      if (timeType === 0) {
        getWaterLastWeek()
      } else {
        getWaterLastMonth()
      }

      getStreak()

    }
  }, [profile, timeType]);

  function getWaterToday() {
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
      }).catch((err) => {
        console.log(err)
      });

  }
  function getStreak() {
    fetch(`https://us-central1-ms-users.cloudfunctions.net/app/api/users/${profile.username}/streak`, {
      method: "GET", // or 'PUT',

      headers: {
        accept: "text/html,application/json",
        Connection: "keep - alive",
      }
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        setStreak(json.streak)
      });
  }

  function getWaterLastWeek() {

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
        setShow(false);
        setWaterLastWeek(json.data);
      })
      .catch((err) => {
        console.log(err);
      });

  }
  function getWaterLastMonth() {

    fetch(`https://ms-waterintake.web.app/api/users/${profile.username}/waterintake/lastmonth`, {
      method: "GET", // or 'PUT',

      headers: {
        accept: "text/html,application/json",
        Connection: "keep - alive",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json.data);
        setShow(false);
        setWaterLastMonth(json.data);

      })
      .catch((err) => {
        console.log(err);
      });

  }

  useEffect(() => {
    let days = [  "mon", "tue", "wed", "thu", "fri","sat","sun"]

    if (waterLastWeek?.length === 7) {
      let arr = [["Day of week", "Water Intake (ml)", { role: "style" }]];
      waterLastWeek.map((doc, index) => {
        arr.push([waterLastWeek[index] ? days[new Date(waterLastWeek[index]?.date._seconds * 1000).getUTCDay()] : "noData", waterLastWeek[index] ? waterLastWeek[index]?.waterIntake : 0, waterLastWeek[index]?.waterIntake >= waterLastWeek[index]?.goal ? "green" : "red"]);
      });
      setDataTable(arr);

      // setDataTable([
      //   ["Day of week", "Water Intake (ml)", { role: "style" }],
      //   [waterLastWeek[0].data?days[new Date(waterLastWeek[0].data?.date._seconds * 1000).getUTCDay()]:"noData", waterLastWeek[0].data?waterLastWeek[0].data?.waterIntake:0, "red"], // RGB value
      //   [waterLastWeek[1].data?days[new Date(waterLastWeek[1].data?.date._seconds * 1000).getUTCDay()]:"noData", waterLastWeek[1].data?waterLastWeek[1].data?.waterIntake:0, "red"], // English color name
      //   [waterLastWeek[2].data?days[new Date(waterLastWeek[2].data?.date._seconds*1000).getUTCDay()]:"noData", waterLastWeek[2].data?waterLastWeek[2].data?.waterIntake:0, "yellow"],
      //   [waterLastWeek[3].data?days[new Date(waterLastWeek[3].data?.date._seconds*1000).getUTCDay()]:"noData", waterLastWeek[3].data?waterLastWeek[3].data?.waterIntake:0, "green"], // CSS-style declaration
      //   [waterLastWeek[4].data?days[new Date(waterLastWeek[4].data?.date._seconds*1000).getUTCDay()]:"noData", waterLastWeek[4].data?waterLastWeek[4].data?.waterIntake:0, "green"],
      //   [waterLastWeek[5].data?days[new Date(waterLastWeek[5].data?.date._seconds*1000).getUTCDay()]:"noData", waterLastWeek[5].data?waterLastWeek[5].data?.waterIntake:0, "green"],
      //   [waterLastWeek[6].data?days[new Date(waterLastWeek[6].data?.date._seconds*1000).getUTCDay()]:"noData", waterLastWeek[6].data?waterLastWeek[6].data?.waterIntake:0, "green"],
      // ]);
      setShow(true);
    }
  }, [waterLastWeek]);

  useEffect(() => {
    let days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]


    let arr = [["Day of week", "Water Intake (ml)", { role: "style" }]]
    waterLastMonth.map((doc, index) => {
      arr.push([waterLastMonth[index] ? days[new Date(waterLastMonth[index]?.date._seconds * 1000).getUTCDay()] : "noData", waterLastMonth[index] ? waterLastMonth[index]?.waterIntake : 0, waterLastMonth[index]?.waterIntake >= waterLastMonth[index]?.goal ? "green" : "red"])

    })
    setDataTable(arr)

    // setDataTable([
    //   ["Day of week", "Water Intake (ml)", { role: "style" }],
    //   [waterLastMonth[0].data?days[new Date(waterLastMonth[0].data?.date._seconds * 1000).getUTCDay()]:"noData", waterLastMonth[0].data?waterLastMonth[0].data?.waterIntake:0, "red"], // RGB value
    //   [waterLastMonth[1].data?days[new Date(waterLastMonth[1].data?.date._seconds * 1000).getUTCDay()]:"noData", waterLastMonth[1].data?waterLastMonth[1].data?.waterIntake:0, "red"], // English color name
    //   [waterLastMonth[2].data?days[new Date(waterLastMonth[2].data?.date._seconds*1000).getUTCDay()]:"noData", waterLastMonth[2].data?waterLastMonth[2].data?.waterIntake:0, "yellow"],
    //   [waterLastMonth[3].data?days[new Date(waterLastMonth[3].data?.date._seconds*1000).getUTCDay()]:"noData", waterLastMonth[3].data?waterLastMonth[3].data?.waterIntake:0, "green"], // CSS-style declaration
    //   [waterLastMonth[4].data?days[new Date(waterLastMonth[4].data?.date._seconds*1000).getUTCDay()]:"noData", waterLastMonth[4].data?waterLastMonth[4].data?.waterIntake:0, "green"],
    //   [waterLastMonth[5].data?days[new Date(waterLastMonth[5].data?.date._seconds*1000).getUTCDay()]:"noData", waterLastMonth[5].data?waterLastMonth[5].data?.waterIntake:0, "green"],
    //   [waterLastMonth[6].data?days[new Date(waterLastMonth[6].data?.date._seconds*1000).getUTCDay()]:"noData", waterLastMonth[6].data?waterLastMonth[6].data?.waterIntake:0, "green"],
    // ]);
    console.log("lastmonth")
    setShow(true);

  }, [waterLastMonth]);

  function addWater(amount) {
    var details = {
      oldAmount: waterToday.waterIntake,
      amount: amount,
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
        if (waterToday?.waterIntake >= waterToday?.goal) {
          getStreak()
        }
      });
  }
  return (
    <div className="water direc">
      <div className="water__header">
        <h1>Water intake</h1>
      </div>
      <div className="water_top">
        <div className="water_top_elm">
          <div className="water_top_elm_h">Today</div>
          <div className="water_top_elm_val">{waterToday?.waterIntake}ml</div>
          {/* <AddCircleIcon onClick={() => addWater()} className="water_icon" />
          <AddCircleIcon onClick={() => addWater()} className="water_icon" /> */}
        </div>

        <div className="water_top_elm">
          <div className="water_top_elm_h">Streak</div>
          <div className="water_top_elm_val">{streak}</div>
        </div>
      </div>
      <div className="water_top_elm_changeCon">
        <KeyboardArrowLeftIcon
          className="water_icon_left"
          onClick={() => {
            if (waterOptionIndex > 1) {
              setWaterOptionIndex(waterOptionIndex - 1);
            }
          }}
        />
        {waterOptionIndex > 1 && (
          <div onClick={()=>addWater(waterOptions[waterOptionIndex - 1].amount)} className="water_top_elm_changeCon_elm">
            <LocalDrinkIcon  /> {waterOptions[waterOptionIndex - 1].amount}
          </div>
        )}
        <div onClick={()=>addWater(waterOptions[waterOptionIndex ].amount)} className="water_top_elm_changeCon_elm waterMain">
          <LocalDrinkIcon /> {waterOptions[waterOptionIndex].amount}
        </div>
        {waterOptionIndex < waterOptions.length - 1 && (
          <div onClick={()=>addWater(waterOptions[waterOptionIndex + 1].amount)} className="water_top_elm_changeCon_elm">
            <LocalDrinkIcon /> {waterOptions[waterOptionIndex + 1].amount}
          </div>
        )}
        <KeyboardArrowRightIcon
          className="water_icon_right"
          onClick={() => {
            if (waterOptionIndex < waterOptions.length - 1) {
              setWaterOptionIndex(waterOptionIndex + 1);
            }
          }}
        />
      </div>
      <div className="water_table_con">
        <div className="water_table_con_h">
          {timeTypes[timeType].name}{" "}
          <ChangeCircleIcon
            className="water_h_icon"
            fontSize="large"
            onClick={() => {
              if (timeType < 1) {
                setTimeType(timeType + 1);
              } else {
                setTimeType(0);
              }
            }}
          />
        </div>
        {show && (waterLastWeek.length > 1 || waterLastMonth.length > 1) && <Chart options={options} className="water_table" chartType="ColumnChart" width="100%" height="400px" data={dataTable} />}
        {/* <Chart className="water_table" chartType="ColumnChart" width="100%" height="400px" data={data} /> */}
      </div>
      {/* <div className="water_today">
        <div className="water_today_h">Today</div>
        <div className="water_today_streak">
          <div className="water_today_title">Streak</div>
          <div className="water_today_value">
            <LocalFireDepartmentIcon /> {streak}
          </div>
        </div>
        <div className="water_today_streak">
          <div className="water_today_title">WaterIntake</div>
          <div className="water_today_value">
            <div className="water_today_con">
              <div className="water_today_con_val">{waterToday?.waterIntake}ml</div>
              <div className="water_today_con_plus">
                <AddCircleIcon onClick={() => addWater()} />
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <WaterSensor addWater={addWater}/>
    </div>
  );
}

export default WaterMain;
