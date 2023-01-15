import React, { useState, useEffect } from "react";
import BluetoothTerminal from "./js/BluetoothTerminal.js";
import BluetoothIcon from '@mui/icons-material/Bluetooth';
import BluetoothDisabledIcon from '@mui/icons-material/BluetoothDisabled';

function WaterSensor({addWater}) {


    useEffect(()=>{
        const deviceNameLabel = document.getElementById("device-name");
        const connectButton = document.getElementById("connect");
        const disconnectButton = document.getElementById("disconnect");
        
        
        // Helpers.
        const defaultDeviceName = "Terminal";
        

       

        

        // Obtain configured instance.
        const terminal = new BluetoothTerminal();

        // Override `receive` method to log incoming data to the terminal.
        terminal.receive = function (waterOutput) {
          
          console.log(waterOutput);
          // addWater()
          return waterOutput;
        };

        // // Override default log method to output messages to the terminal and console.
        // terminal._log = function(...messages) {
        //   // We can't use `super._log()` here.
        //   messages.forEach((message) => {
        //     logToTerminal(message);
        //     console.log(message); // eslint-disable-line no-console
        //   });
        // };

        // // Implement own send function to log outcoming data to the terminal.
        // const send = (data) => {
        //   terminal.send(data).
        //       then(() => logToTerminal(data, 'out')).
        //       catch((error) => logToTerminal(error));
        // };

        // Bind event listeners to the UI elements.
        connectButton.addEventListener("click", () => {
          terminal.connect().then(() => {
            deviceNameLabel.textContent = terminal.getDeviceName() ? terminal.getDeviceName() : defaultDeviceName;
          });
        });

        disconnectButton.addEventListener("click", () => {
          terminal.disconnect();
          deviceNameLabel.textContent = defaultDeviceName;
        });

        // sendForm.addEventListener("submit", (event) => {
        //   event.preventDefault();

        //   terminal.send(inputField.value);

        //   inputField.value = "";
        //   inputField.focus();
        // });

        // Switch terminal auto scrolling if it scrolls out of bottom.
        

       

    })


    return(
        <div>
            <div className="app">

<div className="toolbar">

    

    <div className="buttons">

       
           <BluetoothIcon id="connect"/>
  

        
            <BluetoothDisabledIcon id="disconnect"/>
        

    </div>

</div>

<div id="terminal" className="terminal"></div>



</div>
        </div>
    )


}
export default WaterSensor;