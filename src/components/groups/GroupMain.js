import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { useStateValue } from "../../Stateprovider";
import "../../css/GroupMain.css";
import AddIcon from "@mui/icons-material/Add";

function GroupMain(props) {
  const [{ user, profile }, dispatch] = useStateValue();
  const [following, setFollowing] = useState();
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [members, setMembers] = useState([]);
  const [showAddGroup, setShowAddGroup] = useState(false);

  useEffect(() => {
    if (profile?.username) {
      getGroups();
    }
  }, [profile]);

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
    console.log(profile.username, newGroupName);
    fetch(`https://us-central1-ms-groups.cloudfunctions.net/app/api/users/${profile?.username}/groups/add`, {
      method: "POST", // or 'PUT',

      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: {
        groupName: newGroupName,
        members: members,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
      });
  }

  function getGroups() {
    console.log("hi");
    console.log(profile?.username);
    fetch(`https://us-central1-ms-groups.cloudfunctions.net/app/api/users/${profile?.username}/groups/`, {
      method: "GET", // or 'PUT',

      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
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
    <div className="group">
      <div className="group__header">
        <h1>Groups</h1>
      </div>
      <div className="groups">
        {groups.map((doc, index) => (
          <div key={index} className="groups_elm">
            <div className="groups_elm_name">{doc.groupName}</div>
          </div>
        ))}
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
  );
}

export default GroupMain;
