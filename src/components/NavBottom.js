import React,{useEffect,useState} from 'react';
import HomeIcon from "@material-ui/icons/Home";
import GroupsIcon from "@mui/icons-material/Groups";
import InvertColorsIcon from "@mui/icons-material/InvertColors";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { v4 as uuidv4 } from "uuid";
import { useStateValue } from "../Stateprovider";
import { useHistory } from "react-router-dom";
import "../css/NavBottom.css";
import ExploreIcon from "@mui/icons-material/Explore";
function NavBottom(props) {
  const history=useHistory()
     const [{ profile }, dispatch] = useStateValue();
    const [items, setItems] = useState([
      { title: "/", icon: <InvertColorsIcon />, active: true },
      { title: "/explore", icon: <ExploreIcon />, active: false },
      { title: "/groups", icon: <GroupsIcon />, active: false },
      { title: `/profile/${profile?.username}`, icon: <AccountCircleIcon />, active: false },
    ]);
    return (
      <div className="nav app_navB">
        {items.map((doc, index) => (
          <div
            key={uuidv4()}
            onClick={() => {
              if (index === 3) {
                history.push(`/profile/${profile?.username}`);
              } else {
                history.push(doc.title);
              }
              let arr=[...items]
             
              arr[0].active=false
              arr[1].active = false;
              arr[2].active = false;
              arr[3].active = false;
               arr[index].active = true;
              setItems(arr)
            }}
            className={`nav_item ${doc.active&&"nav_item_active"}`}
          >
            {doc.icon}

            {/* <div>{doc.title}</div> */}
          </div>
        ))}
      </div>
    );
}

export default NavBottom;