import React, {useEffect, useRef, useState} from "react";
import {Button, Grid, Paper} from "@material-ui/core";
import {Link, useHistory} from "react-router-dom";
import {Col, Container, ProgressBar, Row} from "react-bootstrap";
import {useAuth} from "../contexts/AuthContext";
import "./mypage.css";
import ReviewGrid from "../components/ReviewSystem/ReviewGrid";
import PortfolioGrid from "../components/Portfolio/PortfolioGrid";
import {firestore, firebase, app} from "../firebase/config";
import {v4 as uuid} from "uuid";

export default function MyPage() {
  const {currentUser} = useAuth();
  const history = useHistory();
  const [jobs, setJobs] = useState([]);
  const [port, setPort] = useState([]);
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
    const req = await firestore
      .collection("portfolio")
      .where("userEmail", "==", currentUser.email)
      .get();
    const tempPorts = req.docs.map(port => ({
      ...port.data(),
    }));
    setPorts(tempPorts);
    // console.log(jobs);
  };

  const getJobs = async () => {
    try {
      const jobsSnapshot = await firebase
        .firestore()
        .collection("reviews")
        .where("userId", "==", currentUser.email)
        .get();
      const jobsPayload = [];
      jobsSnapshot.forEach(job =>
        jobsPayload.push({
          ...job.data(),
        }),
      );
      console.log(jobsPayload);

      setLocTitle(jobsPayload);
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    (async () => {
      try {
        await getJobs();
        await getPorts();
      } catch (err) {
        console.log("error in mypage");
      }
    })();
  }, []);

  // console.log(locTitle.length);

  const initState = {
    userEmail: currentUser.email,
    userName: currentUser.displayName,
    userPhoto: currentUser.photoURL,
    userId: currentUser.uid,
    intro: "",
    skills: [],
    certificate: "",
  };
  const [portDetails, setPortDetails] = useState(initState);

  const handleChange = e => {
    e.persist();
    setPortDetails(oldState => ({
      ...oldState,
      [e.target.name]: e.target.value,
    }));
  };

  const addRemoveSkill = skill => {
    portDetails.skills.includes(skill)
      ? setPortDetails(oldState => ({
          ...oldState,
          skills: oldState.skills.filter(s => s !== skill),
        }))
      : setPortDetails(oldState => ({
          ...oldState,
          skills: oldState.skills.concat(skill),
        }));
  };

  const [fileUrl, setFileUrl] = useState(null);

  const furl = x => {
    setFileUrl(x);
  };

  const handleSubmit = async () => {
    history.push("/write-port");
  };

  // console.log(port);

  return (
    <Container>
      <Container
        style={{marginTop: "200px", width: "1000px"}} // 1150px
      >
        <Row>
          <Col xs="12">
            <Paper style={{height: "400px", borderRadius: 50}}>
              <Container>
                <Row>
                  <Col xs="4">
                    <img
                      src={currentUser.photoURL}
                      height="200px"
                      width="200px"
                      alt="profileImage"
                      style={{
                        borderRadius: 100,
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
                    {currentUser.displayName} 님
                  </Col>
                  <Col
                    xs="2"
                    style={{
                      marginLeft: "-40px",
                      lineHeight: "190px",
                      fontSize: "21px",
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
                      marginLeft: "-10px",
                      lineHeight: "190px",
                      fontSize: "21px",
                      fontWeight: "400",
                      color: "gray",
                    }}
                  >
                    <span>만족도 센치 : {now} cm</span>
                  </Col>
                </Row>
              </Container>
              <Container>
                <Row>
                  <Col
                    xs="12"
                    style={{
                      marginTop: "30px"
                    }}
                  >
                    {progressInstance}
                  </Col>
                </Row>
              </Container>
            </Paper>
          </Col>
        </Row>

        <Grid item xs container direction="row" 
       
        
        >
          <Grid item
          
          
          >
            <Button
              // variant="contained"
              color="#F9EFB8"
              
              disableElevation
              onClick={handleSubmit}
            >
              포트폴리오 수정
            </Button>
          </Grid>
        </Grid>
      </Container>

      {/* 소개 및 포트폴리오 업로드 */}
      <Container
        style={{marginTop: "80px", width: "850px"}} // 1150px
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
        style={{marginTop: "30px", width: "850px"}} // 1150px
      >
        <Row>
          <Col xs="12">
            <Grid style={{height: "500px"}}>
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
                <ReviewGrid handleEval={handleEval} />
              </div>
            </Grid>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
