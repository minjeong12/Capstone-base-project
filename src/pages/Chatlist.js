import { Card } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase/config";

export default function Chatlist(props) {
  const { currentUser, logout } = useAuth();
  const history = useHistory();
  const [user, setUser] = useState(currentUser);
  const [inputVal, setInputVal] = useState("");
  const [error, setError] = useState(null);
  const [friendsList, setFriendsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");

  async function getB() {
    setError(null);
    setLoading(true);
    try {
      const snapshot = await db.ref(`users/${currentUser.uid}/friends`).once("value");
      var list = [];
      for (const key in snapshot.val()) {
        if (snapshot.val().hasOwnProperty(key)) {
          var element = snapshot.val()[key];
          // Getting recent chat message info with chatID
          var recentMsg = await db.ref(`chats/${element.chatID}`).limitToLast(1).once("value");
          if (recentMsg.exists()) {
            const val = recentMsg.val();
            element["recentMsg"] = val[Object.keys(val)[0]].content;
            element["recentMsgTimestamp"] = val[Object.keys(val)[0]].timestamp;
          }
          list.push(element);
        }
      }
      setFriendsList(list);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  useEffect(() => {
    getB();
    if (location.query === undefined || location.query === null) {
    } else {
      setInputVal(location.query.userId);
    }
  }, []);

  // const handleChange = (event) => {
  //   setInputVal(event.target.value);
  // };

  // async function handleSubmit(event) {
  //   event.preventDefault();
  //   setError(null);
  //   var senderID = currentUser.uid;
  //   if (inputVal) {
  //     try {
  //       var receiverID = await emailToID(inputVal);
  //       if (!receiverID) throw new Error("No friend found with that email 😕");
  //       if (receiverID === senderID)
  //         throw new Error("You can't text yourself 💩");
  //       await makeFriends(senderID, receiverID);
  //       var chatID = chatIDGenerator(senderID, receiverID);
  //       history.push("/chat/" + chatID);
  //     } catch (error) {
  //       setError(error.message);
  //     }
  //   }
  // }

  async function emailToID(email) {
    const snapshot = await db.ref("users").once("value");
    for (const key in snapshot.val()) {
      // skip loop if the property is from prototype
      if (!snapshot.val().hasOwnProperty(key)) continue;
      const obj = snapshot.val()[key];
      for (const prop in obj) {
        // skip loop if the property is from prototype
        if (!obj.hasOwnProperty(prop)) continue;
        if (prop === "email" && obj[prop] === email) return obj["uid"];
      }
    }
    return null;
  }

  // async function makeFriends(currentUserID, friendID) {
  //   const currentUserObj = await (
  //     await db.ref(`users/${currentUserID}`).once("value")
  //   ).val();
  //   currentUserObj.chatID = chatIDGenerator(currentUserID, friendID);
  //   delete currentUserObj.friends; // deleting additional user property

  //   const friendObj = await (
  //     await db.ref(`users/${friendID}`).once("value")
  //   ).val();
  //   friendObj.chatID = chatIDGenerator(currentUserID, friendID);
  //   delete friendObj.friends; // deleting additional user property

  //   return (
  //     db.ref(`users/${currentUserID}/friends/${friendID}`).set(friendObj) &&
  //     db.ref(`users/${friendID}/friends/${currentUserID}`).set(currentUserObj)
  //   ); // Adding new Friend in both user's document
  // }

  function timeForToday(value) {
    const today = new Date();
    const timeValue = new Date(value);

    const betweenTime = Math.floor((today.getTime() - timeValue.getTime()) / 1000 / 60);
    if (betweenTime < 1) return "방금 전";
    if (betweenTime < 60) {
      return `${betweenTime}분 전`;
    }

    const betweenTimeHour = Math.floor(betweenTime / 60);
    if (betweenTimeHour < 24) {
      return `${betweenTimeHour}시간 전`;
    }

    const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
    if (betweenTimeDay < 365) {
      return `${betweenTimeDay}일 전`;
    }

    return `${Math.floor(betweenTimeDay / 365)}년 전`;
  }

  // function chatIDGenerator(ID1, ID2) {
  //   if (ID1 < ID2) return `${ID1}_${ID2}`;
  //   else return `${ID2}_${ID1}`;
  // }

  const { match, location } = props;

  return (
    <div style={{ width: "20%", margin: "120px auto" }}>
      {loading ? <div className="spinner" color="white"></div> : ""}
      <div className="chat-container" style={{ backgroundColor: "#fff", height: "1000px" }}>
        <header className="chat-header">
          <Link to="/" className="px-2">
            <i className="fas fa-chevron-left" style={{ color: "black" }}>
              &lt;&lt;
            </i>
          </Link>
          <div className="chat-header-title">
            <Link to="/" style={{ color: "black" }}>
              쪽지함
            </Link>
          </div>
          <div className="chat-settings">
            {/* <Link onClick={() => logout()} to="/" className="px-2"> */}
            <Link to="/" className="px-2">
              <i className="fas fa-sign-out-alt" style={{ color: "black" }}>
                나가기
              </i>
            </Link>
          </div>
        </header>
        <Card className="alert alert-success m-0 py-0 rounded-0" role="alert">
          Logged in: {user.displayName} ({user.email})
        </Card>
        {error ? (
          <div className="alert alert-danger m-0 py-0 rounded-0" role="alert">
            {error}
          </div>
        ) : null}

        {/* <form onSubmit={handleSubmit} className="chat-inputarea mt-2">
          <input
            type="email"
            placeholder="받는 사람"
            name="inputVal"
            onChange={handleChange}
            className="chat-input"
            defaultValue={inputVal}
          ></input>
          <button type="submit" className="chat-sendbtn">
            Chat
          </button>
        </form> */}

        <main className="chatarea px-0">
          <Card className="list-group" style={{ backgroundColor: "#E0F7FA" }}>
            {friendsList
              .sort((a, b) => {
                // Filters to prevent any undefined/NaN/null values from getting sorted
                // and keep Falsy values at the end of the array
                if (!a.recentMsgTimestamp) a.recentMsgTimestamp = 0;
                if (!b.recentMsgTimestamp) b.recentMsgTimestamp = 0;
                return b.recentMsgTimestamp - a.recentMsgTimestamp;
              }) // sort friends list according to recent message
              .map((friend, index) => {
                return (
                  <Link
                    key={index}
                    to={"/chat/" + friend.chatID}
                    className="list-group-item list-group-item-action rounded-0"
                  >
                    <div className="d-flex w-100 justify-content-between">
                      <h5 className="mb-0 font-weight-bold">
                        {friend.uname} | {friend.email}
                      </h5>
                      <small className="text-right">
                        {timeForToday(friend.recentMsgTimestamp)}
                      </small>
                    </div>
                    <small className="mb-1" style={{ color: "black" }}>
                      {friend.post}
                    </small>
                    <small className="text-muted">{friend.recentMsg}</small>
                  </Link>
                );
              })}
          </Card>
        </main>
      </div>
    </div>
  );
}
