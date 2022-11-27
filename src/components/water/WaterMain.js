import React, { useState, useEffect } from "react";
import "../../css/WaterMain.css";
// import Chart from "../Chart";
import { Chart } from "react-google-charts";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";

function WaterMain(props) {
  const [timeTypes, setTimeTypes] = useState([
    { name: "Last week", index: 0 },
    { name: "Last month", index: 1 },
    { name: "Last year", index: 2 },
  ]);
  const [timeType, setTimeType] = useState(0);
  const [dataApi, setDataApi] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/test/waterintake/lastweek", {
      method: "GET", // or 'PUT',

      headers: {
        accept: "text/html,application/json",
        Connection: "keep - alive",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        setDataApi(json);
      });
  }, []);

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
    </div>
  );
}

export default WaterMain;
