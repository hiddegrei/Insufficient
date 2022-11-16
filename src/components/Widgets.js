import React, { useState, useEffect } from "react";
import "../css/Widgets.css";

import SearchIcon from "@material-ui/icons/Search";
import { db } from "../firebase";
import { useStateValue } from "../Stateprovider";
import { Avatar } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import Post from "./post/Post";

function Widgets() {
  const [searchContent, setSearchContent] = useState("");
  const [output, setOutput] = useState([]);
  const [show, setShow] = useState(false);
  const [showHash, setShowHash] = useState(false);
  const [searchPosts, setSearchPosts] = useState([]);
  const [hashtrends, setHashtrends] = useState([]);
  const [{ user, profile, hashTrends, dataTrendsExplore }, dispatch] = useStateValue();
  const [refresh, setRefresh] = useState(false);

  const history = useHistory();

  useEffect(() => {
    let isSubscribed = true;
    if (user && profile.username != "undefined") {
      db.collection("hashtrends")
        .orderBy("postsCount", "desc")
        .limit(10)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) =>
            isSubscribed
              ? setHashtrends((dat) => {
                  const newdata = { data: doc.data(), key: doc.data().createdAt };
                  const olddata = dat.filter((dat) => dat.data.createdAt !== newdata.data.createdAt);
                  return [...olddata, newdata];
                })
              : null
          );
          dispatch({ type: "SET_HASHTRENDS", hashTrends: [] });
          dispatch({ type: "SET_HASHTRENDS", hashTrends: hashtrends });
        })
        .catch((error) => console.log(error));
    }
    return () => (isSubscribed = false);
  }, [user]);

  useEffect(() => {
    let isSubscribed = true;
    if (searchContent && profile.username != "undefined") {
      db.collection("users")
        .where("username", ">=", searchContent)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) =>
            isSubscribed
              ? setOutput((dat) => {
                  const newdata = { data: doc.data(), key: doc.data().userId };
                  const olddata = dat.filter((dat) => dat.key !== newdata.key);

                  return [...olddata, newdata];
                })
              : null
          );
        });
    } else {
      setShow(false);
      setOutput([]);

      console.log("empty");
    }
    if (output.length > 0) {
      setShow(true);
    }
    return () => (isSubscribed = false);
  }, [searchContent]);

  //  useEffect(()=>{
  // let isSubscribed=true
  // if(searchContent&&profile.username!== undefined){
  // const splitSearchContent=searchContent.split('#')
  // let searchHash1
  //   let first=-1

  // splitSearchContent.forEach(function(val){
  // // str += '<content>'+val+'</content><br />';

  //     searchHash1=val

  // })

  // db.collection("posts").where('hashes','array-contains',searchHash1).get().then((querySnapshot) => {
  //     querySnapshot.forEach((doc) => {
  //          if(doc.exists&&isSubscribed){
  //         // doc.data() is never undefined for query doc snapshots

  // setSearchPosts((dat)=>{
  //      const newdata=doc.data()
  // const olddata=dat.filter((dat)=>dat.token!==newdata.token)

  //     return[...olddata,newdata]

  //  })
  //  setShowHash(true)
  //    }else{console.log('hashes not found')}
  // })}).catch((error)=>console.log(error));
  // }else{setShowHash(false)
  //     setSearchPosts([])}
  // return () => isSubscribed = false
  //  },[searchContent])

  const handleTrend = (e) => {
    e.preventDefault();
    // dispatch({type:'SET_DATATRENDSEXPLORE',hashtag:doc.data.hashtag})
    // dispatch({type:'OPEN_OpenTrendExplore',OpenTrendExplore:true})
  };
  useEffect(() => {
    setTimeout(() => {
      setRefresh(!refresh);
    }, 10000);
  }, []);

  return (
    <div className="widgets">
      <div className="widgets__input">
        <SearchIcon />

        <input onChange={(e) => setSearchContent(e.target.value)} value={searchContent} placeholder="search for users" className="searchWidget" type="text"></input>
      </div>

      <div className="widgets__widgetContainer">
        <h2>Trends</h2>
        {hashtrends.map((doc) => (
          <div
            onClick={() => {
              dispatch({ type: "SET_DATATRENDSEXPLORE", hashtag: doc.data.hashtag });
              dispatch({ type: "OPEN_OPENTRENDEXPLORE", OpenTrendExplore: true });
              history.push("/explore");
            }}
            className="widget__hashoptie"
          >
            <h3>#{doc.data.hashtag}</h3>
            <p>{doc.data.postsCount} tweets</p>
          </div>
        ))}

        {show && (
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
          </div>
        )}
        {/* {showHash&&
    <div>
    {searchPosts.map(post=>(
        <div className="widget__optie">
     <Post
      key={post.createdAt}
         audio={post.audio}
        token={post.token}
        userId={post.userId}
        displayName={post.displayName}
        username={post.username}
        verified={post.verified}
        text={post.text}
         avatar={post.avatar}
        image={post.image}
        createdAt={post.createdAt}
        likes={post.likes}
        comments={post.comments}
        shares={post.shares}
        option1={post.option1}
        option2={post.option2}
        option3={post.option3}
        option4={post.option4}
        votes1={post.votes1}
        votes2={post.votes2}
        votes3={post.votes3}
        votes4={post.votes4}
        Rusername={post.Rusername}
        Rimage={post.Rimage}
        Rtext={post.Rtext}
        Ravatar={post.Ravatar}
        
     
     />
     </div>
    ))}

    </div>} */}
      </div>
    </div>
  );
}

export default Widgets;
