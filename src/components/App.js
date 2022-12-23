import React, { useEffect, useState, Component } from "react";
import Sidebar from "./Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/App.css";
import "../css/Login.css";
import Feed from "./Feed";
import Widgets from "./Widgets";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./auth/Login";
import { auth } from "../firebase";
import { useStateValue } from "../Stateprovider";
import Profile from "./profile/Profile";
import Explore from "./Explore";
import DailyIntakePage from "./DailyIntakePage";
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
      <div className="app">
        <Switch>
          <Route path="/messages/:roomId">
            <Sidebar />
            <Chat />
            <Widgets />
            <NavBottom />
          </Route>

          <Route path="/exchange_token">
            <Sidebar />
            <StravaMain />
            <Widgets />
            <NavBottom />
          </Route>

          <Route path="/post/:nam/:tok">
            <Sidebar />
            <PostPop />
            <Widgets />
            <NavBottom />
          </Route>

          <Route path="/home">
            <Sidebar />
            <Home />
            <Widgets />
            <NavBottom />
          </Route>

          <Route path="/addnewchat">
            <Sidebar />
            <AddnewChat />
            <Widgets />
            <NavBottom />
          </Route>

          <Route path="/notifications">
            <Sidebar />
            <Notifications />
            <Widgets />
            <NavBottom />
          </Route>

          <Route path="/water">
            <Sidebar />
            <WaterMain />
            <Widgets />
            <NavBottom />
            <NavBottom />
          </Route>

          <Route path="/groups">
            <Sidebar />
            <GroupMain />
            <Widgets />
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
            <Sidebar />
            <Followers />
            <Widgets />
            <NavBottom />
          </Route>

          <Route path="/profile/following/:pName">
            <Sidebar />
            <Following />
            <Widgets />
            <NavBottom />
          </Route>

          <Route path="/profile/:pName/edit">
            <Sidebar />
            <EditProfile />
            <Widgets />
            <NavBottom />
          </Route>

          <Route path="/profile/:pName">
            <Sidebar />
            <ProfileMain />
            <Widgets />
            <NavBottom />
          </Route>

          <Route path="/explore">
            <Sidebar />
            <Explore />
            <Widgets />
            <NavBottom />
          </Route>

          <Route path="/daily-intake">
            <Sidebar />
            <DailyIntakePage />
            <Widgets />
            <NavBottom />
          </Route>

          {/* <Route path="/games">
        <Sidebar />
        <Games />
        <Widgets/>
        </Route> */}

          <Route path="/">
            <Sidebar />
            <Feed />
            <Widgets />
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
