import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Grid } from "@material-ui/core";
import { AccountCircle } from "@material-ui/icons";

export default function UserIcon() {
  const { currentUser } = useAuth();
  return (
    <a href="/update-profile" className="navbar-brand text-center mt-1">
      {currentUser ? (
        <Grid style={{ width: "150px" }}>
          <img
            src={currentUser.photoURL}
            height="30px"
            width="30px"
            alt="testA"
            style={{ borderRadius: 10, marginRight: "20px" }}
          ></img>
          {/* <AccountCircle style={{ marginRight: "20px" }} /> */}
          <strong style={{ fontSize: "14px" }}>
            {currentUser.email}
          </strong>
        </Grid>
      ) : null}
    </a>
  );
}
