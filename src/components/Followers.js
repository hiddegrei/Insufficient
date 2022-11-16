import "../css/Followers.css";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { useStateValue } from "../Stateprovider";
import { Link } from "react-router-dom";
import { Avatar } from "@material-ui/core";
import { useParams } from "react-router-dom";

function Followers() {
  const { pName } = useParams();
  const [volgersData, setVolgersData] = useState([]);
  const [{ user }, dispatch] = useStateValue();
  const [volgers, setVolgers] = useState([]);

  useEffect(() => {
    if (pName != "undefined") {
      db.collection("users")
        .doc(pName)
        .collection("followers")
        .onSnapshot((snapshot) => setVolgers(snapshot.docs.map((doc) => doc.data())));
    }
  }, [user]);

  useEffect(() => {
    volgers.map((doc) => {
      db.collection("users")
        .doc(doc.username)
        .get()
        .then((doc) => {
          setVolgersData((dat) => {
            const newdata = doc.data();
            const olddata = dat.filter((dat) => dat.userId !== newdata.userId);
            return [...olddata, newdata];
          });
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    });
  }, [volgers]);

  return (
    <div className="followers">
      <div className="followers__header">
        <h2>Followers</h2>
      </div>
      <div>
        {volgersData.map((doc) => (
          <Link to={`/profile/${doc.username}`}>
            <div className="followers__optie">
              <Avatar src={doc.imageUrl} />
              <div className="followers__optie__info">
                <h2>{doc.username}</h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Followers;
