import React, { useEffect, useState } from "react";
import "../../css/ForgotPassword.css";
import { Link, useHistory } from "react-router-dom";
import { db, auth, storage } from "../../firebase";
import { useStateValue } from "../../Stateprovider";


function ForgotPassword() {
  const history = useHistory();
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
      <Link to="/" className="header_logo_link">
        <img className="header__logo" src="https://firebasestorage.googleapis.com/v0/b/insufficient-8211b.appspot.com/o/WaterdropLogo_NB.png?alt=media&token=136f050a-8947-4d0d-b783-2d3188103736"></img>
      </Link>
      <div className="login__container rounded-5">
        <h6 id="reset">Reset Password</h6>
        <form>
          <h5>Email</h5>
          <input onChange={(e) => setEmail(e.target.value)} value={email} type="text"></input>
          {email && (
            <button type="submit" onClick={handleReset} className="forgot__forgotpasswordbutton">
              Send Reset Mail
            </button>
          )}
        </form>
        <button id="back_button" type="submit" onClick={() => history.push("/login")} className="btn btn-info login__registerButton rounded-5">

          Back
        </button>
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
