import React, { useEffect, useState, Component } from "react";
import Sidebar from "./Sidebar";
import "../css/App.css";
import Feed from "./Feed";
import Widgets from "./Widgets";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./auth/Login";
import { auth } from "../firebase";
import { useStateValue } from "../Stateprovider";
import Profile from "./profile/Profile";
import Explore from "./Explore";
import ChatPage from "./ChatPage";
import Chat from "./Chat";
import Followers from "./Followers";
import Following from "./Following";
import EditProfile from "./profile/EditProfile";
import { db } from "../firebase";
import AddnewChat from "./AddnewChat";
import Notifications from "./Notifications";
import Register from "./auth/Register";
import ProfileMain from "./profile/ProfileMain";
import PostPop from "./post/PostPop";
import ForgotPassword from "./auth/ForgotPassword";
import Reset from "./auth/Reset";
import WaterMain from "./water/WaterMain";
import GroupMain from "./groups/GroupMain";
// import Games from "./Games"
import Home from "./Home";
import "bootstrap/dist/css/bootstrap.min.css";
import StravaMain from "./strava/StravaMain";
import NavBottom from "./NavBottom"

function App() {
  const [{ user, profile }, dispatch] = useStateValue();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let isSubscribed = true;
    if (isSubscribed) {
      auth.onAuthStateChanged((authUser) => {
        // console.log('the user is:',authUser);
        if (authUser) {
          setLoaded(true);
          dispatch({
            type: "SET_USER",
            user: authUser,
          });
        } else {
          setLoaded(true);
          dispatch({
            type: "SET_USER",
            user: null,
          });
        }
      });
    }
    return () => (isSubscribed = false);
  }, [user, profile]);

  useEffect(() => {
    if (user) {
      db.collection("users")
        .where("userId", "==", user.uid)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // console.log( doc.data());
            dispatch({
              type: "SET_PROFILE",
              profile: doc.data(),
            });
          });
        })
        .catch((error) => console.log(error));
    }
  }, [user]);

  if (!user && !loaded) {
    <div style={{ flex: 1, justifyContent: "center" }}>Loading..</div>;
  }

  return (
    <Router>
      <div className="app2">
        <Switch>
          <Route path="/messages/:roomId">
            <Chat />
            <NavBottom />
          </Route>

          <Route path="/exchange_token">
            <StravaMain />
            <NavBottom />
          </Route>

          <Route path="/post/:nam/:tok">
            <PostPop />
            <NavBottom />
          </Route>

          <Route path="/home">
            <Home />
            <NavBottom />
          </Route>

          <Route path="/addnewchat">
            <AddnewChat />
            <NavBottom />
          </Route>

          <Route path="/notifications">
            <Notifications />
            <NavBottom />
          </Route>

          <Route path="/water">
            <WaterMain />
            <NavBottom />
          </Route>

          <Route path="/groups">
            <GroupMain />
            <NavBottom />
          </Route>

          <Route exact path="/login">
            <Login />
          </Route>

          <Route exact path="/register">
            <Register />
          </Route>

          <Route exact path="/forgotpassword">
            <ForgotPassword />
          </Route>

          <Route path="/profile/followers/:pName">
            <Followers />
            <NavBottom />
          </Route>

          <Route path="/profile/following/:pName">
            <Following />
            <NavBottom />
          </Route>

          <Route path="/profile/:pName/edit">
            <EditProfile />
            <NavBottom />
          </Route>

          <Route path="/profile/:pName">
            <ProfileMain />
            <NavBottom />
          </Route>

          <Route path="/explore">
            <Explore />
            <NavBottom />
          </Route>

          <Route path="/chat">
            <ChatPage />
            <NavBottom />
          </Route>

          {/* <Route path="/games">
        
        <Games />
        <Widgets/>
        </Route> */}

          <Route path="/">
            <Feed mobile />
            <NavBottom />
          </Route>

          <Route path="/__/auth/action">
            <Reset />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
