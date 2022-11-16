import React, { useState, useEffect } from "react";
import "../../css/Profile.css";
import { useStateValue } from "../../Stateprovider";
import { Avatar, IconButton } from "@material-ui/core";
import { db } from "../../firebase";
import EditIcon from "@material-ui/icons/Edit";
import { Link, useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import Post from "../post/Post";
import firebase from "firebase";
import EmailOutlinedIcon from "@material-ui/icons/EmailOutlined";

function Profile() {
  const { pName } = useParams();
  const history = useHistory();

  const [{ user, profile, handle }, dispatch] = useStateValue();

  const [newProfile, setNewProfile] = useState("");
  const [profileMain, setProfileMain] = useState([]);
  const [allow, setAllow] = useState(false);
  const [follow, setFollow] = useState(false);
  const [poster, setPoster] = useState([]);

  const [userfollowing, setUserfollowing] = useState(0);
  const [myposts, setMyposts] = useState([]);
  const [retweetData, setRetweetData] = useState([]);
  const [rposts, setRposts] = useState([]);
  const [update, setUpdate] = useState(false);
  const [doubleposts, setDoubleposts] = useState([]);

  const [waterToday, setWaterToday] = useState();

  useEffect(() => {
    let isSubscribed = true;
    const date = new Date();
    let months = ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"];
    const [month, day, year] = [months[date.getMonth()], date.getDate(), date.getFullYear()];

    if (user && pName != "undefined") {
      db.collection("users")
        .doc(pName)
        .collection("calender")
        .doc(`${year}`)
        .collection(month)
        .doc(`${day}`)
        .get()
        .then((doc) => {
          if (isSubscribed) {
            setWaterToday(doc.data());
            console.log(doc.data());
          } else {
            console.log("component not mounted");
          }
        });
    }
    return () => (isSubscribed = false);
  }, []);

  useEffect(() => {
    let isSubscribed = true;

    setTimeout(() => {
      if (isSubscribed) {
        setUpdate(!update);
      } else {
        console.log("component not mounted");
      }
    }, 700);

    return () => (isSubscribed = false);
  }, [user]);

  useEffect(() => {
    let isSubscribed = true;
    if (user && pName != "undefined") {
      db.collection("posts")
        .orderBy("createdAt", "desc")
        .limit(10)
        .where("username", "==", pName)
        .where("retweet", "==", false)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) =>
            isSubscribed
              ? setMyposts((dat) => {
                  const newdata = { data: doc.data(), createdAt2: doc.data().createdAt };
                  const olddata = dat.filter((dat) => dat.data.token !== newdata.data.token);
                  return [...olddata, newdata];
                })
              : null
          );
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });

      db.collection("users")
        .doc(pName)
        .collection("retweets")
        .orderBy("createdAt", "desc")
        .limit(10)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) =>
            isSubscribed
              ? setRetweetData((dat) => {
                  const newdata = doc.data();
                  const olddata = dat.filter((dat) => dat.createdAt !== newdata.createdAt);
                  return [...olddata, newdata];
                })
              : null
          );
        })
        .catch((error) => (isSubscribed ? console.log(error) : null));
    }

    return () => (isSubscribed = false);
  }, [user, update]);

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
            querySnapshot.forEach((doc2) =>
              isSubscribed
                ? setRposts((dat) => {
                    const newdata = { data: doc2.data(), Rtweeter: retweeter, id: Math.random().toString(36), RcreatedAt: createdA, createdAt2: createdA };

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

  useEffect(() => {
    let isSubscribed = true;

    if (profile && pName != "undefined" && isSubscribed) {
      db.collection("users")
        .doc(`/${profile.username}/following/${pName}`)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setFollow(true);
          } else {
            setFollow(false);
          }
        })
        .catch((error) => console.log(error));
    } else {
      console.log("no profile");
    }

    return () => (isSubscribed = false);
  }, [follow]);

  // useEffect(()=>{
  //     let isSubscribed = true;
  // myposts.map((doc)=>(
  //    // console.log(doc.data)
  //    (isSubscribed?
  // setRposts((dat)=>{
  //      const newdata={data:doc.data,id:doc.data.createdAt,createdAt2:doc.data.createdAt}

  // //const olddata=dat.filter((dat2)=>dat2.createdAt2!==newdata.createdAt2)
  // //console.log(olddata)

  //     return[...dat,newdata]

  //  }):null)

  // ))

  // return () => isSubscribed = false
  // },[myposts,user])

  useEffect(() => {
    var newArray = rposts.concat(myposts);

    setDoubleposts(newArray);
  }, [rposts, myposts]);

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

  return (
    //     <div className="profile">
    //         <div className="profile__header">
    //         <h1 >Profile</h1>
    //         </div>

    //         <div className="profile__body">
    //             <div className="profile__avatar">
    //             {profileMain.imageUrl?

    //             <img src={profileMain.imageUrl} className="profile__a"/>
    //             :<Avatar className="profile__a" src=''/>}

    //            <h3 className="profile__option">{profileMain?`@ ${profileMain?.username}`:"@ "}</h3>
    //            <Link to={`/profile/${pName}/edit`}>
    //                {!allow&&user?

    //                <div className="followbutton">
    //                    <IconButton onClick={handleMessage} className="profile__followf"><EmailOutlinedIcon/></IconButton>
    //                  {/* <button onClick={handleMessage} className="profile__followf">Message</button> */}
    //                {!follow?
    //  <button onClick={handleFollow} className="profile__followf">Follow</button>:
    //  <button onClick={handleFollow} className="profile__2followf">Unfollow</button>}
    //  </div>:<div></div>}
    //            {allow&&
    //            <div  className="profile__edit" > <EditIcon/> Edit Profile</div>}

    //            </Link>
    //              <div className="profile__commentsContainer">

    //              </div>
    //             </div>

    //             <div className="profile__bio">
    //             <h4>{profileMain.bio}</h4>

    //         </div>
    //         <div className="profile__follow">
    //             <Link to={`/profile/followers/${pName}`}>
    //             <div className="profile__num">followers : {profileMain?.followers}</div>
    //             </Link>
    //             <Link to={`/profile/following/${pName}`}>
    //             <div className="profile__num">following : {profileMain?.following}</div>
    //             </Link>
    //         </div>

    //         </div>
    //         <div className="postOptions">
    //             <div className="postOptions__optionA">
    //                 <Link to={`/profile/${pName}`}>
    //               <h3>Posts</h3>
    //               </Link>
    //             </div>
    //             <div className="postOptions__option">
    //                 <Link to={`/profile/${pName}/likes`}>
    //                  <h3>Likes</h3>
    //                  </Link>
    //             </div>
    //         </div>

    //         <div className="profile__myposts">
    //   {update?
    <div>
      {doubleposts != undefined ? (
        <div>
          {doubleposts.map((post) => (
            <Post key={post.RcreatedAt ? post.RcreatedAt : post.data.createdAt} audio={post.data.audio} token={post.data.token} userId={post.data.userId} displayName={post.data.displayName} username={post.data.username} verified={post.data.verified} text={post.data.text} avatar={post.data.avatar} image={post.data.image} createdAt={post.data.createdAt} likes={post.data.likes} comments={post.data.comments} shares={post.data.shares} option1={post.data.option1} option2={post.data.option2} option3={post.data.option3} option4={post.data.option4} votes1={post.data.votes1} votes2={post.data.votes2} votes3={post.data.votes3} votes4={post.data.votes4} Rusername={post.data.Rusername} Rimage={post.data.Rimage} Rtext={post.data.Rtext} Ravatar={post.data.Ravatar} Rtweeter={post.Rtweeter} RcreatedAt={post.RcreatedAt} />
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

export default Profile;
