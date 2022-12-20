import React,{useEffect,useState} from 'react';
import HomeIcon from "@material-ui/icons/Home";
import GroupsIcon from "@mui/icons-material/Groups";
import InvertColorsIcon from "@mui/icons-material/InvertColors";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { v4 as uuidv4 } from "uuid";
import { useStateValue } from "../Stateprovider";
import { useHistory } from "react-router-dom";
import "../css/NavBottom.css"
function NavBottom(props) {
  const history=useHistory()
     const [{ profile }, dispatch] = useStateValue();
    const [items, setItems] = useState([
      { title: "/explore", icon: <HomeIcon /> },
      { title: "/groups", icon: <GroupsIcon /> },
      { title: "/water", icon: <InvertColorsIcon /> },
      { title: `/profile/${profile?.username}`, icon: <AccountCircleIcon /> },
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
            }}
            className="nav_item"
          >
            {doc.icon}

            {/* <div>{doc.title}</div> */}
          </div>
        ))}
      </div>
    );
}

export default NavBottom;