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
    </div>
  );
}

export default EditProfile;
