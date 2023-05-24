import React,{useEffect,useState} from 'react';
import "../../css/StravaRecord.css";
import { db } from '../../firebase';
import { useStateValue } from "../../Stateprovider";

function StravaRecord({data,name}) {
    const [{ profile }, dispatch] = useStateValue();
    const [show,setShow]=useState(false)
    useEffect(()=>{
       
    },[profile])
    return (
        <div className="record">
            <h4>{name}</h4>
            {data.map((doc,index)=>(
          <div className='record_elm' onClick={()=>window.open(`https://www.strava.com/activities/${doc.id}`)}>{index} :{doc.value}</div>
        ))}
           
           
        </div>
    );
}

export default StravaRecord;