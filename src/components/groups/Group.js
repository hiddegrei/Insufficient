import React,{useEffect,useState} from "react";
import "../../css/Group.css";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import {useHistory} from "react-router-dom";

function Group({group}) {
  const history=useHistory()

  useEffect(()=>{
    console.log(group)
  },[])
  return (
    <div className="group2">
      <div className="group2_header">{group.data.groupName}</div>
      <div className="group2_con">
        {group.membersData.map((doc,index) => (
          <div key={index+1200} className="group2_con_elm">
            <div className="group2_con_elm_rank">
              <EmojiEventsIcon /> {index+1}
            </div>
            <div onClick={()=>history.push(`/profile/${doc.name}`)} className="group2_con_elm_name">{doc.name}</div>
            <div className="group2_con_elm_water">{doc.waterIntakeToday} ml</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Group;
