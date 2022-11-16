import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { useStateValue } from "../Stateprovider";
import SearchIcon from "@material-ui/icons/Search";
import { Avatar } from "@material-ui/core";
import "../css/AddnewChat.css";
import { Link, useHistory } from "react-router-dom";

function AddnewChat() {
  const [{ user, profile }, dispatch] = useStateValue();
  const [searchContent, setSearchContent] = useState("");
  const [output, setOutput] = useState([]);
  const [show, setShow] = useState(false);
  const history = useHistory();

  const handleNewchat = (e) => {
    e.preventDefault();
    if (profile) {
      db.collection("messages")
        .add({
          senderUsername: profile.username,
          receiverUsername: searchContent,
          //     }).then((docRef)=>{
          // db.collection('users').doc(profile.username).collection('chats').add({
          // roomId:docRef.id
          // })
          // db.collection('users').doc(searchContent).collection('chats').add({
          // roomId:docRef.id
          // })
        })
        .catch((error) => console.log(error));
    }
    history.push("/chat");
  };
  useEffect(() => {
    if (searchContent) {
      db.collection("users")
        .doc(profile.username)
        .collection("following")
        .where("username", ">=", searchContent)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            setOutput((dat) => {
              const newdata = { data: doc.data(), key: doc.data().userId };
              const olddata = dat.filter((dat) => dat.key !== newdata.key);

              return [...olddata, newdata];
            });
            setShow(true);
          });
        })
        .catch((error) => console.log(error));
    } else {
      setShow(false);
      setOutput([]);

      console.log("empty");
    }
  }, [searchContent]);
  return (
    <div className="addnew">
      <div className="widgets__input">
        <SearchIcon />

        <input onChange={(e) => setSearchContent(e.target.value)} value={searchContent} placeholder="search in following" className="Search Twitter" type="text"></input>
      </div>

      <div className="widgets__widgetContainer">
        {show ? (
          <div>
            {output.map((doc) => (
              <div onClick={handleNewchat} className="widget__optie">
                <Avatar src={doc.data.imageUrl} />
                <div className="widget__optie__info">
                  <h2>{doc.data.username}</h2>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}

export default AddnewChat;
