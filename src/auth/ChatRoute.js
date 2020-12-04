import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Redirect, Route } from "react-router-dom";

export default function ChatRoute({ component: Component, ...rest }) {
  const { currentUser } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        var cht = "/chat/:" + props.location.query.chatID;
        console.log(props.location.query.chatID);
        return currentUser.email !== props.location.query.chatID ? (
          <Component {...props} />
        ) : (
          <Redirect to={cht} />
        );
      }}
    ></Route>
  );
}
