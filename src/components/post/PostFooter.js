import React, { useState, useEffect } from "react";
import { Avatar, IconButton, Button } from "@material-ui/core";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import RepeatIcon from "@material-ui/icons/Repeat";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import PublishIcon from "@material-ui/icons/Publish";
import "../../css/PostFooter.css";
import { Link, useHistory } from "react-router-dom";
import { db } from "../../firebase";
import Comment from "../Comment";
import { useStateValue } from "../../Stateprovider";
import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import firebase from "firebase";
import NewComment from "../NewComment";

function PostFooter({ userId, token, likes, comments, shares, username, avatar, verified, text, image, option1, audio, Rusername, widget }) {
  const [liked, setLiked] = useState(false);
  const [likes2, setLikes2] = useState(likes);
  const [commentWindow, setCommentWindow] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [{ user, profile, handle, OpenComment }, dispatch] = useStateValue();
  const [ids, setIds] = useState([]);
  const [comments2, setComments2] = useState([]);
  const [postliked, setPostliked] = useState(false);
  const [repeatWindow, SetRepeatWindow] = useState(false);
  const [tweetMessage, setTweetMessage] = useState("");
  const [hasRetweet, setHasRetweet] = useState(false);
  const [hasRetweetT, setHasRetweetT] = useState(false);
  const [nchar, setNchar] = useState(0);

  let nchar2 = 0;

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
        seen: false,
        token: "",
      })
      .then((docRef) => {
        db.collection("users").doc(username).collection("notifications").doc(docRef.id).update({ token: docRef.id });
      })
      .catch((error) => console.log(error));
    db.collection("posts")
      .doc(token)
      .update({
        comments: firebase.firestore.FieldValue.increment(1),
      });
  };
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
              setComments2((dat) => {
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

  const handlelike = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (liked) {
      setLikes2(likes2 - 1);
      setLiked(false);
      db.collection("users")
        .doc(`${profile.username}/likedposts/${token}`)
        .delete()
        .then(() => {
          console.log();
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
        });

      db.collection("posts")
        .doc(`${token}`)
        .update({
          likes: firebase.firestore.FieldValue.increment(-1),
        })
        .catch((error) => console.log(error));

      db.collection("users")
        .doc(username)
        .collection("notifications")
        .where("likedPostToken", "==", token)
        .get()
        .then((query) => {
          query.forEach((doc) => {
            db.collection("users")
              .doc(username)
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

    if (!liked) {
      setLikes2(likes2 + 1);
      setLiked(true);
      db.collection("users")
        .doc(`/${profile.username}/likedposts/${token}`)
        .set({
          postId: token,
          createdAt: new Date().getTime().toString(),
        })
        .then(() => {
          console.log("Document successfully added!");
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
      db.collection("posts")
        .doc(`${token}`)
        .update({
          likes: firebase.firestore.FieldValue.increment(1),
        })
        .catch((error) => console.log(error));

      if (username != profile.username) {
        db.collection("users")
          .doc(username)
          .collection("notifications")
          .add({
            liked: true,
            likerUsername: profile.username,
            avatar: profile.imageUrl,
            timestamp: new Date().getTime().toString(),
            postId: token,
            key: Math.random().toString(36),
            seen: false,
            token: "",
          })
          .then((docRef) => {
            db.collection("users").doc(username).collection("notifications").doc(docRef.id).update({ token: docRef.id });
          })
          .catch((error) => console.log(error));
      }
    }
  };

  const handlecomment = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (commentWindow) {
      setCommentWindow(false);
    } else {
      setCommentWindow(true);
    }
  };

  useEffect(() => {
    let isSubscribed = true;

    if (profile && token) {
      db.collection("users")
        .doc(profile.username)
        .collection("likedposts")
        .doc(token)
        .get()
        .then((doc) => {
          if (isSubscribed) {
            if (doc.exists) {
              setLiked(true);
            } else {
              setLiked(false);
            }
          }
        })
        .catch((error) => console.log(error));
    }
  }, [liked]);

  const handleRepeat = (e) => {
    e.stopPropagation();
    e.preventDefault();

    SetRepeatWindow(true);
  };
  const handleRetweet = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!tweetMessage) {
      db.collection("users")
        .doc(profile.username)
        .collection("retweets")
        .doc(token)
        .set({
          token: token,
          Rusername: profile.username,
          createdAt: new Date().getTime().toString(),
          userId: profile.userId,
        })
        .catch((error) => console.log(error));
    } else if (!audio) {
      db.collection("users").doc(profile.username).collection("retweetsMettekst").doc(token).set({
        retweetmettekstToken: token,
      });
      db.collection("posts")
        .add({
          Rusername: profile.username,
          Rtext: tweetMessage,
          Ravatar: profile.imageUrl,
          username: username,
          userId: user.uid,
          verified: true,
          text: text,
          avatar: avatar,
          image: image,
          createdAt: new Date().getTime().toString(),
          likes: 0,
          comments: 0,
          shares: 0,
          token: "",
          retweet: true,
        })
        .then((docRef) => {
          db.collection("posts").doc(docRef.id).update({
            token: docRef.id,
          });
        })
        .catch((error) => console.log(error));
    } else if (audio && !Rusername) {
      db.collection("users").doc(profile.username).collection("retweetsMettekst").doc(token).set({
        retweetmettekstToken: token,
      });
      db.collection("posts")
        .add({
          Rusername: profile.username,
          Rtext: tweetMessage,
          Ravatar: profile.imageUrl,
          username: username,
          userId: user.uid,
          verified: true,
          text: text,
          avatar: avatar,
          createdAt: new Date().getTime().toString(),
          likes: 0,
          comments: 0,
          shares: 0,
          token: "",
          retweet: true,
          audio: audio,
        })
        .then((docRef) => {
          db.collection("posts").doc(docRef.id).update({
            token: docRef.id,
          });
        })
        .catch((error) => console.log(error));
    }

    db.collection("posts")
      .doc(token)
      .update({
        shares: firebase.firestore.FieldValue.increment(1),
      });

    SetRepeatWindow(false);
  };

  useEffect(() => {
    let isSubscribed = true;
    //check for retweet post in user documents
    if (user && token && isSubscribed) {
      db.collection("users")
        .doc(profile.username)
        .collection("retweets")
        .doc(token)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setHasRetweet(true);
          } else {
            setHasRetweet(false);
          }
        });
      db.collection("users")
        .doc(profile.username)
        .collection("retweetsMettekst")
        .doc(token)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setHasRetweetT(true);
          } else {
            setHasRetweetT(false);
          }
        });
    }
    return () => (isSubscribed = false);
  }, [user, repeatWindow]);

  useEffect(() => {
    let isSubscribed = true;
    //check length tweetmessage
    let len = tweetMessage.length;

    if (isSubscribed) {
      for (let i = 0; i != len; i++) {
        if (tweetMessage[i] != " ") {
          nchar2++;
        }
      }
      setNchar(nchar2);
      if (nchar2 > 100) {
        let newTweetMessage = tweetMessage;
        newTweetMessage = newTweetMessage.replace(`${newTweetMessage[newTweetMessage.length - 1]}`, "");
        setTweetMessage(newTweetMessage);
      }
    }
    return () => (isSubscribed = false);
  }, [tweetMessage]);

  return (
    <div className="post__footer">
      <div className={`post__footer__option ${widget && "post__footer__option--widget"}`}>
        <div>
          <IconButton onClick={handlecomment}>
            {" "}
            <ChatBubbleOutlineIcon />
          </IconButton>
        </div>
        <div>{comments}</div>
      </div>
      <div className={`post__footer__option ${widget && "post__footer__option--widget"}`}>
        {hasRetweet || hasRetweetT ? (
          <IconButton style={{ color: "green" }}>
            <RepeatIcon />
          </IconButton>
        ) : (
          <IconButton onClick={handleRepeat}>
            <RepeatIcon />
          </IconButton>
        )}
        <p>{shares}</p>
      </div>
      <div className="post__footer__option">
        {liked ? (
          <IconButton style={{ color: "red" }} onClick={handlelike}>
            <FavoriteIcon />
          </IconButton>
        ) : (
          <IconButton onClick={handlelike}>
            <FavoriteBorderIcon />
          </IconButton>
        )}
        {likes2 < 1000 && <p>{likes2}</p>}
        {likes2 > 1000 && <p>{likes2 / 1000}k</p>}
      </div>
      {/* <div className="post__footer__option">
    <IconButton><PublishIcon fontSize="large"/></IconButton>
    <p></p>
    </div> */}

      <div className="post__commentsContainer">
        {commentWindow ? (
          <div className="comments">
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setCommentWindow(false);
              }}
            ></button>
            <h1 className="post__comments__header">Comments</h1>
            <div className="comments__body">
              {comments2.map((com) => (
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
        ) : (
          <div></div>
        )}
        {/* {OpenComment&&<NewComment key={token} token={token} username={username}/>} */}
      </div>

      {repeatWindow && (
        <div className="repeat__window">
          <div className="tweetbox__2">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                SetRepeatWindow(false);
              }}
              className="repeat__closeButton"
            >
              <HighlightOffOutlinedIcon />
            </IconButton>
            <form>
              <div className="tweetBox__input">
                <Avatar src={profile.imageUrl}></Avatar>

                {option1 == undefined && (
                  <input
                    onChange={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setTweetMessage(e.target.value);
                    }}
                    value={tweetMessage}
                    placeholder="Add your reaction(optional)"
                    type="text"
                  ></input>
                )}
              </div>
              {option1 == undefined && <p className="maxchar">{nchar}/100</p>}
              <div className="tweetBox__retweetBody">
                <div className="retweetBody__avatar">
                  <Link to={`/profile/${username}`}>{avatar ? <img src={avatar} className="retweetBody__profile__pic" /> : <Avatar className="retweetBody__profile__pic" src="" />}</Link>
                </div>

                <div className="retweetBody__BodyvanBody">
                  <div className="retweetBody__BodyvanBody__header">
                    <div className="retweetBody__BodyvanBody__header__headerText">
                      <h3>
                        {" "}
                        {username}
                        {""}
                        <span className="retweetBody__BodyvanBody__header__headerSpecial">
                          {verified && <VerifiedUserIcon className="retweetBody__BodyvanBody__header__badge"></VerifiedUserIcon>}@{username}
                        </span>
                      </h3>
                    </div>
                    <div className="retweetBody__BodyvanBody__header__headerDescription">
                      <p>{text}</p>
                    </div>
                  </div>
                  {image && <img className="retweetBody__BodyvanBody__header__img" src={image} alt=""></img>}
                  {audio && <audio className="audio2" controls src={audio}></audio>}
                </div>
              </div>

              <div className="tweetBox__footer">
                <div className="tweetBox__tweetbutton">
                  <Button onClick={handleRetweet} type="submit" className="tweetBox__tweetButton">
                    Repost
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostFooter;
