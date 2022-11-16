import React, { useState, useEffect } from "react";
import "../css/Notifications.css";
import { useStateValue } from "../Stateprovider";
import { db } from "../firebase";
import { Avatar, IconButton } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";

function Notifications() {
  const [notis, setNotis] = useState([]);
  const [newNotis, setNewNotis] = useState([]);
  const [{ user, profile }, dispatch] = useStateValue();
  const history = useHistory();

  useEffect(() => {
    let isSubscribed = true;

    if (profile.username !== undefined) {
      db.collection("users")
        .doc(profile.username)
        .collection("notifications")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => (isSubscribed ? setNotis(snapshot.docs.map((doc) => doc.data())) : null));
    }
    return () => (isSubscribed = false);
  }, [user]);

  useEffect(() => {
    let isSubscribed = true;
    if (user && isSubscribed) {
      notis.map((doc) => {
        var date1 = doc.timestamp;
        var date2 = new Date().getTime().toString();

        var diff = (date2 - date1) / 1000;
        diff = Math.abs(Math.floor(diff));

        var days = Math.floor(diff / (24 * 60 * 60));
        var leftSec = diff - days * 24 * 60 * 60;

        var hrs = Math.floor(leftSec / (60 * 60));
        var leftSec = leftSec - hrs * 60 * 60;

        var min = Math.floor(leftSec / 60);
        var leftSec = leftSec - min * 60;

        let newtime;
        if (days < 1 && hrs < 1 && min < 1) {
          newtime = ` ${leftSec}s ago`;
        } else if (days < 1 && hrs < 1) {
          newtime = `${min}m ago`;
        } else if (days < 1) {
          newtime = `${hrs}h ago`;
        } else {
          newtime = `${days}d ago`;
        }
        setNewNotis((dat) => {
          //const olddata={avatar:doc2.avatar,likerUsername:doc2.likerUsername,timestamp:doc2.timestamp}
          let newData;
          if (doc.likerUsername) {
            newData = { avatar: doc.avatar, likerUsername: doc.likerUsername, newtimestamp: newtime, postId: doc.postId, key: doc.key, token: doc.token };
          } else if (doc.followUsername) {
            newData = { avatar: doc.avatar, followUsername: doc.followUsername, newtimestamp: newtime, key: doc.key, token: doc.token };
          } else if (doc.tagUsername) {
            newData = { avatar: doc.avatar, tagUsername: doc.tagUsername, newtimestamp: newtime, postId: doc.postId, key: doc.key, token: doc.token };
          } else if (doc.commentUsername) {
            newData = { avatar: doc.avatar, commentUsername: doc.commentUsername, newtimestamp: newtime, postId: doc.postId, key: doc.key, token: doc.token };
          }

          const olddata = dat.filter((dat) => dat.key !== newData.key);
          return [...olddata, newData];
        });

        //     const newData={data:doc.data(),newtimestamp:newtime}
        //     console.log(newData)
        //  setNewNotis(...newNotis,newData)
      });
    } else {
      console.log("no user or error");
    }
    return () => (isSubscribed = false);
  }, [user, notis]);

  return (
    <div className="notifications">
      <div className="notifications__header">
        <h1>Notifications</h1>
      </div>
      {newNotis.map((doc) => (
        <div className="notifications__optie">
          <div>
            {doc.likerUsername && (
              <div className="chat__optie__avatar">
                <Avatar
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    db.collection("users").doc(profile.username).collection("notifications").doc(doc.token).update({
                      seen: true,
                    });
                    history.push(`/profile/${doc.likerUsername}`);
                  }}
                  src={doc.avatar}
                />
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();

                    db.collection("users").doc(profile.username).collection("notifications").doc(doc.token).update({
                      seen: true,
                    });
                    history.push(`/post/${doc.likerUsername}/${doc.postId}`);
                  }}
                  className="chat__optie__info"
                >
                  <h2>
                    <strong>{doc.likerUsername}</strong> <small> has liked your post</small>
                  </h2>
                  <p>
                    <small>{doc.newtimestamp}</small>
                  </p>
                </div>
              </div>
            )}

            {doc.followUsername && (
              <div className="chat__optie__avatar">
                <Avatar
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    db.collection("users").doc(profile.username).collection("notifications").doc(doc.token).update({
                      seen: true,
                    });
                    history.push(`/profile/${doc.followUsername}`);
                  }}
                  src={doc.avatar}
                />
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    db.collection("users").doc(profile.username).collection("notifications").doc(doc.token).update({
                      seen: true,
                    });
                    history.push(`/profile/${doc.followUsername}`);
                  }}
                  className="chat__optie__info"
                >
                  <h2>
                    <strong>{doc.followUsername}</strong> <small> is now following you</small>
                  </h2>
                  <p>
                    <small>{doc.newtimestamp}</small>
                  </p>
                </div>
              </div>
            )}

            {doc.tagUsername && (
              <div className="chat__optie__avatar">
                <Avatar
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    db.collection("users").doc(profile.username).collection("notifications").doc(doc.token).update({
                      seen: true,
                    });
                    history.push(`/profile/${doc.tagUsername}`);
                  }}
                  src={doc.avatar}
                />
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    db.collection("users").doc(profile.username).collection("notifications").doc(doc.token).update({
                      seen: true,
                    });
                    history.push(`/post/${doc.tagUsername}/${doc.postId}`);
                  }}
                  className="chat__optie__info"
                >
                  <h2>
                    <strong>{doc.tagUsername}</strong> <small> has taged you in his/her post</small>
                  </h2>
                  <p>
                    <small>{doc.newtimestamp}</small>
                  </p>
                </div>
              </div>
            )}

            {doc.commentUsername && (
              <div className="chat__optie__avatar">
                <Avatar
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    db.collection("users").doc(profile.username).collection("notifications").doc(doc.token).update({
                      seen: true,
                    });
                    history.push(`/profile/${doc.commentUsername}`);
                  }}
                  src={doc.avatar}
                />
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    db.collection("users").doc(profile.username).collection("notifications").doc(doc.token).update({
                      seen: true,
                    });
                    history.push(`/post/${doc.commentUsername}/${doc.postId}`);
                  }}
                  className="chat__optie__info"
                >
                  <h2>
                    <strong>{doc.commentUsername}</strong> <small> has commented on your post</small>
                  </h2>
                  <p>
                    <small>{doc.newtimestamp}</small>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Notifications;
