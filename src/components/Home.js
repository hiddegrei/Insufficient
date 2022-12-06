import React from "react";
import { useStateValue } from "../Stateprovider";
import { Avatar, IconButton } from "@material-ui/core";
import "../css/Home.css";
function Home(props) {
  const [{ user, profile, handle }, dispatch] = useStateValue();
  return (
    <div className="home">
      <div className="home__header">
        <h1>Home</h1>
      </div>
      <div className="home_top">{profile.imageUrl ? <img alt="" src={profile.imageUrl} className="home_profile" /> : <Avatar className="home_profile" src="" />}</div>
      <div className="home_middle">
        <img className="home_middle_img" alt="" src="https://firebasestorage.googleapis.com/v0/b/insufficient-8211b.appspot.com/o/Screenshot%202022-11-23%20113531.png?alt=media&token=c6ff1f02-4787-4cc5-b978-155c85c391f3"></img>
        <div className="home_middle_r">75% done</div>
      </div>
      <div className="home_bottom">
        <div className="home_bottom_row">
          <div className="home_bottom_row_elm">Friend</div>
          <div className="home_bottom_row_elm">Streak</div>
          <div className="home_bottom_row_elm">Amount</div>
          <div className="home_bottom_row_elm">Percentage</div>
        </div>
      </div>
    </div>
  );
}

export default Home;
