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
import { Col, Container, ProgressBar, Row } from "react-bootstrap";
import { firestore } from "../../firebase/config";
import "./mypage.css";

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

  function moveOtherProfile(email) {
    history.push("/trader/" + email);
  }

  const keyPressMove = async (e) => {
    try {
      // const us = `${props.job.userId}_${props.job.userName}_${props.job.userPhoto}_${props.job.chatId}`;
      moveOtherProfile(props.job.chatId);
      // history.push("/chat/" + chatID);
      console.log(props.job.chatId);
    } catch (error) {
      console.log(error.message);
      console.log("error");
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

    // friendObj db 추가시 post 제목, id 추가
    friendObj.post = props.job.title;
    friendObj.postId = props.job.postId;

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

  const [ports, setPorts] = useState([]);
  const getPorts = async () => {
    const req = await firestore
      .collection("portfolio")
      .where("userEmail", "==", props.job.userId)
      .get();
    const tempPorts = req.docs.map((port) => ({
      ...port.data(),
    }));
    setPorts(tempPorts);
  };
  const [scores, setScores] = useState([]);
  const getScores = async () => {
    const req = await firestore
      .collection("scores")
      .where("email", "==", props.job.userId)
      .get();
    const tempScs = req.docs.map((sc) => ({
      ...sc.data(),
    }));
    setScores(tempScs);
  };

  // const [cal, setCal] = useState(0);
  const now = scores["0"] === undefined ? 50 : scores["0"].st;

  const progressInstance = (
    <ProgressBar
      variant={"YOU_PICK_A_NAME"}
      className="progress-custom"
      min={0}
      max={99}
      now={now}
      label={`${now}cm`}
      style={{
        height: "50px",
        fontColor: "gray",
      }}
    />
  );

  useEffect(() => {
    setInputVal(props.job.userId);
    (async () => {
      try {
        await getPorts();
        await getScores();
      } catch (err) {
        console.log("error in review");
      }
      // setCal(scores["0"].st);
      // getPorts();
    })();
  }, []);

  console.log(props.job.userId);
  console.log(props.job.userPhoto);
  console.log(ports);
  console.log(scores);

  // console.log(pts);

  // var scores = [];
  // async function getScore() {
  //   try {
  //     const req = await firestore
  //       .collection("scores")
  //       .where("email", "==", inputVal)
  //       .orderBy("postedOn", "desc")
  //       .get();
  //     const tempReviews = req.docs.map((review) => ({
  //       ...review.data(),
  //       // id: review.id,
  //       // postedOn: review.data().postedOn.toDate(),
  //     }));
  //     console.log(tempReviews);

  //     scores.push(tempReviews);
  //   } catch (err) {
  //     console.log("getScore 에러");

  //     throw err;
  //   }
  // }

  return (
    <Dialog open={!!Object.keys(props.job).length} fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          &nbsp;
          <IconButton onClick={props.closeModal}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box>
          <Box className={classes.info} display="flex">
            <Typography variant="caption" style={{ fontSize: "2px" }}>
              작성일 :{" "}
            </Typography>
            <Typography variant="body2">
              {props.job.postedOn &&
                dateFns.format(props.job.postedOn, "yyyy-MM-dd HH:MM")}
            </Typography>
          </Box>

          <Box className={classes.info} display="flex">
            <Grid item container fullWidth>
              <img
                src={
                  props.job.imageUrl !== null
                    ? props.job.imageUrl
                    : defaultImage
                }
                height="180px"
                width="290px"
                alt="projectImage"
                style={{
                  borderRadius: 10,
                  marginTop: "10px",
                  marginLeft: "10px",
                }}
              />
            </Grid>
            <Typography
              variant="body2"
              style={{
                marginTop: "80px",
                marginLeft: "-200px",
                fontFamily: "AppleSDGothicNeoEB.ttf",
              }}
            >
              <Typography
                variant="body2"
                style={{
                  marginTop: "-70px",
                  marginBottom: "40px",
                  fontSize: "18px",
                  fontFamily: "AppleSDGothicNeoEB.ttf",
                  fontWeight: "bold",
                }}
              >
                [{props.job.location}]{props.job.title}
              </Typography>

              <Grid
                className={classes.openRewardButton}
                style={{ backgroundColor: "#B9ACE0" }}
              >
                {props.job.reward}
              </Grid>
              <Box style={{}}>
                <DialogActions>
                  {loading ? (
                    <CircularProgress color="secondary" size={22} />
                  ) : (
                    props.job.userId !== currentUser.email && (
                      <Button
                        variant="contained"
                        className={classes.openMessageButton}
                        disableElevation
                        disabled={loading}
                        style={{
                          marginTop: "10px",
                          marginLeft: "-20px",
                          width: "150px",
                          height: "30px",
                          backgroundColor: "#B9ACE0",
                          fontWeight: "bold",
                          color: "#fff",
                        }}
                      >
                        <Button onClick={appKeyPress} style={{ color: "#fff" }}>
                          쪽지 보내기
                        </Button>
                        {/* <MessageIcon /> */}
                      </Button>
                    )
                  )}
                </DialogActions>
              </Box>
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

          <Box className={classes.info}>
            <span>
              <Typography
                variant="caption"
                style={{
                  fontFamily: "NotoSansKR-Bold.otf",
                  fontSize: "25px",
                  fontWeight: "bold",
                }}
              >
                부엉이 정보
              </Typography>
            </span>
            <Container style={{ marginLeft: "-10px" }}>
              <Row>
                <Col xs="4">
                  <img
                    src={
                      props.job.userPhoto ? props.job.userPhoto : defaultImage
                    }
                    height="150px"
                    width="150px"
                    alt="profileImage"
                    style={{ borderRadius: 10 }}
                  />
                  <Typography
                    variant="body2"
                    style={{
                      marginBottom: "30px",
                      textAlign: "center",
                      marginTop: "5px",
                      fontWeight: 600,
                    }}
                  >
                    {props.job.userName}
                  </Typography>
                </Col>
                <Col xs="8">
                  <Container>
                    <Row>
                      <Col xs="12" style={{ height: "75px" }}>
                        <Typography>
                          소개
                          <br />
                          {ports["0"] &&
                            (ports["0"].intro === ""
                              ? "아직 작성되지 않았습니다."
                              : ports["0"].intro)}
                        </Typography>
                      </Col>
                      <Col xs="12" style={{ height: "75px" }}>
                        <Typography>매너 룰러</Typography>
                        <Typography>{progressInstance}</Typography>
                      </Col>
                    </Row>
                  </Container>
                </Col>
              </Row>
            </Container>

            {props.job.userId !== currentUser.email && (
              <Button
                display="flex"
                disableElevation
                disabled={loading}
                style={{ marginTop: "-20px" }}
              >
                <Button onClick={keyPressMove}>프로필 보러가기</Button>
              </Button>
            )}
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
    margin: theme.spacing(1),
    padding: theme.spacing(0.75),
    fontSize: "14.5px",
    borderRadius: "5px",
    transition: ".3s",
    fontWeight: 600,
    backgroundColor: "#B9ACE0",
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
    backgroundColor: "#B9ACE0",
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
