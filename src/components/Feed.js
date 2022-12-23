import React, { useEffect, useState } from "react";
import TweetBox from "./TweetBox";
import "../css/Feed.css";
import Post from "./post/Post";
import { db } from "../firebase";
import FlipMove from "react-flip-move";
import { useStateValue } from "../Stateprovider";
import { Link } from "react-router-dom";

function Feed({mobile}) {
  const [posts, setPosts] = useState([]);
  const [{ user, profile }, dispatch] = useStateValue();
  const [feedData, setFeedData] = useState([]);
  const [retweetData, setRetweetData] = useState([]);
  const [rposts, setRposts] = useState([]);
  const [postsBucket, setPostsBucket] = useState([]);
  const [update, setUpdate] = useState(false);
  const [doubleposts, setDoubleposts] = useState([]);
  const [likersPostsId, setLikersPostsId] = useState([]);
  const [likersPosts, setLikersPosts] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setUpdate(!update);
    }, 700);
  }, []);

  useEffect(() => {
    let isSubscribed = true;
    if (user && profile.username != "undefined") {
      db.collection("users")
        .doc(`${profile.username}`)
        .collection("following")
        .onSnapshot((snapshot) => (isSubscribed ? setFeedData(snapshot.docs.map((doc) => doc.data())) : null));
    } else {
      console.log();
    }
    return () => (isSubscribed = false);
  }, [user, update]);

  useEffect(() => {
    let isSubscribed = true;
    if (feedData.length > 0 && profile.username != "undefined" && isSubscribed) {
      feedData.map((doc) => {
        const liker1 = doc.username;

        db.collection("users")
          .doc(liker1)
          .collection("likedposts")
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) =>
              setLikersPostsId((dat) => {
                const newdata = { data: doc.data(), liker: liker1 };
                const olddata = dat.filter((dat) => dat.data.postId !== newdata.data.postId);
                return [...olddata, newdata];
              })
            );
          })
          .catch((error) => (isSubscribed ? console.log(error) : null));
      });
    } else {
      console.log();
    }
    return () => (isSubscribed = false);
  }, [feedData, user]);

  //
  //
  //
  useEffect(() => {
    let isSubscribed = true;
    if (likersPostsId.length > 0 && isSubscribed) {
      likersPostsId.map((doc) => {
        const liker1 = doc.liker;
        const createdA = doc.data.createdAt;

        db.collection("posts")
          .doc(doc.data.postId)
          .get()
          .then((doc) => {
            setLikersPosts((dat) => {
              const newdata = { data: doc.data(), liker: liker1, id: Math.random().toString(36), createdAt: createdA, createdAt2: createdA };

              const olddata = dat.filter((dat2) => dat2.data.token !== newdata.data.token);
              return [...olddata, newdata];
            });
          })
          .catch((error) => (isSubscribed ? console.log(error) : null));
      });
    } else {
      console.log();
    }
    return () => (isSubscribed = false);
  }, [likersPostsId, user]);

  //
  //
  //
  useEffect(() => {
    let isSubscribed = true;
    if (feedData.length > 0 && profile.username != "undefined") {
      feedData.map((doc) => {
        db.collection("posts")
          .orderBy("createdAt", "desc")
          .limit(10)
          .where("userId", "==", doc.userId)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) =>
              isSubscribed
                ? setPosts((dat) => {
                    const newdata = { data: doc.data(), createdAt2: doc.data().createdAt, id: Math.random().toString(36) };
                    const olddata = dat.filter((dat) => dat.data.token !== newdata.data.token);
                    return [...olddata, newdata];
                  })
                : null
            );
          })
          .catch((error) => (isSubscribed ? console.log(error) : null));
      });
    } else {
      console.log();
    }
    return () => (isSubscribed = false);
  }, [feedData, user]);

  //
  //
  //
  useEffect(() => {
    let isSubscribed = true;
    if (feedData.length > 0 && profile.username != "undefined") {
      feedData.map((doc) => {
        db.collection("users")
          .doc(doc.username)
          .collection("retweets")
          .limit(10)
          .where("Rusername", "==", doc.username)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) =>
              isSubscribed
                ? setRetweetData((dat) => {
                    const newdata = doc.data();
                    const olddata = dat.filter((dat) => dat.token !== newdata.token);
                    return [...olddata, newdata];
                  })
                : null
            );
          })
          .catch((error) => (isSubscribed ? console.log(error) : null));
      });
    } else {
      console.log();
    }
    return () => (isSubscribed = false);
  }, [feedData, user]);

  useEffect(() => {
    let isSubscribed = true;
    if (retweetData.length > 0) {
      retweetData.map((doc) => {
        const retweeter = doc.Rusername;
        const createdA = doc.createdAt;

        db.collection("posts")
          .orderBy("createdAt", "desc")
          .limit(10)
          .where("token", "==", doc.token)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) =>
              isSubscribed
                ? setRposts((dat) => {
                    const newdata = { data: doc.data(), Rtweeter: retweeter, id: Math.random().toString(36), RcreatedAt: createdA, createdAt2: createdA };

                    const olddata = dat.filter((dat2) => dat2.data.token !== newdata.data.token);
                    return [...olddata, newdata];
                  })
                : null
            );
          })
          .catch((error) => (isSubscribed ? console.log(error) : null));
      });
    } else {
      console.log();
    }
    return () => (isSubscribed = false);
  }, [retweetData, user]);

  // useEffect(()=>{
  //     let isSubscribed = true;
  // posts.map((doc)=>(
  //    // console.log(doc.data)
  //    (isSubscribed?
  // setRposts((dat)=>{
  //      const newdata={data:doc.data,id:doc.data.token}
  // const olddata=dat.filter((dat)=>dat.data.token!==newdata.data.token)

  //     return[...olddata,newdata]

  //  }):null)

  // ))

  // return () => isSubscribed = false
  // },[posts,user])

  useEffect(() => {
    var newArray = rposts.concat(posts);
    var newArray2 = newArray.concat(likersPosts);
    setDoubleposts(newArray2);
  }, [rposts, posts]);

  function compareValues(key, order = "asc") {
    return function innerSort(a, b) {
      let varA;
      let varB;

      if (!a.hasOwnProperty(key) && b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        //   varA=a.data.createdAt
        //   varB=a.RcreatedAt
        varA = a.createdAt2;
        varB = b.createdAt2;
      } else if (a.hasOwnProperty(key) && !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        //   varA=a.RcreatedAt
        //   varB=a.data.createdAt
        varA = a.createdAt2;
        varB = b.createdAt2;
      } else if (!a.hasOwnProperty(key) && !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        //   varA=a.data.createdAt
        //   varB=a.data.createdAt

        varA = a.createdAt2;
        varB = b.createdAt2;
      } else if (a.hasOwnProperty(key) && b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        varA = a.createdAt2;
        varB = b.createdAt2;
      }

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return order === "desc" ? comparison * -1 : comparison;
    };
  }
  if (doubleposts != undefined) {
    doubleposts.sort(compareValues("createdAt2", "desc"));
  }

  //console.log(doubleposts)

  return (
    <div className={`feed ${mobile&&"feed2"}`}>
      <div className="feed__header">
        <h2>Home</h2>
      </div>
      {user ? (
        <TweetBox />
      ) : (
        <Link to="/login">
          <div className="feed__tweetbox">Please Sign In to post</div>
        </Link>
      )}

      {update ? (
        <div>
          {doubleposts.map((post) => (
            <Post key={post.id} audio={post.data.audio} token={post.data.token} userId={post.data.userId} displayName={post.data.displayName} username={post.data.username} verified={post.data.verified} text={post.data.text} avatar={post.data.avatar} image={post.data.image} createdAt={post.data.createdAt} likes={post.data.likes} comments={post.data.comments} shares={post.data.shares} option1={post.data.option1} option2={post.data.option2} option3={post.data.option3} option4={post.data.option4} votes1={post.data.votes1} votes2={post.data.votes2} votes3={post.data.votes3} votes4={post.data.votes4} Rusername={post.data.Rusername} Rimage={post.data.Rimage} Rtext={post.data.Rtext} Ravatar={post.data.Ravatar} Rtweeter={post.Rtweeter} RcreatedAt={post.RcreatedAt} liker={post.liker} likerCreatedAt={post.createdAt} />
          ))}
        </div>
      ) : (
        <div className="loading">
          <p>Loading....</p>
        </div>
      )}
    </div>
  );
}

export default Feed;
