import React, { useEffect, useState } from "react";
import "../css/Explore.css";
import Post from "./post/Post";
import { db } from "../firebase";
import { useStateValue } from "../Stateprovider";
import SearchIcon from "@material-ui/icons/Search";
import { Link } from "react-router-dom";
import { Avatar, IconButton } from "@material-ui/core";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { useHistory } from "react-router-dom";

function Explore() {
  const history = useHistory();
  const [posts, setPosts] = useState([]);
  const [{ user, hashTrends, dataTrendsExplore, OpenTrendExplore }, dispatch] = useStateValue();
  const [moreMore, setMoreMore] = useState(false);
  const [searchContent, setSearchContent] = useState("");
  const [show, setShow] = useState(false);
  const [output, setOutput] = useState([]);
  const [searchPosts, setSearchPosts] = useState([]);
  const [widgetTrends, setWidgetTrends] = useState([]);

  useEffect(() => {
    if (dataTrendsExplore) {
      db.collection("posts")
        .orderBy("createdAt", "desc")
        .limit(10)
        .where("hashes", "array-contains", dataTrendsExplore)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            setWidgetTrends((dat) => {
              const newdata = doc.data();
              const olddata = dat.filter((dat) => dat.hashes[0] == dataTrendsExplore);
              const newolddata = olddata.filter((dat) => dat.token !== newdata.token);

              return [...newolddata, newdata];
            });
          });
        })
        .catch((error) => console.log(error));
    } else {
      dispatch({ type: "OPEN_OPENTRENDEXPLORE", OpenTrendExplore: false });
    }
  }, [dataTrendsExplore]);

  useEffect(() => {
    let isSubscribed = true;
    dispatch({ type: "OPEN_OPENTRENDEXPLORE", OpenTrendExplore: false });

    db.collection("posts")
      .orderBy("createdAt", "desc")
      .limit(10)
      .onSnapshot((snapshot) => {
        if (isSubscribed) {
          setPosts(snapshot.docs.map((doc) => doc.data()));
        }
      });
    return () => (isSubscribed = false);
  }, []);

  useEffect(() => {
    if (searchContent) {
      dispatch({ type: "OPEN_OPENTRENDEXPLORE", OpenTrendExplore: false });
      db.collection("users")
        .doc(searchContent)
        .get()
        .then((doc) => {
          if (doc.exists && output.length < 5) {
            setOutput((dat) => {
              const newdata = { data: doc.data(), key: doc.data().userId };
              const olddata = dat.filter((dat) => dat.key !== newdata.key);

              return [...olddata, newdata];
            });
            setShow(true);
          } else {
            console.log("doc not found");
          }
        })
        .catch((error) => console.log(error));
    } else {
      setShow(false);
      setOutput([]);
    }
  }, [searchContent]);

  useEffect(() => {
    let isSubscribed = true;
    if (searchContent) {
      const splitSearchContent = searchContent.split("#");
      let searchHash1;
      let first = -1;

      splitSearchContent.forEach(function (val) {
        // str += '<content>'+val+'</content><br />';

        searchHash1 = val;
      });
      db.collection("posts")
        .where("hashes", "array-contains", searchHash1)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (doc.exists && isSubscribed && searchPosts.length < 20) {
              // doc.data() is never undefined for query doc snapshots

              setSearchPosts((dat) => {
                const newdata = doc.data();
                const olddata = dat.filter((dat) => dat.token !== newdata.token);

                return [...olddata, newdata];
              });
              setShow(true);
            } else {
              console.log("hashes not found");
            }
          });
        })
        .catch((error) => console.log(error));
    } else {
      setShow(false);
      setSearchPosts([]);
    }
    return () => (isSubscribed = false);
  }, [searchContent]);

  return (
    <div className="explore direc">
      <div className="explore__header">
        <div className="explore__header__left">
          {user ? <h2>Explore</h2> : <h2 onClick={()=>history.push("/login")}>Please Sign In to post and interact with other users</h2>}
          <div>{OpenTrendExplore && <ArrowBackIosIcon className="explore__header__left__but" onClick={() => dispatch({ type: "OPEN_OPENTRENDEXPLORE", OpenTrendExplore: false })} />}</div>
        </div>

        {user && (
          <div className="widgets__input">
            <SearchIcon />

            <input onChange={(e) => setSearchContent(e.target.value)} value={searchContent} placeholder="search for users or hashtags" className="SearchTwitter" type="text"></input>
          </div>
        )}
      </div>

      {OpenTrendExplore ? (
        <div>
          {widgetTrends.map((post) => (
            <Post key={post.createdAt} token={post.token} userId={post.userId} displayName={post.displayName} username={post.username} verified={post.verified} text={post.text} avatar={post.avatar} image={post.image} createdAt={post.createdAt} likes={post.likes} comments={post.comments} shares={post.shares} option1={post.option1} option2={post.option2} option3={post.option3} option4={post.option4} votes1={post.votes1} votes2={post.votes2} votes3={post.votes3} votes4={post.votes4} />
          ))}
        </div>
      ) : (
        <div>
          {!show ? (
            <div>
              {posts.map((post) => (
                <Post key={post.createdAt} audio={post.audio} token={post.token} userId={post.userId} displayName={post.displayName} username={post.username} verified={post.verified} text={post.text} avatar={post.avatar} image={post.image} createdAt={post.createdAt} likes={post.likes} comments={post.comments} shares={post.shares} option1={post.option1} option2={post.option2} option3={post.option3} option4={post.option4} votes1={post.votes1} votes2={post.votes2} votes3={post.votes3} votes4={post.votes4} Rusername={post.Rusername} Rimage={post.Rimage} Rtext={post.Rtext} Ravatar={post.Ravatar} />
              ))}
            </div>
          ) : (
            <div>
              {output.map((doc) => (
                <Link to={`/profile/${doc.data.username}`}>
                  <div className="widget__optie">
                    <Avatar src={doc.data.imageUrl || ""} />
                    <div className="widget__optie__info">
                      <h2>{doc.data.username}</h2>
                    </div>
                  </div>
                </Link>
              ))}

              {searchPosts.map((post) => (
                <Post key={post.createdAt} token={post.token} userId={post.userId} displayName={post.displayName} username={post.username} verified={post.verified} text={post.text} avatar={post.avatar} image={post.image} createdAt={post.createdAt} likes={post.likes} comments={post.comments} shares={post.shares} option1={post.option1} option2={post.option2} option3={post.option3} option4={post.option4} votes1={post.votes1} votes2={post.votes2} votes3={post.votes3} votes4={post.votes4} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Explore;
