import React,{useEffect,useState} from "react";
import "../../css/Group.css";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import {useHistory} from "react-router-dom";

function Group({group}) {
  const history=useHistory()
  const [data,setData]=useState([])

  useEffect(()=>{
    console.log(group)
    let arr=group.membersData;
    arr.sort(function (a, b) {
      var keyA = a.waterIntakeToday,
        keyB = b.waterIntakeToday;
      // Compare the 2 dates
      if (keyA < keyB) return 1;
      if (keyA > keyB) return -1;
      return 0;
    });
    setData(arr)


  },[])
  return (
    <div className="group2">
      <div className="group2_header">{group.data.groupName}</div>
      <div className="group2_con">
        {data.map((doc, index) => (
          <div key={index + 1200} className="group2_con_elm">
            <div className="group2_con_elm_rank">
              <EmojiEventsIcon className={`${index===0?"group_icon_g":""} ${index===1?"group_icon_s":""} ${index===0?"group_icon_b":""}`} /> {index + 1}
            </div>
            <div onClick={() => history.push(`/profile/${doc.name}`)} className="group2_con_elm_name">
              {doc.name}
            </div>
            <div className="group2_con_elm_water">{doc.waterIntakeToday} ml</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Group;
