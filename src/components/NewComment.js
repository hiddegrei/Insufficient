import React, { useEffect, useState } from "react";
import "../css/NewComment.css";
import { db } from "../firebase";
import { useStateValue } from "../Stateprovider";
import { Button } from "@material-ui/core";
import Comment from "./Comment";
import firebase from "firebase";

function NewComment({ token, username }) {
  const [newComment, setNewComment] = useState("");
  const [{ OpenComment, profile, user }, dispatch] = useStateValue();
  const [comments, setComments] = useState([]);

  const writeNewComment = (e) => {
    e.stopPropagation();
    e.preventDefault();

    db.collection("comments")
      .add({
        comment: newComment,
        userId: user.uid,
        username: profile.username,
        avatar: profile.imageUrl,
        token: token,
        timestamp: new Date().getTime().toString(),
        key: Math.random().toString(36),
      })
      .catch((error) => console.log(error));
    setNewComment("");

    db.collection("users")
      .doc(username)
      .collection("notifications")
      .add({
        commentUsername: profile.username,
        avatar: profile.imageUrl,
        comment: newComment,
        timestamp: new Date().getTime().toString(),
        postId: token,
        key: Math.random().toString(36),
      });
    db.collection("posts")
      .doc(token)
      .update({
        comments: firebase.firestore.FieldValue.increment(1),
      });
  };
  console.log(token);
  useEffect(() => {
    let isSubscribed = true;

    if (token) {
      db.collection("comments")
        .orderBy("timestamp", "desc")
        .where("token", "==", token)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (isSubscribed) {
              setComments((dat) => {
                const data = { key: doc.data().key, comment: doc.data().comment, username: doc.data().username };

                const newnew = dat.filter((dat) => dat.comment !== data.comment);

                return [...newnew, data];
              });
            }
          });
        })
        .catch((error) => console.log(error));
    }
    return () => (isSubscribed = false);
  }, [newComment]);
  return (
    <div className="comments">
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          dispatch({ type: "CLOSE__COMMENT" });
        }}
      ></button>
      <h1 className="post__comments__header">Comments</h1>
      <div className="comments__body">
        {comments.map((com) => (
          <Comment key={com.key} text={com.comment} username={com.username} avatar={profile.imageUrl} verified />
        ))}
      </div>

      <div className="comments__footer">
        <form onSubmit={writeNewComment}>
          <input
            type="text"
            value={newComment}
            onChange={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setNewComment(e.target.value);
            }}
          ></input>
          <Button type="submit">Send</Button>
        </form>
      </div>
    </div>
  );
}

export default NewComment;
