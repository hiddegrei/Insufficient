import React, { useState, useEffect } from "react";
import "../css/ChatOptie.css";
import { db } from "../firebase";
import { useStateValue } from "../Stateprovider";
import { Link } from "react-router-dom";
import { Avatar, IconButton } from "@material-ui/core";

function ChatOptie({ id, name1, name2, addNewChat }) {
  const [messages, setMessages] = useState("");
  const [{ user, profile }, dispatch] = useStateValue();
  const [roomName, setRoomName] = useState("");

  useEffect(() => {
    if (id) {
      db.collection("messages")
        .doc(`${id}`)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => setMessages(snapshot.docs.map((doc) => doc.data())));
    }
  }, [id]);
  const createChat = () => {
    const roomName = prompt("please enter name for chat");
    if (roomName) {
      db.collection("messages")
        .add({
          name: roomName,
          userId: user.uid,
          sender: profile.username,
        })
        .then(() => {
          console.log("message added");
        })
        .catch((error) => console.log(error));
    }
  };

  useEffect(() => {
    if (profile.username) {
      if (name1 === profile.username) {
        setRoomName(name2);
      } else {
        setRoomName(name1);
      }
    }
  }, [profile.username]);

  return !addNewChat ? (
    <div>
      <Link to={`/messages/${id}`}>
        <div className="chat__optie">
          <Avatar src="" />
          <div className="chat__optie__info">
            <h2>{roomName}</h2>
            <p>{messages[0]?.message}</p>
          </div>
        </div>
      </Link>
    </div>
  ) : (
    <div>
      <Link to="/addnewchat">
        <div className="chat__optie">
          <h2>add newchat</h2>
        </div>
      </Link>
    </div>
  );
}

export default ChatOptie;
