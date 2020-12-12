import React, { useEffect, useRef, useState } from "react";
import { Button, Grid, Paper } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import { Col, Container, ProgressBar, Row } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import "./mypage.css";
import ReviewGrid from "../components/ReviewSystem/ReviewGrid";
import PortfolioGrid from "../components/Portfolio/PortfolioGrid";
import { firestore, firebase, db } from "../firebase/config";

export default function TraderMyPage(props) {
  const { currentUser } = useAuth();
  const user = props.match.params === undefined ? "" : props.match.params.email;
  const [uname, setUname] = useState("");
  const [uPhoto, setuPhoto] = useState("");
  const [email, setEmail] = useState("");
  var emailtoJob = "";

  async function TraderProfile() {
    try {
      await db
        .ref(`users/${user}`)
        .once("value")
        .then((snapshot) => {
          setUname(snapshot.val().uname);
          setuPhoto(snapshot.val().photoURL);
          setEmail(snapshot.val().email);
          emailtoJob = snapshot.val().email;
        });
    } catch (err) {
      console.log("traderProfile에러");

      throw err;
    }
  }

  const [locTitle, setLocTitle] = useState([]);
  const [cal, setCal] = useState(0);
  const now = cal;

  const progressInstance = (
    <ProgressBar
      variant={"YOU_PICK_A_NAME"}
      className="progress-custom"
      min={0}
      max={99}
      now={now}
      label={`${now}cm`}
      style={{
        height: "75px",
        fontColor: "gray",
      }}
    />
  );

  function handleEval(x = 50) {
    setCal(x);
  }

  const [ports, setPorts] = useState([]);
  const getPorts = async () => {
    try {
      const req = await firestore
        .collection("portfolio")
        .where("userId", "==", props.match.params.email)
        .get();
      const tempPorts = req.docs.map((port) => ({
        ...port.data(),
      }));
      setPorts(tempPorts);
    } catch (err) {
      console.log("getPorts에러");

      throw err;
    }
  };

  const getJobs = async () => {
    try {
      console.log(emailtoJob);

      const jobsSnapshot = await firebase
        .firestore()
        .collection("reviews")
        .where("userId", "==", emailtoJob)
        .get();
      const jobsPayload = [];
      jobsSnapshot.forEach((job) =>
        jobsPayload.push({
          ...job.data(),
        })
      );
      console.log(jobsPayload);

      setLocTitle(jobsPayload);
    } catch (err) {
      console.log("getJobs에러");

      throw err;
    }
    // }
  };

  useEffect(() => {
    (async () => {
      try {
        await TraderProfile();
        await getPorts();
      } catch (err) {
        console.log("error in mypage");
      }
      await getJobs();
    })();
  }, []);

  const initState = {
    userEmail: email === "" ? currentUser.email : email,
    userName: uname === "" ? currentUser.displayName : uname,
    userPhoto: uPhoto === "" ? currentUser.photoURL : uPhoto,
    // userId: user === "" ? currentUser.uid : user,
    intro: "",
    skills: [],
    certificate: "",
  };
  const [portDetails, setPortDetails] = useState(initState);

  const handleChange = (e) => {
    e.persist();
    setPortDetails((oldState) => ({
      ...oldState,
      [e.target.name]: e.target.value,
    }));
  };

  const addRemoveSkill = (skill) => {
    portDetails.skills.includes(skill)
      ? setPortDetails((oldState) => ({
          ...oldState,
          skills: oldState.skills.filter((s) => s !== skill),
        }))
      : setPortDetails((oldState) => ({
          ...oldState,
          skills: oldState.skills.concat(skill),
        }));
  };

  const [fileUrl, setFileUrl] = useState(null);

  const furl = (x) => {
    setFileUrl(x);
  };

  // console.log(props.match.params.email);
  // console.log(user);
  // console.log(uname);
  // console.log(uPhoto);
  console.log(emailtoJob);

  return (
    <Container>
      <Container
        style={{ marginTop: "200px", width: "1000px" }} // 1150px
      >
        <Row>
          <Col xs="12">
            <Paper style={{ height: "280px" }}>
              <Container>
                <Row>
                  <Col xs="4">
                    <img
                      src={uPhoto === "" ? currentUser.photoURL : uPhoto}
                      height="150px"
                      width="150px"
                      alt="profileImage"
                      style={{
                        borderRadius: 10,
                        marginLeft: "50px",
                        marginTop: "20px",
                      }}
                    />
                  </Col>
                  <Col
                    xs="3"
                    style={{
                      lineHeight: "190px",
                      fontSize: "26px",
                      fontWeight: "700",
                    }}
                  >
                    {uname === "" ? currentUser.displayName : uname}
                  </Col>
                  <Col
                    xs="2"
                    style={{
                      marginLeft: "-30px",
                      lineHeight: "190px",
                      fontSize: "11px",
                      fontWeight: "400",
                      color: "gray",
                      display: "flex",
                    }}
                  >
                    <span>총 작업수 : {locTitle.length}</span>
                  </Col>
                  <Col
                    xs="3"
                    style={{
                      marginLeft: "20px",
                      lineHeight: "190px",
                      fontSize: "11px",
                      fontWeight: "400",
                      color: "gray",
                    }}
                  >
                    <span>만족도 센치 : {now}cm</span>
                  </Col>
                </Row>
              </Container>
              <Container>
                <Row>
                  <Col xs="12">{progressInstance}</Col>
                </Row>
              </Container>
            </Paper>
          </Col>
        </Row>
      </Container>

      {/* 소개 및 포트폴리오 업로드 */}
      <Container
        style={{ marginTop: "30px", width: "850px" }} // 1150px
      >
        <Row>
          <Col xs="12">
            <Grid>
              <PortfolioGrid
                handleChange={handleChange}
                portDetails={portDetails}
                addRemoveSkill={addRemoveSkill}
                furl={furl}
                ports={ports}
              />
            </Grid>
          </Col>
        </Row>
      </Container>

      <Container
        style={{ marginTop: "30px", width: "850px" }} // 1150px
      >
        <Row>
          <Col xs="12">
            <Grid style={{ height: "500px" }}>
              <div
                style={{
                  fontSize: "23px",
                  fontWeight: "700",
                  marginBottom: "20px",
                }}
              >
                부엉이 만남 후기
              </div>
              <div>
                <ReviewGrid
                  user={user}
                  uname={uname}
                  uPhoto={uPhoto}
                  email={email}
                  handleEval={handleEval}
                />
              </div>
            </Grid>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
