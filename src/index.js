import React from "react";
import ReactDOM from "react-dom";
import "./css/index.css";
import App from "./components/App";
import App2 from "./components/App2";
import { StateProvider } from "./Stateprovider";
import reducer, { initialState } from "./reducer";

ReactDOM.render(
  <React.StrictMode>
    <StateProvider initialState={initialState} reducer={reducer}>


      {/* {window.innerWidth>=800?<StateProvider initialState={initialState} reducer={reducer}><App/> </StateProvider>:
   <StateProvider initialState={initialState} reducer={reducer}><App2/> </StateProvider>} */}
      <App />
      <App2 />

    </StateProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// ,
//   "eslintConfig": {
//     "extends": [
//       "react-app",
//       "react-app/jest"
//     ]
//   }