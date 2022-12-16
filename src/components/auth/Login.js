import React, { useState, useEffect } from "react";
import "../../css/Login.css";
import { Link, useHistory } from "react-router-dom";
import { db, auth, storage } from "../../firebase";
import { useStateValue } from "../../Stateprovider";

function Login() {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [{ user, handle }, dispatch] = useStateValue();
  const [open, setOpen] = useState(false);

  const signin = (e) => {
    e.preventDefault();
    var newemail = email.replace(/\s+/g, "");

    if (newemail && password) {
      // db.collection('users').doc(username).get().then(doc=>{

      //     if(doc.exists&&(doc.data().email===email)){

      auth
        .signInWithEmailAndPassword(newemail, password)
        .then((userCredential) => {
          // Signed in
          var useruser = userCredential.user;
          dispatch({
            type: "SET_USER",
            user: useruser,
          });

          if (useruser.uid) {
            db.collectionGroup("users")
              .where("userId", "==", useruser.uid)
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
          // dispatch({
          //     type:'SET_HANDLE',
          //     handle:username,
          // })

          // ...
        })
        .then((auth) => {
          history.push("/");
        })
        .catch((error) => alert(error.message));
      // }else{alert('wrong credentials')}

      //})
    } else {
      alert("email/password is missing");
    }
  };

  //     const register=(e)=>{
  //         e.preventDefault();
  //         if(username){
  // db.collection('users').where('username','==',username).get().then(doc=>{
  //     if(doc.exists){
  //         return alert(username+':this username is already taken')
  //     }else{
  // auth.createUserWithEmailAndPassword(email,password).then((userCredential) => {
  //     // Signed in
  //     var newuser = userCredential.user;
  //     db.collection('users').doc(`${username}`).set({
  //     username:username,
  //     email:newuser.email,
  //     userId:newuser.uid,
  //     following:0,
  //     followers:0,
  //     imageUrl:'',
  //     bio:'',

  // })})
  //         .then((auth)=>{
  //             setOpen(true)
  //         }).catch(error=>alert(error.message))
  //     }
  // })

  // }else{alert('please enter username')}

  //     }

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        setOpen(false);
      }, 3000);
    }
  }, [open]);
  return (
    <div className="login">
      <Link to="/" className="header_logo_link">
        <img className="header__logo" src="https://firebasestorage.googleapis.com/v0/b/insufficient-8211b.appspot.com/o/WaterdropLogo_NB.png?alt=media&token=136f050a-8947-4d0d-b783-2d3188103736"></img>
      </Link>
      <div className="login__container">
        <h1>Log in</h1>

        <form>
          {/* <h5>Username</h5>
                <input onChange={(e)=>setUsername(e.target.value)}value={username} type="text"></input> */}

          <h5>Email</h5>
          <input onChange={(e) => setEmail(e.target.value)} value={email} type="text"></input>

          <h5>Password</h5>
          <input onChange={(e) => setPassword(e.target.value)} value={password} type="password"></input>
          <button type="submit" onClick={signin} className="btn btn-info login__button">
            Log in
          </button>
        </form>
        {/* <p>
                By signing-in you agree to the <strong>SocialX</strong> conditions of Use & Sale.
                Please see our Privacy Notice,our Cookies Notice and our Interest-Based Ads Notice.
            </p> */}
<<<<<<< Updated upstream
        <button onClick={() => history.push("/forgotpassword")} className=" btn btn-info login__forgotpasswordbutton">
          Forgot Password?
        </button>
        <button onClick={() => history.push("/register")} className="btn btn-info login__registerButton">
          Create account
        </button>
=======
        <button onClick={() => history.push("/register")} className="login__registerButton">
          Register
        </button>
        <button onClick={() => history.push("/forgotpassword")} className="login__forgotpasswordbutton">
          Forgot Password?
        </button>

>>>>>>> Stashed changes
      </div>
      {/* {open&&<div className="login__popup">
             <h1>Thanks for signing up! You can Login now!</h1>
            </div>} */}
    </div>
  );
}

export default Login;
