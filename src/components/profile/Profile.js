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
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";

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
  const [stravaData, setStravaData] = useState([]);

  useEffect(() => {
    let isSubscribed = true;
    const date = new Date();
    let months = [
      "Januari",
      "Februari",
      "Maart",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Augustus",
      "September",
      "Oktober",
      "November",
      "December",
    ];
    const [month, day, year] = [
      months[date.getMonth()],
      date.getDate(),
      date.getFullYear(),
    ];

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
                  const newdata = {
                    data: doc.data(),
                    createdAt2: doc.data().createdAt,
                  };
                  const olddata = dat.filter(
                    (dat) => dat.data.token !== newdata.data.token
                  );
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
                  const olddata = dat.filter(
                    (dat) => dat.createdAt !== newdata.createdAt
                  );
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
                    const newdata = {
                      data: doc2.data(),
                      Rtweeter: retweeter,
                      id: Math.random().toString(36),
                      RcreatedAt: createdA,
                      createdAt2: createdA,
                    };

                    const olddata = dat.filter(
                      (dat2) => dat2.data.token !== newdata.data.token
                    );
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
  useEffect(() => {
    fetch(`https://us-central1-ms-strava.cloudfunctions.net/app/api/users/${profile?.username}/activities`,
      {
        method: "GET", // or 'PUT'
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
         
        },
      }
    )
      .then((res) => res.json())
      .then((json) => {
        console.log(json.data);

        if(json.data.message==undefined){
          console.log('hi')
          setStravaData(json.data);
        

        }
        
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function getTime(seconds) {
    var date = new Date(null);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
  }

  function handleStravaClick(id){
    console.log(id)
    fetch(`https://us-central1-ms-strava.cloudfunctions.net/app/api/users/${profile?.username}/activities/${id}/streams`, {
           method: "GET", // or 'PUT'
           headers: {
             "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
           },
          
         })
           .then((res) => res.json())
           .then((json) => {
             console.log(json);
             
             
            calcEverything(json,id)
                
             
           })
          
  }
  async function calcEverything(json,idd){
    console.log(idd)
    let oneMin=await calc1min(json.data.watts.data)
    let twoMin=await calc2min(json.data.watts.data)
    console.log(oneMin,twoMin)

    db.collection("users").doc(profile?.username).collection("activities").doc(`${idd}`).get().then((doc)=>{
      if(!doc.exists){
        db.collection("users").doc(profile?.username).collection("activities").doc(`${idd}`).set({
          oneMin:oneMin,
          twoMin:twoMin
        })

      }
    }).then((doc)=>{

    }).catch((err)=>{
      console.log(err)
    })

  }

  async function calc1min(watts){
    let record=0;
    for(let i=0;i<watts.length;i++){
      let temp=0;
      for(let j=i;j<i+60;j++){
        temp+=watts[j]}
      if(temp/60>record){
        record=temp/60;}}
     return record;
  }
  async function calc2min(watts){
    let record=0;
    for(let i=0;i<watts.length;i++){
      let temp=0;
      let theEnd=watts.length-i
      if(theEnd>=120){
        for(let j=i;j<i+120;j++){
        temp+=watts[j]}
      if(temp/120>record){
        record=temp/120;}}
      }
     return record;
  }

  return (
    <div>
      
        <div>
          

          {stravaData?.map((doc) => (
            <div onClick={()=>{handleStravaClick(doc.id)}} id="clickable" className="post">
              <div className="post__avatar">
                {/* <Link to={`/profile/${username}`}> */}
                {profile?.avatar ? (
                  <img src={profile?.avatar} className="post__profile__pic" />
                ) : (
                  <Avatar className="post__profile__pic" src="" />
                )}
                {/* </Link> */}
              </div>

              <div className="post__body">
                <div className="post__header">
                  <div className="post__headerText">
                    <h3>
                      {" "}
                      {profile?.username}
                      {""}
                      <span className="post__headerSpecial">
                        @{profile?.username}
                        <FiberManualRecordIcon
                          style={{ fontSize: "small", marginLeft: "2px" }}
                        />
                      </span>
                    </h3>
                  </div>

                  <div className="profile_stravaCon">
                    <div className="profile_stravaCon_header">{doc.name}</div>
                    <div className="profile_stravaCon_con_row">
                      <div className="profile_stravaCon_con">
                        <div className="profile_stravaCon_header">Distance</div>
                        <div className="profile_stravaCon_elm">
                          {doc.distance} m
                        </div>
                      </div>

                      <div className="profile_stravaCon_con">
                        <div className="profile_stravaCon_header">Avg hr</div>
                        <div className="profile_stravaCon_elm">
                          {doc.average_heartrate}
                        </div>
                      </div>

                      <div className="profile_stravaCon_con">
                        <div className="profile_stravaCon_header">Max hr</div>
                        <div className="profile_stravaCon_elm">
                          {doc.max_heartrate}
                        </div>
                      </div>
                    </div>

                    <div className="profile_stravaCon_con_row">
                      <div className="profile_stravaCon_con">
                        <div className="profile_stravaCon_header">
                          Time elapsed
                        </div>
                        <div className="profile_stravaCon_elm">
                          {getTime(doc.elapsed_time)}
                        </div>
                      </div>

                      <div className="profile_stravaCon_con">
                        <div className="profile_stravaCon_header">
                          Avg speed
                        </div>
                        <div className="profile_stravaCon_elm">
                          {doc.average_speed}
                        </div>
                      </div>

                      <div className="profile_stravaCon_con">
                        <div className="profile_stravaCon_header">
                          Suffer score
                        </div>
                        <div className="profile_stravaCon_elm">
                          {doc.suffer_score}
                        </div>
                      </div>
                    </div>

                    <div className="profile_stravaCon_con_row">
                      <div className="profile_stravaCon_con">
                        <div className="profile_stravaCon_header">
                          Water needs
                        </div>
                        <div className="profile_stravaCon_elm">
                        {(doc.suffer_score*10)}ml
                        </div>
                      </div>

                     
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      
    </div>
  );
}

export default Profile;
