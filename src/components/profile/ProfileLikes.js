import React, { useState, useEffect } from "react";
import "../../css/ProfileLikes.css";
import { useStateValue } from "../../Stateprovider";
import { Avatar, IconButton } from "@material-ui/core";
import { db } from "../../firebase";
import EditIcon from "@material-ui/icons/Edit";
import { Link, useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import Post from "../post/Post";
import firebase from "firebase";
import EmailOutlinedIcon from "@material-ui/icons/EmailOutlined";

function ProfileLikes() {
  const { pName } = useParams();
  const [{ user, profile, handle }, dispatch] = useStateValue();
  const [feedposts, setFeedPosts] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let isSubscribed = true;
    if (isSubscribed) {
      db.collection("users")
        .doc(pName)
        .collection("likedposts")
        .onSnapshot((snapshot) => setFeedPosts(snapshot.docs.map((doc) => doc.data())));
    }
    return () => (isSubscribed = false);
  }, []);

  useEffect(() => {
    let isSubscribed = true;
    if (feedposts.length > 0 && isSubscribed) {
     
      feedposts.map((doc3) => {
        db.collection("posts")
          .doc(doc3.postId)
          .get()
          .then((doc2) => {
            if(doc2.exists){
            setPosts((dat) => {
              const newdata = doc2.data();
              const olddata = dat.filter((dat) => dat.token !== newdata.token);
              return [...olddata, newdata];
            });
          }
          });
      });
    }
    return () => (isSubscribed = false);
  }, [feedposts]);

  return (
    <div>
      {posts != undefined ? (
        <div>
          {posts.map((post) => (
            <Post key={post.createdAt} audio={post.audio} token={post.token} userId={post.userId} displayName={post.displayName} username={post.username} verified={post.verified} text={post.text} avatar={post.avatar} image={post.image} createdAt={post.createdAt} likes={post.likes} comments={post.comments} shares={post.shares} option1={post.option1} option2={post.option2} option3={post.option3} option4={post.option4} votes1={post.votes1} votes2={post.votes2} votes3={post.votes3} votes4={post.votes4} Rusername={post.Rusername} Rimage={post.Rimage} Rtext={post.Rtext} Ravatar={post.Ravatar} Rtweeter={post.Rtweeter} />
          ))}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default ProfileLikes;
