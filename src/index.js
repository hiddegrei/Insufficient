import React from "react";
import ReactDOM from "react-dom";
import "./css/index.css";
import App from "./components/App";

import { StateProvider } from "./Stateprovider";
import reducer, { initialState } from "./reducer";

ReactDOM.render(
  <React.StrictMode>
    <StateProvider initialState={initialState} reducer={reducer}>

     
      <App />


    </StateProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
