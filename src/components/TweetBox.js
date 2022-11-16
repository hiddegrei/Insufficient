import React, { useState, useEffect } from "react";
import "../css/TweetBox.css";
import { Avatar, Button } from "@material-ui/core";
import { db, storage } from "../firebase";
import { useStateValue } from "../Stateprovider";
import Profile from "./profile/Profile";
import ImageIcon from "@material-ui/icons/Image";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import PollIcon from "@material-ui/icons/Poll";
import AddBoxIcon from "@material-ui/icons/AddBox";
import RemoveIcon from "@material-ui/icons/Remove";
import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined";
import firebase from "firebase";
import AudiotrackIcon from "@material-ui/icons/Audiotrack";
import GraphicEqIcon from "@material-ui/icons/GraphicEq";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import Picker from "emoji-picker-react";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";

function TweetBox({ sidebar }) {
  const [tweetMessage, setTweetMessage] = useState("");
  const [tweetImage, setTweetImage] = useState("");
  const [imageProgress, setImageProgress] = useState(0);
  const [audioProgress, setAudioProgress] = useState(0);
  const [tweetAudio, setTweetAudio] = useState("");
  const [{ user, profile, windowstate }, dispatch] = useStateValue();
  const [ids, setIds] = useState([]);
  const [image, setImage] = useState("");
  const [audio, setAudio] = useState("");
  const [pollOnOff, setPollOnOff] = useState(false);
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");
  const [option4, setOption4] = useState("");
  const [choices3, setChoices3] = useState(false);
  const [choices4, setChoices4] = useState(false);
  const [tweetWindow, SetTweetWindow] = useState(true);
  const [nchar, setNchar] = useState(0);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [ad, setAd] = useState(true);
  const [added, setAdded] = useState(false);
  const emojis = require("emojis-list");
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [openEmoji, setOpenEmoji] = useState(false);
  const [postToken, setPostToken] = useState("");

  let naam;

  const childPathImage = `image/${profile.username}/${Math.random().toString(36)}`;
  const childPathAudio = `audio/${profile.username}/${Math.random().toString(36)}`;

  const onEmojiClick = (e, emojiObject) => {
    e.preventDefault();
    e.stopPropagation();

    setChosenEmoji(emojiObject);
  };
  useEffect(() => {
    if (chosenEmoji) {
      //   setTweetMessage((old)=>{
      //       console.log(old)
      //       return[...old,chosenEmoji.emoji]
      //   })
      const oldmes = tweetMessage;
      const newmes = oldmes.concat(chosenEmoji.emoji);

      setTweetMessage(newmes);
    }
  }, [chosenEmoji]);

  useEffect(() => {
    if (tweetAudio) {
      setTimeout(() => {
        setAd(false);
      }, 2000);
    }
  }, [tweetAudio]);

  const handlechangeimage = (e) => {
    const image = e.target.files[0];

    const task = storage.ref().child(childPathImage).put(image);

    const taskProgress = (snapshot) => {
      console.log(`transferredImage:${snapshot.bytesTransferred}`);
      setImageProgress(snapshot.bytesTransferred);
    };
    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        setTweetImage(snapshot);
      });
    };

    const taskError = (snapshot) => {
      console.log(snapshot);
    };
    task.on("state__changed", taskProgress, taskError, taskCompleted);
  };
  const handleImage = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput.click();
  };
  //Hieronder Audio input
  //
  const handlechangeaudio = (e) => {
    const audio = e.target.files[0];

    const taskAudio = storage.ref().child(childPathAudio).put(audio);

    const taskProgressAudio = (snapshot) => {
      console.log(`transferredAudio:${snapshot.bytesTransferred}`);
      setAudioProgress(snapshot.bytesTransferred);
    };
    const taskCompletedAudio = () => {
      taskAudio.snapshot.ref.getDownloadURL().then((snapshot) => {
        setTweetAudio(snapshot);
      });
    };

    const taskErrorAudio = (snapshot) => {
      console.log(snapshot);
    };
    taskAudio.on("state__changed", taskProgressAudio, taskErrorAudio, taskCompletedAudio);
  };

  const handleAudio = () => {
    const audioInput = document.getElementById("audioInput");
    audioInput.click();
  };
  //
  //

  const sendTweet = (e) => {
    e.preventDefault();
    const message = tweetMessage;
    var splitmessage;
    let messageDeel1;
    let first = -1;
    let hashes = [];

    //  if (string.indexOf(',') > -1) { string.split(',') }
    if (message.indexOf("#") > -1) {
      splitmessage = message.split("#");

      splitmessage.forEach(function (val) {
        // str += '<content>'+val+'</content><br />';
        if (first < 0) {
          messageDeel1 = val;
          first = first + 1;
          //console.log('hi')
        } else {
          // console.log(val)
          // console.log(first)
          hashes[first] = val;
          first = first + 1;
        }
      });
    }
    if (hashes.length > 0) {
      hashes.map((has) =>
        db
          .collection("hashtrends")
          .doc(has)
          .get()
          .then((doc) => {
            if (doc.exists) {
              db.collection("hashtrends")
                .doc(has)
                .update({
                  postsCount: firebase.firestore.FieldValue.increment(1),
                })
                .catch((error) => console.log(error));
            } else {
              db.collection("hashtrends")
                .doc(has)
                .set({
                  hashtag: has,
                  postsCount: 1,
                  createdAt: new Date().getTime().toString(),
                })
                .catch((error) => console.log(error));
            }
          })
      );
    }

    if (!pollOnOff && !tweetAudio) {
      db.collection("posts")
        .add({
          username: profile.username,
          userId: user.uid,
          verified: false,
          text: tweetMessage,
          avatar: profile.imageUrl,
          image: tweetImage,
          createdAt: new Date().getTime().toString(),
          likes: 0,
          comments: 0,
          shares: 0,
          token: "",
          hashes: hashes,
          retweet: false,
        })
        .then((docRef) => {
          db.collection("posts")
            .doc(`${docRef.id}`)
            .update({ token: `${docRef.id}` });
        })
        .catch((error) => console.log(error));

      setTweetMessage("");
      setTweetImage("");
    } else if (option1) {
      db.collection("posts")
        .add({
          option1: option1,
          option2: option2,
          option3: option3,
          option4: option4,
          votes1: 0,
          votes2: 0,
          votes3: 0,
          votes4: 0,
          text: tweetMessage,
          createdAt: new Date().getTime().toString(),
          username: profile.username,
          userId: user.uid,
          verified: false,
          avatar: profile.imageUrl,
          likes: 0,
          comments: 0,
          shares: 0,
          token: "",
          retweet: false,
        })
        .then((docRef) => {
          db.collection("posts")
            .doc(`${docRef.id}`)
            .update({ token: `${docRef.id}` });
        })
        .catch((error) => console.log(error));

      setTweetMessage("");
      setOption1("");
      setOption2("");
      setOption3("");
      setOption4("");
      setPollOnOff(false);
    } else if (tweetAudio) {
      db.collection("posts")
        .add({
          username: profile.username,
          userId: user.uid,
          verified: false,
          text: tweetMessage,
          avatar: profile.imageUrl,
          audio: tweetAudio,
          createdAt: new Date().getTime().toString(),
          likes: 0,
          comments: 0,
          shares: 0,
          token: "",
          hashes: hashes,
          retweet: false,
        })
        .then((docRef) => {
          setPostToken(docRef.id);
          db.collection("posts")
            .doc(docRef.id)
            .update({ token: `${docRef.id}` });
        })
        .catch((error) => console.log(error));

      setTweetMessage("");
      setTweetAudio("");
    }
    setOpenEmoji(false);
    db.collection("users")
      .doc(naam)
      .get()
      .then((doc) => {
        if (doc.exists) {
          db.collection("users")
            .doc(naam)
            .collection("notificaitons")
            .add({
              avatar: profile.imageUrl,
              timestamp: new Date().getTime().toString(),
              tagUsername: profile.username,
              postId: postToken,
              seen: false,
              token: "",
            })
            .then((docRef) => {
              db.collection("users")
                .doc(naam)
                .collection("notifications")
                .doc(docRef.id)
                .update({ token: `${docRef.id}` });
            })
            .catch((error) => console.log(error));
        }
      });
  };

  const handlePoll = (e) => {
    e.preventDefault();
    if (pollOnOff) {
      setPollOnOff(false);
    } else {
      setPollOnOff(true);
    }
  };
  const addOption = (e) => {
    e.preventDefault();
    setAdded(true);
    if (!choices3) {
      setChoices3(true);
    } else if (choices3 && !choices4) {
      setChoices4(true);
    }
  };
  const removeOption = (e) => {
    e.preventDefault();
    setAdded(false);
    if (choices3 && !choices4) {
      setChoices3(false);
    } else if (choices4) {
      setChoices4(false);
    }
  };

  const closeWindow = (e) => {
    e.preventDefault();
    dispatch({ type: "CLOSE__WINDOW" });
  };

  useEffect(() => {
    //check length tweetmessage
    let len = tweetMessage.length;
    let nchar2 = 0;

    for (let i = 0; i != len; i++) {
      if (tweetMessage[i] != " ") {
        nchar2++;
      }
    }
    setNchar(nchar2);
    if (nchar2 > 250) {
      let newTweetMessage = tweetMessage;
      newTweetMessage = newTweetMessage.replace(`${newTweetMessage[newTweetMessage.length - 1]}`, "");
      setTweetMessage(newTweetMessage);
    }
    if (len > 0) {
      let testmessage = tweetMessage;
      let newmes = /@[a-z]+/i.exec(testmessage);

      if (newmes) {
        let testmes = newmes[0].split("@");
        let num = -1;

        testmes.forEach(function (val) {
          if (num < 0) {
            num++;
          } else {
            naam = val;
          }
        });

        //  finalmessage=testmessage.replace(/@[a-z]+/i,`<Link to="${naam}">${newmes}</Link>`)
        //  console.log(finalmessage)
      }
    }

    // let docje=document.getElementById("newmes")
    // docje.innerHTML=newstring
  }, [tweetMessage]);

  return !sidebar ? (
    <div className={`tweetbox ${pollOnOff && "tweetBox__extend"}`}>
      <form>
        <div className="tweetBox__input">
          <Avatar src={profile.imageUrl}></Avatar>

          <input onChange={(e) => setTweetMessage(e.target.value)} value={tweetMessage} placeholder={pollOnOff ? "Add a Question" : "What's happening?"} type="text"></input>
          <div id="newmes"></div>
          <p className="maxchar2">{nchar}/250</p>
        </div>
        <div className="pickerContainer">{openEmoji && <Picker pickerStyle={{ width: "400px" }} onEmojiClick={onEmojiClick} />}</div>

        {pollOnOff && (
          <div className="tweet__poll">
            <input className="tweet__poll__input" placeholder="Option 1" value={option1} type="text" onChange={(e) => setOption1(e.target.value)}></input>
            <input className="tweet__poll__input" placeholder="Option 2" value={option2} type="text" onChange={(e) => setOption2(e.target.value)}></input>
            {choices3 && <input className="tweet__poll__input" placeholder="Option 3" value={option3} type="text" onChange={(e) => setOption3(e.target.value)}></input>}
            {choices4 && <input className="tweet__poll__input" placeholder="Option 4" value={option4} type="text" onChange={(e) => setOption4(e.target.value)}></input>}

            {!choices3 && !choices4 && !added && (
              <IconButton onClick={addOption}>
                <AddBoxIcon />
              </IconButton>
            )}
            {choices3 && !choices4 && (
              <IconButton onClick={addOption}>
                <AddBoxIcon />
              </IconButton>
            )}
            {choices4 && (
              <IconButton onClick={removeOption}>
                <RemoveIcon />
              </IconButton>
            )}
            {choices3 && !choices4 && (
              <IconButton onClick={removeOption}>
                <RemoveIcon />
              </IconButton>
            )}
            <Tooltip title="Back">
              <IconButton onClick={() => setPollOnOff(false)}>
                <NavigateBeforeIcon />
              </IconButton>
            </Tooltip>
          </div>
        )}
        <div className="tweetBox__footer">
          <div className={`tweetBox__tweetbutton ${!tweetMessage && "tweetBox__tweetButtonO"}`}>
            <Button onClick={sendTweet} type="submit" className="tweetBox__tweetButton">
              Post
            </Button>
          </div>
          <input placeholder="ImageInput" hidden="hidden" type="file" id="imageInput" value={image} onChange={handlechangeimage}></input>

          {!tweetImage && (
            <Tooltip title="Add media">
              <IconButton onClick={handleImage}>
                <ImageIcon />
              </IconButton>
            </Tooltip>
          )}
          <div className="bytes">
            {tweetImage && (
              <div className="addedImageCon">
                <IconButton onClick={() => setTweetImage("")}>
                  <RemoveIcon />
                </IconButton>
                <img src={tweetImage.uri} alt="" className="addedImage"></img>
              </div>
            )}
          </div>
          <Tooltip title="Add Poll">
            <IconButton onClick={handlePoll}>
              <PollIcon />
            </IconButton>
          </Tooltip>
          <input placeholder="AudioInput" hidden="hidden" type="file" id="audioInput" value={audio} onChange={handlechangeaudio}></input>
          {!tweetAudio && (
            <Tooltip title="Add Audio">
              <IconButton onClick={handleAudio}>
                <AudiotrackIcon />
              </IconButton>
            </Tooltip>
          )}
          {tweetAudio && (
            <div className="addedImageCon">
              <IconButton onClick={() => setTweetAudio("")}>
                <RemoveIcon />
              </IconButton>
              {ad && <p>audio added</p>}
            </div>
          )}

          <div className="addedEmojiCon">
            <Tooltip title="Add Emoji">
              <IconButton onClick={() => setOpenEmoji(!openEmoji)}>
                <EmojiEmotionsIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </form>

      <div id="emoji"></div>
    </div>
  ) : (
    <div className="tweetbox__2">
      <IconButton onClick={closeWindow} className="repeat__closeButton">
        <HighlightOffOutlinedIcon />
      </IconButton>
      <form>
        <div className="tweetBox__input">
          <Avatar src={profile.imageUrl}></Avatar>

          <input onChange={(e) => setTweetMessage(e.target.value)} value={tweetMessage} placeholder="whats happening?" type="text"></input>
        </div>

        <div className="tweetBox__footer">
          <div className="tweetBox__tweetbutton">
            <Button onClick={sendTweet} type="submit" className="tweetBox__tweetButton">
              Tweet
            </Button>
          </div>
          <input placeholder="Edit Profile pic" hidden="hidden" type="file" id="imageInput" value={image} onChange={handlechangeimage}></input>
          <Tooltip title="Add media">
            <IconButton onClick={handleImage}>
              <ImageIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Add Poll">
            <IconButton onClick={handlePoll}>
              <PollIcon />
            </IconButton>
          </Tooltip>
        </div>
      </form>
      {pollOnOff && <div className="tweet__poll"></div>}
    </div>
  );
}

export default TweetBox;
