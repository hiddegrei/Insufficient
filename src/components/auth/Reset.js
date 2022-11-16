import React, { useEffect, useState } from "react";
import "../../css/Reset.css";
import { Link, useHistory } from "react-router-dom";
import { db, auth, storage } from "../../firebase";
import { useStateValue } from "../../Stateprovider";

function Reset() {
  const [{ profile }, dispatch] = useStateValue();

  const handleReset = (e) => {
    e.preventDefault();

    auth
      .sendPasswordResetEmail(profile.email)
      .then(function () {})
      .catch(function (error) {
        // An error happened.
      });
  };
  return (
    <div className="reset">
      <Link to="/">
        <img className="header__logo" id="myimg" src="https://firebasestorage.googleapis.com/v0/b/twitterclone-6c140.appspot.com/o/socialHit.jpg.jpg?alt=media&token=421646ee-5d89-4c89-8eab-57d3c88174f6"></img>
        {/* <img className="header__logo" src=""></img> */}
      </Link>
      <div className="reset__container">
        <h1>Reset Password</h1>
      </div>
    </div>
  );
}

export default Reset;
