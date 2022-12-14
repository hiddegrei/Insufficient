import React, { useState, useEffect } from "react";
import "../../css/EditProfile.css";
import { db, storage } from "../../firebase";
import { useStateValue } from "../../Stateprovider";
import { Avatar } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

function EditProfile() {
  const [{ user, profile }, dispatch] = useStateValue();
  const [bio, setBio] = useState(profile.bio);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const childPath = `users/${profile.username}/${Math.random().toString(36)}`;
  const [nchar, setNchar] = useState(0);
  const [nchar2, setNchar2] = useState(0);
  const [nchar3, setNchar3] = useState(0);
  const [weight,setWeight]=useState(profile.weight?profile.weight:0);
  const [length,setLength]=useState(profile.length?profile.length:0);
  const [scope, setScope] = useState("profile:read_all,activity:read");

  useEffect(()=>{
    if(profile){
      setWeight(profile.weight)
      setLength(profile.length)
    }
  },[profile])

  const handleBio = (e) => {
    e.preventDefault();
    if (user && profile.username != "undefined") {
      db.collection("users")
        .doc(profile.username)
        .update({
          bio: bio,
        })
        .catch((error) => console.log(error));
    }
    setBio("");
  };
  const handleWeight = (e) => {
    e.preventDefault();
    if (user && profile.username != "undefined") {
      db.collection("users")
        .doc(profile.username)
        .update({
          weight: +weight,
        })
        .catch((error) => console.log(error));
    }
    setBio("");
  };
  const handleLength = (e) => {
    e.preventDefault();
    if (user && profile.username != "undefined") {
      db.collection("users")
        .doc(profile.username)
        .update({
          length: +length,
        })
        .catch((error) => console.log(error));
    }
    setBio("");
  };

  const handlechangeimage = (e) => {
    const image = e.target.files[0];

    const task = storage.ref().child(childPath).put(image);

    const taskProgress = (snapshot) => {
      console.log(`transferred:${snapshot.bytesTransferred}`);
    };
    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        db.collection("users").doc(profile.username).update({
          imageUrl: snapshot,
        });
      });
    };

    const taskError = (snapshot) => {
      console.log(snapshot);
    };
    task.on("state__changed", taskProgress, taskError, taskCompleted);
  };
  const handleImage = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput.click();
  };
  const handleName = (e) => {
    e.preventDefault();
    if (user) {
      db.collection("users").doc(`${profile.username}`).update({
        username: name,
      });
    }
    setName("");
  };

  useEffect(() => {
    //check length tweetmessage
    let len = bio.length;
    let nchar2 = 0;

    for (let i = 0; i != len; i++) {
      if (bio[i] != " ") {
        nchar2++;
      }
    }
    setNchar(nchar2);
    if (nchar2 > 100) {
      let newbio = bio;
      newbio = newbio.replace(`${newbio[newbio.length - 1]}`, "");
      setBio(newbio);
    }
  }, [bio]);
  useEffect(() => {
    //check length tweetmessage
    let len = weight.toString().length;;
    let ncharNew = 0;

    for (let i = 0; i != len; i++) {
      if (weight.toString()[i] != " ") {
        ncharNew++;
      }
    }
    setNchar2(ncharNew);
    if (ncharNew > 100) {
      let newWeight = weight;
      newWeight = newWeight.replace(`${newWeight[newWeight.length - 1]}`, "");
      setWeight(newWeight);
    }
  }, [weight]);
  useEffect(() => {
    //check length tweetmessage
    let len = length.toString().length;;
    let ncharNew = 0;

    for (let i = 0; i != len; i++) {
      if (length.toString()[i] != " ") {
        ncharNew++;
      }
    }
    setNchar3(ncharNew);
    if (ncharNew > 100) {
      let newLength = length;
      newLength = newLength.replace(`${newLength[newLength.length - 1]}`, "");
      setLength(newLength);
    }
  }, [length]);

  function handleConnect(){
    window.open(`https://www.strava.com/oauth/authorize?client_id=74263&redirect_uri=http://localhost:3000/exchange_token&response_type=code&approval_prompt=force&scope=${scope}`, "_self");
  }
  return (
    <div className="edit">
      <div className="edit__header">
        <h2>Edit Profile</h2>
      </div>
      <div className="edit__image">
        <Avatar src={profile.imageUrl} />

        <input placeholder="Edit Profile pic" hidden="hidden" type="file" id="imageInput" value={image} onChange={handlechangeimage}></input>
        {/* <Tooltip title="Edit profile picture" placement="top"> */}
        <Tooltip title="Edit Profile Image">
          <IconButton className="edit__image__icon" onClick={handleImage}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        {/* </Tooltip> */}
      </div>
      {/* <div className="edit__name">
      <h3>Name</h3>
      <form onSubmit={handleName}>
      <input placeholder="Edit Name" type="text" value={name} onChange={(e)=>setName(e.target.value)}></input>
      </form>
      <h2>{profile.username}</h2>
    </div> */}
      <div className="edit__bio">
        <h3>Bio</h3>
        <form onSubmit={handleBio}>
          <div className="edit__bio__input">
            <input className="bio__input" placeholder={bio} type="text" value={bio} onChange={(e) => setBio(e.target.value)}></input>

            <div className="maxchar2">{nchar}/100</div>
          </div>
        </form>
      </div>

      <div className="edit__bio">
        <h3>Weight</h3>
        <form onSubmit={handleWeight}>
          <div className="edit__bio__input">
            <input className="bio__input" placeholder={weight} type="text" value={weight} onChange={(e) =>{ 
              if(!isNaN(e.target.value)||e.keyCode==8||e.keyCode==46){setWeight(e.target.value)}}}></input>

            <div className="maxchar2">{nchar2}/100</div>
          </div>
        </form>
      </div>
      <div className="edit__bio">
        <h3>Length</h3>
        <form onSubmit={handleLength}>
          <div className="edit__bio__input">
            <input className="bio__input" placeholder={length} type="text" value={length} onChange={(e) =>{ 
              if(!isNaN(e.target.value)||e.keyCode==8||e.keyCode==46){setLength(e.target.value)}}}></input>

            <div className="maxchar2">{nchar3}/100</div>
          </div>
        </form>
      </div>
      <div onClick={()=>handleConnect()} className="edit_strava_con btn btn-warning">
        connect to garmin
      </div>
    </div>
  );
}

export default EditProfile;
