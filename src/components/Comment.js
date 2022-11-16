import React from "react";
import "../css/Comment.css";
import { Link, useHistory } from "react-router-dom";
import { Avatar } from "@material-ui/core";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";

function Comments({ text, username, avatar, verified }) {
  return (
    <div className="comment">
      <div className="post__avatar">
        <Link to={`/profile/${username}`}>{avatar ? <img src={avatar} className="post__profile__pic" /> : <Avatar className="post__profile__pic" src="" />}</Link>
      </div>

      <div className="post__body">
        <div className="post__header">
          <div className="post__headerText">
            <h3>
              {" "}
              {username}
              {""}
              <span className="post__headerSpecial">
                {verified && <VerifiedUserIcon className="post__badge"></VerifiedUserIcon>}@{username}
              </span>
            </h3>
          </div>

          <div className="post__headerDescription">
            <p>{text}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Comments;
