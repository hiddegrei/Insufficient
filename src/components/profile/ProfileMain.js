import React, { useState, useEffect } from "react";
import "../../css/ProfileMain.css";
import { useStateValue } from "../../Stateprovider";
import { Avatar, IconButton } from "@material-ui/core";
import { db } from "../../firebase";
import EditIcon from "@material-ui/icons/Edit";
import { Link, useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import Post from "../post/Post";
import firebase from "firebase";
import EmailOutlinedIcon from "@material-ui/icons/EmailOutlined";
import ProfileLikes from "./ProfileLikes";
import Profile from "./Profile";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";

function ProfileMain() {
  const { pName } = useParams();
  const history = useHistory();

  const [{ user, profile, handle }, dispatch] = useStateValue();

  const [newProfile, setNewProfile] = useState("");
  const [profileMain, setProfileMain] = useState([]);
  const [allow, setAllow] = useState(false);
  const [follow, setFollow] = useState(false);
  const [poster, setPoster] = useState([]);

  const [userfollowing, setUserfollowing] = useState(0);
  const [myposts, setMyposts] = useState([]);
  const [retweetData, setRetweetData] = useState([]);
  const [rposts, setRposts] = useState([]);
  const [update, setUpdate] = useState(false);
  const [postsOrLiked, SetPostsOrLiked] = useState(false);
  const [floading, setFloading] = useState(false);
  const [followingNUM, setFollowingNUM] = useState("");
  const [followersNUM, setFollowersNUM] = useState("");

  useEffect(() => {
    let isSubscribed = true;

    if (profile && pName !== "undefined" && isSubscribed && user) {
      db.collection("users")
        .doc(`/${profile.username}/following/${pName}`)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setFollow(true);
            setFloading(true);
            console.log("following found");
          } else {
            setFollow(false);
            setFloading(true);
            console.log("following not");
          }
        })
        .catch((error) => console.log(error));
    } else {
      console.log("no profile");
    }

    return () => (isSubscribed = false);
  }, [follow, user, profile]);

  const handleFollow = (e) => {
    e.preventDefault();
    if (follow && pName != "undefined") {
      setFollow(false);
      setPoster({ ...poster, followers: 1 });
      //setPosterfollowers(posterfollowers-1)
      setUserfollowing(userfollowing - 1);
      db.collection("users")
        .doc(`${profile?.username}/following/${pName}`)
        .delete()
        .then(() => {
          console.log("Document successfully deleted!");
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
        });
      db.collection("users")
        .doc(`/${pName}/followers/${profile.username}`)
        .delete()
        .then(() => {
          console.log("Document successfully added!");
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });

      db.collection("users")
        .doc(pName)
        .collection("followersNUM")
        .doc(pName)
        .update({
          followers: followersNUM - 1,
        })
        .then(() => {
          console.log("followers succesfully updated");
        })
        .catch((error) => console.log(error));

      db.collection("users")
        .doc(profile.username)
        .collection("followingNUM")
        .doc(profile.username)
        .update({
          following: followingNUM - 1,
        })
        .then(() => {
          console.log("followers succesfully updated");
        })
        .catch((error) => console.log(error));

      db.collection("users")
        .doc(pName)
        .collection("notifications")
        .where("followUsername", "==", profile.username)
        .get()
        .then((query) => {
          query.forEach((doc) => {
            db.collection("users")
              .doc(pName)
              .collection("notifications")
              .doc(doc.id)
              .delete()
              .then(() => {
                console.log();
              })
              .catch((error) => {
                console.error("Error removing document: ", error);
              });
          });
        });
    }
    if (!follow && pName != "undefined") {
      setFollow(true);
      setPoster({ ...poster, followers: 1 });
      setUserfollowing(userfollowing + 1);

      db.collection("users")
        .doc(`/${profile?.username}/following/${pName}`)
        .set({
          userId: profileMain.userId,
          username: pName,
          timestamp: new Date().getTime().toString(),
          imageUrl: profileMain.imageUrl,
          fuserId: profile.userId,
        })
        .then(() => {
          console.log("Document successfully added!");
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });

      db.collection("users")
        .doc(`/${pName}/followers/${profile.username}`)
        .set({
          userId: profile.userId,
          username: profile.username,
          timestamp: new Date().getTime().toString(),
          imageUrl: profileMain.imageUrl,
        })
        .then(() => {
          console.log("Document successfully added!");
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });

      db.collection("users")
        .doc(pName)
        .collection("followersNUM")
        .doc(pName)
        .update({
          followers: firebase.firestore.FieldValue.increment(1),
        })
        .then(() => {
          console.log("followers succesfully updated");
        })
        .catch((error) => console.log(error));

      db.collection("users")
        .doc(profile.username)
        .collection("followingNUM")
        .doc(profile.username)
        .update({
          following: firebase.firestore.FieldValue.increment(1),
        })
        .then(() => {
          console.log("followers succesfully updated");
        })
        .catch((error) => console.log(error));

      db.collection("users")
        .doc(pName)
        .collection("notifications")
        .add({
          follow: true,
          followUsername: profile.username,
          avatar: profile.imageUrl,
          timestamp: new Date().getTime().toString(),
          key: Math.random().toString(36),
          seen: false,
          token: "",
        })
        .then((docRef) => {
          db.collection("users").doc(pName).collection("notifications").doc(docRef.id).update({ token: docRef.id });
        })
        .catch((error) => console.log(error));
    }
  };

  useEffect(() => {
    let isSubscribed = true;

    if (profile && pName != "undefined") {
      db.collection("users")
        .doc(pName)
        .get()
        .then((doc) => {
          if (doc.exists && isSubscribed) {
            setProfileMain(doc.data());
          } else {
            console.log("doc from user not found");
          }
        })
        .catch((error) => console.log(error));

      if (profile.username == pName && isSubscribed) {
        setAllow(true);
      } else if (isSubscribed) {
        setAllow(false);
      } else {
        return;
      }

      db.collection("users")
        .doc(pName)
        .collection("followingNUM")
        .doc(pName)
        .get()
        .then((doc) => {
          setFollowingNUM(doc.data().following);
        });
      db.collection("users")
        .doc(pName)
        .collection("followersNUM")
        .doc(pName)
        .get()
        .then((doc) => {
          setFollowersNUM(doc.data().followers);
        });
    } else {
      console.log("no profile/pName undefined");
    }

    return () => (isSubscribed = false);
  }, [pName, user, update, profile, follow]);

  const handleMessage = (e) => {
    e.preventDefault();

    if (profile && pName != "undefined") {
      db.collection("messages")
        .add({
          senderUsername: profile.username,
          receiverUsername: pName,
        })
        .catch((error) => console.log(error));
    }
    history.push("/chat");
  };

  if (!floading) {
    return (
      <div className="loading__page">
        <img className="loading__logo" src="https://firebasestorage.googleapis.com/v0/b/twitterclone-6c140.appspot.com/o/shortlogoSocialHit.jpg?alt=media&token=68b2e724-0787-4d13-91ed-4001379e11ba"></img>
        <h1 className="loading">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="profile">
      <div className="profile__header">
        <h1>Profile</h1>
      </div>

      <div className="profile__body">
        <div className="profile__avatar">
          {profileMain.imageUrl ? <img src={profileMain.imageUrl} className="profile__a" /> : <Avatar className="profile__a" src="" />}

          <h3 className="profile__option">{profileMain ? `@ ${profileMain?.username}` : "@ "}</h3>
          <Link to={`/profile/${pName}/edit`}>
            {!allow && user ? (
              <div className="followbutton">
                <IconButton onClick={handleMessage} className="profile__followf">
                  <EmailOutlinedIcon />
                </IconButton>
                {/* <button onClick={handleMessage} className="profile__followf">Message</button> */}
                {!follow ? (
                  <button onClick={handleFollow} className="profile__followf">
                    Follow
                  </button>
                ) : (
                  <button onClick={handleFollow} className="profile__2followf">
                    Unfollow
                  </button>
                )}
              </div>
            ) : (
              <div></div>
            )}
            {allow && (
              <div className="profile__edit">
                {" "}
                <EditIcon /> Edit Profile
              </div>
            )}
          </Link>
          <div className="profile__commentsContainer"></div>
        </div>

        <div className="profile__bio">
          <h4>{profileMain.bio}</h4>
        </div>
        <div className="profile__follow">
          <Link to={`/profile/followers/${pName}`}>
            <div className="profile__num">followers : {followersNUM}</div>
          </Link>
          <Link to={`/profile/following/${pName}`}>
            <div className="profile__num">following : {followingNUM}</div>
          </Link>
        </div>
      </div>
      <div className="postOptions">
        {postsOrLiked ? (
          <div onClick={() => SetPostsOrLiked(false)} className="postOptions__option">
            <h3>Posts</h3>
          </div>
        ) : (
          <div onClick={() => SetPostsOrLiked(false)} className="postOptions__optionA">
            <h3>Posts</h3>
          </div>
        )}

        {postsOrLiked ? (
          <div onClick={() => SetPostsOrLiked(true)} className="postOptions__optionA">
            <h3>Likes</h3>
          </div>
        ) : (
          <div onClick={() => SetPostsOrLiked(true)} className="postOptions__option">
            <h3>Likes</h3>
          </div>
        )}
      </div>
      {!postsOrLiked ? <Profile /> : <ProfileLikes />}
    </div>
  );
}

export default ProfileMain;
