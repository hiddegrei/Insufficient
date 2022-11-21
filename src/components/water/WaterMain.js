import React from "react";
import "../../css/WaterMain.css";
import Chart from "../Chart";

function WaterMain(props) {
  return (
    <div className="water">
      <div className="water__header">
        <h1>Water</h1>
      </div>
      <Chart />
    </div>
  );
}

export default WaterMain;
