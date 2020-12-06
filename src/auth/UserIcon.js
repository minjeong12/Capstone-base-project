import React, { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { AccountCircle } from "@material-ui/icons";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";

export default function UserIcon() {
  const { currentUser } = useAuth();

  useEffect(() => {}, [currentUser]);

  return (
    <div>
      {currentUser ? (
        <Button style={{ marginRight: "5px" }}>
          <Link
            to={"/update-profile"}
            style={{
              textDecoration: "none",
              color: "#fff",
              fontSize: 22,
              alignItem: "flex-start",
            }}
          >
            <AccountCircle style={{ marginRight: "20px", color: "white" }} />
            <strong style={{ fontSize: "10px", alignItem: "center" }}>
              {currentUser.displayName}님{/* {currentUser.email} */}
            </strong>
          </Link>
        </Button>
      ) : null}
    </div>
  );
}
