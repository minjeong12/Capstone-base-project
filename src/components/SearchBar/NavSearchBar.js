import { Box, makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

export default function NavSearchBar(props) {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const history = useHistory();

  function handleFilterTextChange(e) {
    e.preventDefault();
    setSearchKeyword(e.target.value);
  }

  const appKeyPress = (e) => {
    if (e.key === "Enter") {
      setSearchKeyword(e.target.value);
      history.push("/search/" + searchKeyword);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await props.fetchJobs();
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Box className={classes.wrapper}>
      <input
        type="text"
        id="search"
        placeholder="검색어를 입력하세요"
        onChange={handleFilterTextChange}
        onKeyPress={appKeyPress}
      />
    </Box>
  );
}

const useStyles = makeStyles((theme) => ({
  wrapper: {
    backgroundColor: "#fff",
    display: "flex",
    boxShadow: "0px 1px 5px rgba(0,0,0,0.1)",
    borderRadius: "5px",
    "& > *": {
      flex: 1,
      height: "45px",
      margin: "8px",
    },
    "& > Button": {
      flex: 1,
      height: "45px",
      margin: "8px",
      backgroundColor: "#F9D598",
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));
