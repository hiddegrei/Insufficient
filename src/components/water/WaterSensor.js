import React, { useState, useEffect } from "react";
import BluetoothTerminal from "./js/BluetoothTerminal.js"

function WaterSensor(props) {


    useEffect(()=>{
        const deviceNameLabel = document.getElementById("device-name");
        const connectButton = document.getElementById("connect");
        const disconnectButton = document.getElementById("disconnect");
        const terminalContainer = document.getElementById("terminal");
        const sendForm = document.getElementById("send-form");
        const inputField = document.getElementById("input");

        // Helpers.
        const defaultDeviceName = "Terminal";
        const terminalAutoScrollingLimit = terminalContainer.offsetHeight / 2;
        let isTerminalAutoScrolling = true;
        let waterOutput = 0;

        const scrollElement = (element) => {
          const scrollTop = element.scrollHeight - element.offsetHeight;

          if (scrollTop > 0) {
            element.scrollTop = scrollTop;
          }
        };

        const logToTerminal = (message, type = "") => {
          terminalContainer.insertAdjacentHTML("beforeend", `<div${type && ` class="${type}"`}>${message}</div>`);

          if (isTerminalAutoScrolling) {
            scrollElement(terminalContainer);
          }
        };

        // Obtain configured instance.
        const terminal = new BluetoothTerminal();

        // Override `receive` method to log incoming data to the terminal.
        terminal.receive = function (waterOutput) {
          logToTerminal(waterOutput, "in");
          console.log(waterOutput);
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
        terminalContainer.addEventListener("scroll", () => {
          const scrollTopOffset = terminalContainer.scrollHeight - terminalContainer.offsetHeight - terminalAutoScrollingLimit;

          isTerminalAutoScrolling = scrollTopOffset < terminalContainer.scrollTop;
        });

       

    })


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