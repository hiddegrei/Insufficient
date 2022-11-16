import React, { useState, useEffect } from "react";
import "../css/ChatPage.css";
import ChatOptie from "./ChatOptie";
import { db } from "../firebase";
import { useStateValue } from "../Stateprovider";
import SearchIcon from "@material-ui/icons/Search";
import { Link } from "react-router-dom";
import { Avatar } from "@material-ui/core";
import AddnewChat from "./AddnewChat";

function ChatPage() {
  const [messages, setMessages] = useState([]);

  const [{ user, profile }, dispatch] = useStateValue();
  const [addnew, setAddnew] = useState(true);

  useEffect(() => {
    if (user && profile.username) {
      db.collection("messages")
        .where("senderUsername", "==", profile.username)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log( doc.data());
            setMessages((dat) => {
              const newdata = { data: doc.data(), id: doc.id };
              const olddata = dat.filter((dat) => dat.id !== newdata.id);
              return [...olddata, newdata];
            });
          });
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
      //
      //
      db.collection("messages")
        .where("receiverUsername", "==", profile.username)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log( doc.data());
            setMessages((dat) => {
              const newdata = { data: doc.data(), id: doc.id };
              const olddata = dat.filter((dat) => dat.id !== newdata.id);
              return [...olddata, newdata];
            });
          });
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    }
  }, [user, profile.username]);

  return (
    <div className="chat">
      <div>
        <div className="chat__header">
          <h2>Chat</h2>
        </div>

        <ChatOptie addNewChat />
        {messages.map((message) => (
          <ChatOptie key={message.id} id={message.id} name1={message.data.receiverUsername} name2={message.data.senderUsername} />
        ))}
      </div>
    </div>
  );
}
export default ChatPage;
