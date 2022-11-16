import React, { useEffect, useState } from "react";
import { Avatar, IconButton } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import ChatOptie from "./ChatOptie";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MicIcon from "@material-ui/icons/Mic";
import { useParams } from "react-router-dom";
import "../css/Chat.css";
import { db } from "../firebase";
import firebase from "firebase";
import { useStateValue } from "../Stateprovider";

function Chat() {
  const [input, setInput] = useState("");
  const [seed, setSeed] = useState("");
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [{ user, profile }, dispatch] = useStateValue();

  useEffect(() => {
    let isSubscribed = true;
    if (roomId && profile.username) {
      db.collection("messages")
        .doc(roomId)
        .onSnapshot((snapshot) => {
          db.collection("messages")
            .doc(roomId)
            .collection("messages")
            .orderBy("timestamp", "asc")
            .onSnapshot((snapshot) => (isSubscribed ? setMessages(snapshot.docs.map((doc) => doc.data())) : null));
        });

      db.collection("messages")
        .doc(roomId)
        .get()
        .then((doc) => {
          if (doc.data().receiverUsername === profile.username && isSubscribed) {
            setRoomName(doc.data().senderUsername);
          } else if (isSubscribed) {
            setRoomName(doc.data().receiverUsername);
          } else {
            console.log("subscribed is false");
          }
        })
        .catch((error) => console.log(error));
    }
    return () => (isSubscribed = false);
  }, [profile.username]);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, [profile.username]);

  const sendMessage = (e) => {
    e.preventDefault();
    console.log("you typed:", input);

    db.collection("messages")
      .doc(roomId)
      .collection("messages")
      .add({
        message: input,
        userId: profile.userId,
        username: profile.username,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        key: profile.userId,
      })
      .catch((error) => console.log(error));

    setInput("");
  };
  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar src={`https://avatars.dicebear.com/4.5/api/human/${seed}.svg`} />
        <div className="chat__headerInfo">
          <h3>{roomName}</h3>
          <p>
            last seen {""}
            {new Date(messages[messages.length - 1]?.timestamp?.toDate()).toUTCString()}
          </p>
        </div>

        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlinedIcon />
          </IconButton>

          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            {" "}
            <MoreVertIcon />{" "}
          </IconButton>
        </div>
      </div>
      <div className="chat__body">
        {messages.map((message) => (
          <p className={`chat__message ${message.username === profile.username && "chat__reciever"} `}>
            <span className="chat__name">{message.username === profile.username ? "You" : message.username}</span>
            {message.message}
            <span className="chat__timestamp">{new Date(message.timestamp?.toDate()).toUTCString()}</span>
          </p>
        ))}
      </div>

      <div className="chat__footer">
        <InsertEmoticonIcon />
        <form>
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message" type="text" />
          <button onClick={sendMessage} type="submit">
            Send a message
          </button>
        </form>
        <MicIcon />
      </div>
    </div>
  );
}

export default Chat;
