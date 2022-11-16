import React, { useEffect, useState } from "react";
import "../../css/PostPop.css";
import { Link, useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import Post from "./Post";
import Comment from "../Comment";

function PostPop() {
  const nam = useParams();

  const [post, setPost] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    let isSubscribed = true;
    if (nam.tok) {
      db.collection("posts")
        .doc(nam.tok)
        .get()
        .then((doc) => {
          if (isSubscribed) {
            setPost(doc.data());
          } else {
            console.log("component not mounted");
          }
        });
    }
    return () => (isSubscribed = false);
  }, []);

  useEffect(() => {
    let isSubscribed = true;
    if (isSubscribed && nam.tok) {
      db.collection("comments")
        .where("token", "==", nam.tok)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            setComments((dat) => {
              const data = { key: doc.data().token, comment: doc.data().comment, username: doc.data().username };

              const newnew = dat.filter((dat) => dat.comment !== data.comment);

              return [...newnew, data];
            });
          });
        })
        .catch((error) => console.log(error));
    }

    return () => (isSubscribed = false);
  }, []);

  return (
    <div className="postpop">
      <div>{post != undefined && post != null && <Post key={post.createdAt} audio={post.audio} token={post.token} userId={post.userId} displayName={post.displayName} username={post.username} verified={post.verified} text={post.text} avatar={post.avatar} image={post.image} createdAt={post.createdAt} likes={post.likes} comments={post.comments} shares={post.shares} option1={post.option1} option2={post.option2} option3={post.option3} option4={post.option4} votes1={post.votes1} votes2={post.votes2} votes3={post.votes3} votes4={post.votes4} Rusername={post.Rusername} Rimage={post.Rimage} Rtext={post.Rtext} Ravatar={post.Ravatar} Rtweeter={post.Rtweeter} />}</div>

      <div>
        {comments.map((com) => (
          <Comment text={com.comment} username={com.username} avatar={com.avatar} />
        ))}
      </div>
    </div>
  );
}

export default PostPop;
