import React, { useState, useEffect } from "react";
import BluetoothTerminal from "./js/BluetoothTerminal.js"

function WaterSensor(props) {


    useEffect(()=>{
        const terminal = new BluetoothTerminal();

// Override `receive` method to log incoming data to the terminal.
terminal.receive = function(waterOutput) {
 
  console.log(waterOutput);
  
};
       

    },[])


    return(
        <div>
            <div className="app">

<div className="toolbar">

    <div id="device-name" className="name">Terminal</div>

    <div className="buttons">

        <button id="connect" type="button" aria-label="Connect">
            <i className="material-icons">bluetooth_connected</i>
        </button>

        <button id="disconnect" type="button" aria-label="Disconnect">
            <i className="material-icons">bluetooth_disabled</i>
        </button>

    </div>

</div>

<div id="terminal" className="terminal"></div>



</div>
        </div>
    )


}
export default WaterSensor;