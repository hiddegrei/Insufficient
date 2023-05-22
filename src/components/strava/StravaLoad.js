import React, { useState, useEffect } from "react";
import "../../css/Profile.css";
import { useStateValue } from "../../Stateprovider";
import { Avatar, IconButton } from "@material-ui/core";
import { db } from "../../firebase";
import EditIcon from "@material-ui/icons/Edit";
import { Link, useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import Post from "../post/Post";
import firebase from "firebase";
import EmailOutlinedIcon from "@material-ui/icons/EmailOutlined";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";

function StravaLoad() {
  const { pName } = useParams();
  const history = useHistory();

  const [{ user, profile, handle }, dispatch] = useStateValue();


  const [stravaData, setStravaData] = useState([]);
  const [page,setPage]=useState(1);
  const [start,setStart]=useState(false);
  const [loaded,setLoaded]=useState(0);
  const [reload,setReload]=useState(false);
  const [inQue,setInQue]=useState(0);

  const [oneMinRec,setOneMinRec]=useState([
    {value:0,id:0},
    {value:0,id:0},
    {value:0,id:0},
    {value:0,id:0},
    {value:0,id:0}
  ])
  const [twoMinRec,setTwoMinRec]=useState([
    {value:0,id:0},
    {value:0,id:0},
    {value:0,id:0},
    {value:0,id:0},
    {value:0,id:0}
  ])

  useEffect(()=>{
    db.collection("users").doc(profile?.username).collection("records").doc("oneMin").get().then((doc)=>{
        if(doc.exists){
            setOneMinRec(doc.data())
        }

    })
  },[])

  
  useEffect(() => {
    if(start){
    fetch(`https://us-central1-ms-strava.cloudfunctions.net/app/api/users/${profile?.username}/activities/${page}`,
      {
        method: "GET", // or 'PUT'
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
         "Access-Control-Allow-Origin":"no-cors"
        }
      }
    )
      .then((res) => res.json())
      .then((json) => {
        console.log(json.data);

        if(json.data.message==undefined){
          console.log('hi')
          setInQue(json.data.length)
          setStravaData(json.data);
          
          startLoading(json.data)

        }
        
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }, [start,page]);

  useEffect(()=>{
    // if(loaded>=inQue&&inQue!=0){
    //     console.log("hi")
    //     setPage(page+1)
    //     setLoaded(0)
    //     setInQue(0)
        
    // }
  },[loaded,reload])

  async function startLoading(data){
    let loaded1=0
    for(let i=0;i<data.length;i++){
        let result=await handleStravaClick(data[i].id)
        loaded1++

    }
    setLoaded(loaded1)
  }

  

  async function handleStravaClick(id){
    console.log(id)
    db.collection("users").doc(profile?.username).collection("activities").doc(`${id}`).get().then((doc)=>{
        if(!doc.exists){
    fetch(`https://us-central1-ms-strava.cloudfunctions.net/app/api/users/${profile?.username}/activities/${id}/streams`, {
           method: "GET", // or 'PUT'
           headers: {
             "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
           },
          
         })
           .then((res) => res.json())
           .then((json) => {
            
            
             if(JSON.stringify(json) != '{}'){
                calcEverything(json,id)
                

             }else{
                console.log("hi")
             }
            
                
             
           }).then((doc)=>{
            return true
           })
        }})
          
  }
  function calcRec(oneMin,id,arr){
    let newOneMinRec=[...arr]
     for(let i=0;i<5;i++){
        if(oneMin>=newOneMinRec[i].value){
            
            for(let j=i;j<5;j++){
                if(j+1<5){
                    newOneMinRec[j+1].value=newOneMinRec[j].value
                newOneMinRec[j+1].id=newOneMinRec[j].id

                }
                

            }
            newOneMinRec[i].value=oneMin
            newOneMinRec[i].id=id
           
           
            break;

        }
     }
     return newOneMinRec

  }
  async function calcEverything(json,idd){
  
   if(json.data.watts!=undefined){

   
    let oneMin=await calc1min(json.data.watts.data)
    let twoMin=await calc2min(json.data.watts.data)
   
    let newOneArr= calcRec(oneMin,idd,oneMinRec)
    let newTwoArr= calcRec(twoMin,idd,twoMinRec)
    setOneMinRec(newOneArr)
    setTwoMinRec(newTwoArr)
    
     db.collection("users").doc(profile?.username).collection("records").doc("oneMin").set({peaks:newOneArr})
     
    
        db.collection("users").doc(profile?.username).collection("activities").doc(`${idd}`).set({
          oneMin:oneMin,
          twoMin:twoMin
        }).then((doc)=>{
            console.log("added to database")
           
        })

      
    }
  }

  async function calc1min(watts){
    let record=0;
    for(let i=0;i<watts.length;i++){
      let temp=0;
      for(let j=i;j<i+60;j++){
        temp+=watts[j]}
      if(temp/60>record){
        record=temp/60;}}
     return Math.round(record);
  }
  async function calc2min(watts){
    let record=0;
    for(let i=0;i<watts.length;i++){
      let temp=0;
      let theEnd=watts.length-i
      if(theEnd>=120){
        for(let j=i;j<i+120;j++){
        temp+=watts[j]}
      if(temp/120>record){
        record=temp/120;}}
      }
     return Math.round(record);
  }
  async function calc5min(watts){
    let record=0;
    for(let i=0;i<watts.length;i++){
      let temp=0;
      let theEnd=watts.length-i
      if(theEnd>=300){
        for(let j=i;j<i+300;j++){
        temp+=watts[j]}
      if(temp/300>record){
        record=temp/300;}}
      }
     return Math.round(record);
  }

  return (
    <div style={{width:"100%",alignContent:"center"}}>
      
        <div style={{border:"1px solid black"}} onClick={()=>setStart(!start)}>
           {start?"started":"not started"}
        </div>

        <div >
           {page}
        </div>

        <div>loaded: {loaded}/{inQue}</div>

        <div onClick={()=>setReload(!reload)}>
           reload
        </div>

        <div>
            {oneMinRec.map((doc)=>(
                <div onClick={(e)=>{
                    e.stopPropagation()
                    window.open(`https://www.strava.com/activities/${doc.id}`)}}>{doc.value}</div>
            ))}
        </div>
      
    </div>
  );
}

export default StravaLoad;