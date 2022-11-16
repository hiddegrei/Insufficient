import "../css/Following.css";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { useStateValue } from "../Stateprovider";
import { Link } from "react-router-dom";
import { Avatar } from "@material-ui/core";
import { useParams } from "react-router-dom";

function Following() {
  const { pName } = useParams();
  const [volgendData, setVolgendData] = useState([]);
  const [{ user }, dispatch] = useStateValue();
  const [volgend, setVolgend] = useState([]);

  useEffect(() => {
    if (pName != "undefined") {
      db.collection("users")
        .doc(pName)
        .collection("following")
        .onSnapshot((snapshot) => setVolgend(snapshot.docs.map((doc) => doc.data())));
    }
  }, [user]);

  useEffect(() => {
    volgend.map((doc) => {
      db.collection("users")
        .doc(doc.username)
        .get()
        .then((doc) => {
          setVolgendData((dat) => {
            const newdata = doc.data();
            const olddata = dat.filter((dat) => dat.userId !== newdata.userId);
            return [...olddata, newdata];
          });
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    });
  }, [volgend]);

  return (
    <div className="following">
      <div className="following__header">
        <h2>Following</h2>
      </div>
      <div>
        {volgendData.map((doc) => (
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

export default Following;
