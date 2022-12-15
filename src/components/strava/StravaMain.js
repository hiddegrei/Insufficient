import React,{useEffect,useState} from 'react';
import "../../css/StravaMain.css";

function StravaMain(props) {
    useEffect(()=>{
         let path = window.location.search;

         let code1 = path.split("&");
         let code2 = code1[1].split("=");
         let code = code2[1];
         let scopes = code1[2];
    },[])
    return (
        <div className="strava">
            <div className="strava__header">
        <h1>Strava</h1>
      </div>
            
        </div>
    );
}

export default StravaMain;