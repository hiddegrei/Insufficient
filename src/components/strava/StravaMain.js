import React,{useEffect,useState} from 'react';
import "../../css/StravaMain.css";
import { db } from '../../firebase';
import { useStateValue } from "../../Stateprovider";

function StravaMain(props) {
    const [{ profile }, dispatch] = useStateValue();
    const [show,setShow]=useState(false)
    useEffect(()=>{
         let path = window.location.search;

         let code1 = path.split("&");
         let code2 = code1[1].split("=");
         let code = code2[1];
         let scopes = code1[2];
         
         if(profile?.username){
            var details = {
              code:code
            };
            var formBody = [];
            for (var property in details) {
              var encodedKey = encodeURIComponent(property);
              var encodedValue = encodeURIComponent(details[property]);
              formBody.push(encodedKey + "=" + encodedValue);
            }
            formBody = formBody.join("&");

         fetch(`https://us-central1-ms-strava.cloudfunctions.net/app/api/users/${profile?.username}/token/auth`, {
           method: "POST", // or 'PUT'
           headers: {
             "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
           },
           body: formBody,
         })
           .then((res) => res.json())
           .then((json) => {
             console.log(json);
             setShow(true)
             db.collection("users").doc(profile?.username).update({
                strava:true
             })
                
             
           })
           .catch((err) => {
             console.log(err);
           });
        }
    },[profile])
    return (
        <div className="strava">
            <div className="strava__header">
        <h1>Strava</h1>
      </div>
      <div className='strava_succes'>
        Strava is connected
      </div>
            
        </div>
    );
}

export default StravaMain;