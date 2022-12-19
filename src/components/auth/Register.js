import React, { useState, useEffect } from "react";
import "../../css/Login.css";
import { Link, useHistory } from "react-router-dom";
import { db, auth, storage } from "../../firebase";
import { useStateValue } from "../../Stateprovider";

function Register() {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [{ user, handle }, dispatch] = useStateValue();
  const [open, setOpen] = useState(false);

  const register = (e) => {
    e.preventDefault();

    var newemail = email.replace(/\s+/g, "");

    if (username && username != "undefined") {
      db.collection("users")
        .where("username", "==", username)
        .get()
        .then((doc) => {
          if (doc.exists) {
            return alert(username + ":this username is already taken");
          } else {
            auth
              .createUserWithEmailAndPassword(newemail, password)
              .then((userCredential) => {
                // Signed in
                var newuser = userCredential.user;

                db.collection("users").doc(username).set({
                  username: username,
                  email: newuser.email,
                  userId: newuser.uid,
                  imageUrl: "",
                  bio: "",
                  streak: 0,
                });

                fetch(`https://ms-waterintake.web.app/api/users/${username}/create`, {
                  method: "POST", // or 'PUT',

                  headers: {
                    accept: "text/html,application/json",
                    Connection: "keep - alive",
                  },
                })
                  .then((res) => res.json())
                  .then((json) => {
                    console.log(json);
                  });

                db.collection("users")
                  .doc(username)
                  .collection("followingNUM")
                  .doc(username)
                  .set({
                    following: 0,
                  })
                  .catch((error) => alert(error.message));
                db.collection("users")
                  .doc(username)
                  .collection("followersNUM")
                  .doc(username)
                  .set({
                    followers: 0,
                  })
                  .catch((error) => alert(error.message));

                newuser
                  .sendEmailVerification()
                  .then(function () {})
                  .catch(function (error) {
                    // An error happened.
                  });

                setEmail("");
                setUsername("");
                setPassword("");
              })
              .then((auth) => {
                setOpen(true);
              })
              .catch((error) => alert(error.message));
          }
        });
    } else {
      alert("please enter username");
    }
  };

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        setOpen(false);
      }, 3000);
    }
  }, [open]);
  return (
    <div className="login">
      <Link to="/">
        <img className="header__logo" src="https://firebasestorage.googleapis.com/v0/b/insufficient-8211b.appspot.com/o/WaterdropLogo_NB.png?alt=media&token=136f050a-8947-4d0d-b783-2d3188103736"></img>
      </Link>
      <div className="login__container rounded-5">
        <form>
          <h5>Username</h5>
          <input onChange={(e) => setUsername(e.target.value)} value={username} type="text"></input>

          <h5>Email</h5>
          <input onChange={(e) => setEmail(e.target.value)} value={email} type="text"></input>

          <h5>Password</h5>
          <input onChange={(e) => setPassword(e.target.value)} value={password} type="password"></input>
        </form>
        {/* <p>
                By signing-in you agree to the <strong>SocialX</strong> conditions of Use & Sale.
                Please see our Privacy Notice,our Cookies Notice and our Interest-Based Ads Notice.
            </p> */}
        <button onClick={register} className="btn btn-info login__button rounded-5">
          Create account
        </button>

        <button type="submit" onClick={() => history.push("/login")} className="btn btn-info login__registerButton rounded-5">
          Back to Sign in
        </button>
      </div>
      {open && (
        <div className="login__popup">
          <h1>Thanks for signing up! You can Login now!</h1>
        </div>
      )}
    </div>
  );
}

export default Register;
