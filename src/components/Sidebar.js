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
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import InvertColorsIcon from "@mui/icons-material/InvertColors";

function Sidebar() {
  var getUrl = window.location;
  const [{ user, profile, handle, windowstate }, dispatch] = useStateValue();
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);

  const [act, setAct] = useState(false);
  const [explore1, setExplore1] = useState(false);
  const [follow1, setFollow1] = useState(false);
  const [profile1, setProfile1] = useState(false);
  const [chat1, setChat1] = useState(false);
  const [notifi1, setNotifi1] = useState(false);
  const [notiCounter, setNotiCounter] = useState([]);
  const [notify, setNotify] = useState(false);

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
    if (profile.username != "undefined") {
      if (getUrl.href == "https://socialhit.nl/explore") {
        setExplore1(true);
      } else {
        setExplore1(false);
      }
      if (getUrl.href == "https://socialhit.nl/") {
        setFollow1(true);
      } else {
        setFollow1(false);
      }
      if (getUrl.href == "https://socialhit.nl/chat") {
        setChat1(true);
      } else {
        setChat1(false);
      }
      if (getUrl.href == `https://socialhit.nl/profile/${profile.username}`) {
        setProfile1(true);
      } else {
        setProfile1(false);
      }
      if (getUrl.href == "https://socialhit.nl/notifications") {
        setNotifi1(true);
      } else {
        setNotifi1(false);
      }
    } else {
      console.log("no profile");
    }
  }, [getUrl.href, user]);
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
    <div className="sidebar">
      <Link to="/">
        <img className="header__logo" src="https://firebasestorage.googleapis.com/v0/b/insufficient-8211b.appspot.com/o/WaterdropLogo_NB.png?alt=media&token=136f050a-8947-4d0d-b783-2d3188103736"></img>
        {/* <TwitterIcon className="sidebar__twitterIcon" /> */}
      </Link>
      <Link to="/">{follow1 ? <SidebarOption active Icon={HomeIcon} text="Following" /> : <SidebarOption Icon={HomeIcon} text="Following" />}</Link>

      <Link to="/explore">{explore1 ? <SidebarOption active Icon={SearchIcon} text="Explore" /> : <SidebarOption Icon={SearchIcon} text="Explore" />}</Link>
      <Link to="/notifications">{notify ? <div>{notifi1 ? <SidebarOption active alert Icon={notify ? NotificationsActiveIcon : NotificationsIcon} text="Notifications" /> : <SidebarOption Icon={notify ? NotificationsActiveIcon : NotificationsIcon} text="Notifications" />}</div> : <div>{notifi1 ? <SidebarOption active Icon={NotificationsIcon} text="Notifications" /> : <SidebarOption Icon={notify ? NotificationsActiveIcon : NotificationsIcon} text="Notifications" />}</div>}</Link>
      <Link to="/chat">{chat1 ? <SidebarOption Icon={MailOutlineIcon} active text="Chat" /> : <SidebarOption Icon={MailOutlineIcon} text="Chat" />}</Link>
      <Link to="/water">{profile1 ? <SidebarOption Icon={InvertColorsIcon} active text="Water" /> : <SidebarOption Icon={InvertColorsIcon} text="Water" />}</Link>
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
                  onClick={() => {
                    click ? setClick(false) : setClick(true);
                  }}
                  src={profile.imageUrl}
                  className="profile__aa"
                />
              ) : (
                <img
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
