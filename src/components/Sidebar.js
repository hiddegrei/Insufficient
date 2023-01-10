import React, { useEffect, useState } from "react";
import "../css/Sidebar.css";
import TwitterIcon from "@material-ui/icons/Twitter";
import SidebarOption from "./SidebarOption";
import HomeIcon from "@material-ui/icons/Home";
import SearchIcon from "@material-ui/icons/Search";
import { Avatar, Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import { useStateValue } from "../Stateprovider";
import { db, auth } from "../firebase";
import TweetBox from "./TweetBox";
import { useParams } from "react-router-dom";
import NotificationsIcon from "@material-ui/icons/Notifications";
import EmojiFoodBeverageRoundedIcon from "@material-ui/icons/EmojiFoodBeverageRounded";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import InvertColorsIcon from "@mui/icons-material/InvertColors";
import GroupsIcon from "@mui/icons-material/Groups";

function Sidebar() {
  var getUrl = window.location.pathname;
  const [{ user, profile, handle, windowstate }, dispatch] = useStateValue();
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);

  const [act, setAct] = useState(false);
  const [explore1, setExplore1] = useState(false);
  const [follow1, setFollow1] = useState(false);
  const [profile1, setProfile1] = useState(false);
  const [dailyCalc1, setDailyCalc1] = useState(false);
  const [notifi1, setNotifi1] = useState(false);
  const [notiCounter, setNotiCounter] = useState([]);
  const [notify, setNotify] = useState(false);
  const [water, setWater] = useState(false);
  const [group, setGroup] = useState(false);

  useEffect(() => {
    let isSubscribed = true;

    if (profile.username !== undefined) {
      setNotiCounter([]);
      db.collection("users")
        .doc(profile.username)
        .collection("notifications")
        .where("seen", "==", false)
        .onSnapshot((snapshot) => (isSubscribed ? setNotiCounter(snapshot.docs.map((doc) => doc.id)) : null));
      if (notiCounter.length > 0) {
        setNotify(true);
      } else {
        setNotify(false);
      }
    }
    return () => (isSubscribed = false);
  }, [user, profile]);

  useEffect(() => {
    console.log(getUrl)
    if (profile.username != "undefined") {
      if (getUrl == "/explore") {
        setExplore1(true);
      } else {
        setExplore1(false);
      }
      if (getUrl == "/") {
        setFollow1(true);
      } else {
        setFollow1(false);
      }
      if (getUrl == "/dailyCalc") {
        setDailyCalc1(true);
      } else {
        setDailyCalc1(false);
      }
      if (getUrl == `/profile/${profile.username}`) {
        setProfile1(true);
      } else {
        setProfile1(false);
      }
      if (getUrl == "/notifications") {
        setNotifi1(true);
      } else {
        setNotifi1(false);
      }
      if (getUrl == "/water") {
        setWater(true);
      } else {
        setWater(false);
      }
      if (getUrl == "/groups") {
        setGroup(true);
      } else {
        setGroup(false);
      }
    } else {
      console.log("no profile");
    }
  }, [getUrl, user]);
  //console.log(getUrl.href)

  const handletweet = (e) => {
    e.preventDefault();

    if (windowstate) {
      // setOpen(false)
      dispatch({ type: "CLOSE__WINDOW" });
    }
    if (!windowstate) {
      // setOpen(true)
      dispatch({ type: "OPEN__WINDOW" });
    }
  };

  const handleAuth = () => {
    if (user) {
      auth.signOut();
    }
  };

  return (
    <div className="sidebar app_comp">
      <Link to="/">
        <img alt="" className="header__logo" src="https://firebasestorage.googleapis.com/v0/b/insufficient-8211b.appspot.com/o/WaterdropLogo_NB.png?alt=media&token=136f050a-8947-4d0d-b783-2d3188103736"></img>
        {/* <TwitterIcon className="sidebar__twitterIcon" /> */}
      </Link>
      <Link to="/">{water ? <SidebarOption Icon={InvertColorsIcon} active text="Water" /> : <SidebarOption Icon={InvertColorsIcon} text="Water" />}</Link>

      <Link to="/explore">{explore1 ? <SidebarOption active Icon={SearchIcon} text="Explore" /> : <SidebarOption Icon={SearchIcon} text="Explore" />}</Link>
      <Link to="/notifications">{notify ? <div>{notifi1 ? <SidebarOption active alert Icon={notify ? NotificationsActiveIcon : NotificationsIcon} text="Notifications" /> : <SidebarOption Icon={notify ? NotificationsActiveIcon : NotificationsIcon} text="Notifications" />}</div> : <div>{notifi1 ? <SidebarOption active Icon={NotificationsIcon} text="Notifications" /> : <SidebarOption Icon={notify ? NotificationsActiveIcon : NotificationsIcon} text="Notifications" />}</div>}</Link>
      <Link to="/chat">{dailyCalc1 ? <SidebarOption Icon={EmojiFoodBeverageRoundedIcon} active text="Chat" /> : <SidebarOption Icon={EmojiFoodBeverageRoundedIcon} text="Chat" />}</Link>
      <Link to="/groups">{group ? <SidebarOption Icon={InvertColorsIcon} active text="Groups" /> : <SidebarOption Icon={GroupsIcon} text="Groups" />}</Link>

      <Link to={`/profile/${profile?.username}`}>{profile1 ? <SidebarOption Icon={AccountCircleIcon} active text="Profile" /> : <SidebarOption Icon={AccountCircleIcon} text="Profile" />}</Link>

      {/* <Link to="/games">
        
    
    <SidebarOption text="Games" />
    
    </Link> */}

      <Button onClick={handletweet} variant="outlined" className="sidebar__tweet" fullWidth>
        Post
      </Button>

      <div className="profile">
        <h1>{user ? `Hello ${profile?.username}` : "Hello Guest"}</h1>
        {user ? (
          <Link to={`/profile/${profile?.username}`}>
            {/* <Avatar onClick={()=>{click?setClick(false):setClick(true)}} src={profile.imageUrl}></Avatar> */}
            {
              profile.imageUrl ? (
                <img
                  alt=""
                  onClick={() => {
                    click ? setClick(false) : setClick(true);
                  }}
                  src={profile.imageUrl}
                  className="profile__aa"
                />
              ) : (
                <img
                  alt=""
                  onClick={() => {
                    click ? setClick(false) : setClick(true);
                  }}
                  src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
                  className="profile__aa"
                />
              )
              // <Avatar onClick={()=>{click?setClick(false):setClick(true)}} src=''></Avatar>
            }
          </Link>
        ) : (
          <div></div>
        )}
        <Link to="/login">
          <h3 className="profile__link" onClick={handleAuth}>
            {user ? "Sign out" : "Sign in"}
          </h3>
        </Link>
      </div>
      {user && windowstate ? (
        <div className="open">
          <TweetBox sidebar />
        </div>
      ) : (
        <div></div>
      )}
      {!user ? <div>Please Sign In to post</div> : <div></div>}
    </div>
  );
}

export default Sidebar;
