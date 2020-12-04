import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  makeStyles,
  Typography,
} from "@material-ui/core";
import {
  Close as CloseIcon,
  MailOutline as MessageIcon,
} from "@material-ui/icons";
import * as dateFns from "date-fns";
import { useAuth } from "../../contexts/AuthContext";
import UpdateJobModal from "./UpdateJobModal";
import { Link, useHistory } from "react-router-dom";
import defaultImage from "../../assets/sampleImage.PNG";
import { db } from "../../firebase/config";
import { useEffect } from "react";

export default (props) => {
  const classes = useStyles();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [updateJobModal, setUpdateJobModal] = useState(false);
  const [error, setError] = useState(null);
  const [inputVal, setInputVal] = useState("");
  const history = useHistory();

  console.log("props.job.chatId", props.job.chatId);

  const closeModal = () => {
    setLoading(false);
    props.closeModal();
  };

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

  // async function handleSubmit(event) {
  //   event.preventDefault();
  // async function handleSubmit() {
  //   console.log("submit");
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

  function hist(chatID) {
    history.push("/chat/" + chatID);
  }

  const appKeyPress = async (e) => {
    setError(null);
    var senderID = currentUser.uid;
    if (inputVal) {
      try {
        console.log(inputVal);
        var receiverID = await emailToID(inputVal);
        console.log(receiverID);
        console.log(senderID);

        if (!receiverID) throw new Error("No friend found with that email 😕");
        if (receiverID === senderID)
          throw new Error("You can't text yourself 💩");

        await makeFriends(senderID, receiverID);
        console.log(receiverID);
        console.log(senderID);
        var chatID = chatIDGenerator(senderID, receiverID);
        console.log(chatID);

        hist(chatID);
        // history.push("/chat/" + chatID);
      } catch (error) {
        console.log(error.message);
        console.log("error");
        setError(error.message);
      }
    }
  };

  async function makeFriends(currentUserID, friendID) {
    const currentUserObj = await (
      await db.ref(`users/${currentUserID}`).once("value")
    ).val();
    currentUserObj.chatID = chatIDGenerator(currentUserID, friendID);
    delete currentUserObj.friends; // deleting additional user property

    const friendObj = await (
      await db.ref(`users/${friendID}`).once("value")
    ).val();
    friendObj.chatID = chatIDGenerator(currentUserID, friendID);
    delete friendObj.friends; // deleting additional user property

    return (
      db.ref(`users/${currentUserID}/friends/${friendID}`).set(friendObj) &&
      db.ref(`users/${friendID}/friends/${currentUserID}`).set(currentUserObj)
    ); // Adding new Friend in both user's document
  }

  function chatIDGenerator(ID1, ID2) {
    if (ID1 < ID2) return `${ID1}_${ID2}`;
    else return `${ID2}_${ID1}`;
  }

  useEffect(() => {
    setInputVal(props.job.userId);
  });

  return (
    <Dialog open={!!Object.keys(props.job).length} fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          [{props.job.location}]{props.job.title}
          <IconButton onClick={props.closeModal}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box>
          <Box className={classes.info} display="flex">
            <Typography variant="caption">작성일 : </Typography>
            <Typography variant="body2">
              {props.job.postedOn &&
                dateFns.format(props.job.postedOn, "yyyy-MM-dd HH:MM")}
            </Typography>
          </Box>

          <Box className={classes.info} display="flex">
            <Grid item container fullWidth>
              <img
                src={props.imageUrl != null ? props.imageUrl : defaultImage}
                height="200px"
                width="355px"
                alt="testA"
                style={{ borderRadius: 10 }}
              />
            </Grid>
            <Typography
              variant="body2"
              style={{ marginLeft: "-165px", padding: "10px" }}
            >
              Project simple description
            </Typography>
            <Typography
              variant="body2"
              style={{ marginTop: "65px", marginLeft: "-190px" }}
            >
              <Grid className={classes.openRewardButton}>
                {props.job.reward}
              </Grid>
            </Typography>

            <Box style={{ marginTop: "159px", marginLeft: "-90px" }}>
              <DialogActions>
                <Button
                  variant="contained"
                  className={classes.openMessageButton}
                  disableElevation
                  disabled={loading}
                  style={{ marginLeft: "-10px", marginRight: "-20px" }}
                >
                  {loading ? (
                    <CircularProgress color="secondary" size={22} />
                  ) : (
                    <>
                      {/* <Link
                        to={{
                          pathname: "/chat",
                          query: {
                            userId: props.job.userId ? props.job.userId : "a",
                          },
                        }}
                      > */}
                      <Button onClick={appKeyPress}>쪽지 보내기</Button>
                      {/* <MessageIcon /> */}
                      {/* </Link> */}
                    </>
                  )}
                </Button>
              </DialogActions>
            </Box>
          </Box>

          <Box
            className={classes.info}
            display="flex"
            style={{ marginBottom: "30px" }}
          >
            <Typography variant="caption">
              -------------------------------------------------------------------------------
            </Typography>
          </Box>

          <Box className={classes.info} display="flex">
            <Typography variant="caption">(부엉이 프로필) : </Typography>
            <Typography variant="body2" style={{ marginBottom: "30px" }}>
              {props.job.userId}
            </Typography>
          </Box>
          <Box
            className={classes.info}
            display="flex"
            style={{ marginBottom: "30px" }}
          >
            <Typography variant="caption">
              -------------------------------------------------------------------------------
            </Typography>
          </Box>
          <Box className={classes.info} display="flex">
            <Typography variant="caption">작업실 위치 : </Typography>
            <Typography variant="body2" style={{ marginBottom: "30px" }}>
              {props.job.location}
            </Typography>
          </Box>

          <Box className={classes.info} display="flex">
            <Typography variant="caption">
              구하는 부엉이 어시 인원수 :{" "}
            </Typography>
            <Typography variant="body2" style={{ marginBottom: "30px" }}>
              {props.job.nOfPeople}
            </Typography>
          </Box>
          <Box className={classes.info} display="flex">
            <Typography variant="caption">부엉이 어시 성별 : </Typography>
            <Typography variant="body2" style={{ marginBottom: "30px" }}>
              {props.job.sex}
            </Typography>
          </Box>

          <Box className={classes.info} display="flex">
            <Typography variant="caption">프로젝트 설명 : </Typography>
            <Typography variant="body2" style={{ marginBottom: "30px" }}>
              {props.job.description}
            </Typography>
          </Box>
          <Box className={classes.info} display="flex">
            <Typography variant="caption">부엉이 어시 구하는 날 : </Typography>
            <Typography variant="body2" style={{ marginBottom: "30px" }}>
              {props.job.endDate}
            </Typography>
          </Box>
          <Box ml={0.5} style={{ marginBottom: "30px" }}>
            <Typography variant="caption">부엉이 어시가 할 일 : </Typography>
            <Grid container alignItems="center">
              {props.job.skills &&
                props.job.skills.map((skill) => (
                  <Grid item key={skill} className={classes.openJobButton}>
                    {skill}
                  </Grid>
                ))}
            </Grid>
          </Box>

          <Box
            className={classes.info}
            display="flex"
            style={{ marginBottom: "30px" }}
          >
            <Typography variant="caption">
              부엉이 어시 시다경험 유무 :{" "}
            </Typography>
            <Typography variant="body2">{props.job.experience}</Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        {props.job.userId === currentUser.email ? (
          <Grid>
            <Button
              style={{ marginRight: "10px" }}
              variant="contained"
              onClick={() => setUpdateJobModal(true)}
            >
              수정
            </Button>
            <UpdateJobModal
              closeModal={() => setUpdateJobModal(false)}
              closeViewModal={props.closeModal}
              updateJobModal={updateJobModal}
              updateJob={props.updateJob}
              job={props.job}
            />
            <Button
              style={{ backgroundColor: "red" }}
              variant="contained"
              onClick={() => {
                if (
                  window.confirm("Are you sure you wish to delete this post?")
                ) {
                  props.deleteJob(props.job);
                  closeModal();
                }
              }}
            >
              삭제
            </Button>
          </Grid>
        ) : null}
      </DialogActions>
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  info: {
    "& > *": {
      margin: "4px",
    },
  },
  skillChip: {
    margin: theme.spacing(0.5),
    padding: theme.spacing(0.75),
    fontSize: "14.5px",
    borderRadius: "5px",
    transition: ".3s",
    fontWeight: 600,
    backgroundColor: theme.palette.secondary.main,
    color: "#fff",
  },
  openJobButton: {
    // backgroundColor: theme.palette.subColor.main,
    margin: theme.spacing(0.5),
    padding: theme.spacing(0.75),
    fontSize: "14.5px",
    borderRadius: "5px",
    transition: ".3s",
    fontWeight: 600,
    color: "#fff",
    backgroundColor: theme.palette.mainColor.main,
  },
  openMessageButton: {
    backgroundColor: "#e1bee7",
  },
  openRewardButton: {
    fontSize: "14.5px",
    height: "70px",
    width: "70px",
    borderRadius: "50%",
    textAlign: "center",
    lineHeight: "72px",
    transition: ".3s",
    fontWeight: 600,
    color: "#fff",
    backgroundColor: theme.palette.mainColor.main,
  },
}));
