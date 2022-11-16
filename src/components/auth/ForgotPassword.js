import React, { useEffect, useState } from "react";
import "../../css/ForgotPassword.css";
import { Link, useHistory } from "react-router-dom";
import { db, auth, storage } from "../../firebase";
import { useStateValue } from "../../Stateprovider";

function ForgotPassword() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        setOpen(false);
      }, 3000);
    }
  }, [open]);

  const handleReset = (e) => {
    e.preventDefault();

    auth
      .sendPasswordResetEmail(email)
      .then(function () {
        setOpen(true);
      })
      .catch(function (error) {
        alert(error);
      });
  };
  return (
    <div className="login">
      <Link to="/">
        <img className="header__logo" id="myimg" src="https://firebasestorage.googleapis.com/v0/b/twitterclone-6c140.appspot.com/o/socialHit.jpg.jpg?alt=media&token=421646ee-5d89-4c89-8eab-57d3c88174f6"></img>
        {/* <img className="header__logo" src=""></img> */}
      </Link>
      <div className="login__container">
        <h1>Reset Password</h1>
        <form>
          <h5>Email</h5>
          <input onChange={(e) => setEmail(e.target.value)} value={email} type="text"></input>
          {email && (
            <button type="submit" onClick={handleReset} className="forgot__forgotpasswordbutton">
              Send Reset Mail
            </button>
          )}
        </form>
      </div>

      {open && (
        <div className="login__popup">
          <h1>Reset Mail send!</h1>
        </div>
      )}
    </div>
  );
}

export default ForgotPassword;
