import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { useStateValue } from "../../Stateprovider";
import "../../css/GroupMain.css";
import AddIcon from "@mui/icons-material/Add";
import { Avatar } from "@material-ui/core";
import Group from "./Group";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

function GroupMain(props) {
  const [{ user, profile }, dispatch] = useStateValue();
  const [following, setFollowing] = useState();
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [members, setMembers] = useState([]);
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [searchContent, setSearchContent] = useState("");
  const [output, setOutput] = useState([]);
  const [show, setShow] = useState(false);
  const [showGroup, setShowGroup] = useState(false);
  const [groupData, setGroupData] = useState([]);

  useEffect(() => {
    if (profile?.username) {
      getGroups();
    }
  }, [profile]);

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

      
    }
    if (output.length > 0) {
      setShow(true);
    }
    return () => (isSubscribed = false);
  }, [searchContent]);

  function getFollowing() {
    fetch(`https://us-central1-ms-users.cloudfunctions.net/app/api/users/${profile?.username}/following/`, {
      method: "GET", // or 'PUT',

      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        setFollowing(json);
      });
  }

  function addGroup() {
    console.log(members);
    var details = {
      groupName: newGroupName,
      members: members,
    };
    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    console.log(formBody)
    fetch(`https://us-central1-ms-groups.cloudfunctions.net/app/api/users/${profile?.username}/groups`, {
      method: "POST", // or 'PUT',

      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: formBody,
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        getGroups()
      });
  }

  function getGroups() {
    console.log("hi");
    console.log(profile?.username);
    fetch(`https://us-central1-ms-groups.cloudfunctions.net/app/api/users/${profile?.username}/groups`, {
      method: "GET", // or 'PUT',

      headers: {
        accept: "text/html,application/json",
        Connection: "keep - alive",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        setGroups(json.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <div className="group direc">
      <div className="group__header">
        <h1>{showGroup&&<ArrowBackIosIcon className="group_icon" onClick={()=>setShowGroup(!showGroup)}/>} Groups</h1>
      </div>
      {!showGroup ? (
        <div className="group_con">
          <div className="groups">
            {groups.map((doc, index) => (
              <div
                onClick={() => {
                  console.log(doc);
                  setGroupData(doc);
                  setShowGroup(true);
                }}
                key={index}
                className="groups_elm"
              >
                <div className="groups_elm_name">{doc.data.groupName}</div>
              </div>
            ))}
            {groups.length === 0 && (
              <div className="groups_elm">
                <div className="groups_elm_name">Loading...</div>
              </div>
            )}
          </div>
          {!showAddGroup && (
            <div className="groups_elm">
              <AddIcon
                fontSize="large"
                className="groups_add_icon"
                onClick={() => {
                  setShowAddGroup(true);
                }}
              />
            </div>
          )}
          {showAddGroup && (
            <div className="groups_elm">
              <div className="groups_elm_inputCon">
                <div className="groups_elm_inputCon_title">GroupName</div>
                <div className="groups_elm_inputCon_input">
                  <input onChange={(e) => setNewGroupName(e.target.value)} value={newGroupName}></input>
                </div>
              </div>

              <div className="groups_elm_inputCon">
                <div className="groups_elm_inputCon_title">GroupMembers</div>
                <div className="groups_elm_inputCon_input">
                  <input onChange={(e) => setSearchContent(e.target.value)} value={searchContent} placeholder="search for users" className="searchWidget" type="text"></input>
                </div>
              </div>
              {show && (
                <div>
                  {output.map((doc, index) => (
                    <div
                      key={index + 10}
                      onClick={() => {
                        setMembers([...members, doc.data.username]);
                        setSearchContent("");
                      }}
                      className="group__optie"
                    >
                      <Avatar src={doc.data.imageUrl || ""} />
                      <div className="group__optie__info">
                        <h2>{doc.data.username}</h2>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div
                className="groups_elm_add"
                onClick={() => {
                  addGroup();
                }}
              >
                add group
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="group_con">
          {/* {groupData.membersData.map((doc) => (
            <div>
              <div>{doc.name}</div>
              <div>{doc.waterIntakeToday}</div>
            </div>
          ))} */}
          <Group group={groupData}/>
        </div>
      )}
    </div>
  );
}

export default GroupMain;
