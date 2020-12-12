import React, { useEffect, useRef, useState } from "react";
import { Button, Grid, Paper } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import { Col, Container, ProgressBar, Row } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import "./mypage.css";
import ReviewGrid from "../components/ReviewSystem/ReviewGrid";
import PortfolioGrid from "../components/Portfolio/PortfolioGrid";
import { firestore, firebase, app } from "../firebase/config";
import { v4 as uuid } from "uuid";

export default function MyPage() {
  const { currentUser } = useAuth();
  const history = useHistory();
  // State to store uploaded file

  const postPort = async (portDetails, imageUrl) => {
    const id = uuid();
    await firestore
      .collection("portfolio")
      .doc(currentUser.uid)
      .set(
        {
          ...portDetails,
          postedOn: app.firestore.FieldValue.serverTimestamp(),
          imageUrl: imageUrl,
          postId: id,
        },
        { merge: true }
      )
      .then(function (doc) {
        console.log("작성완료");
        window.setTimeout(() => {
          history.push("/mypage");
        }, 1000);
      });
    fetchPort();
  };

  const [port, setPort] = useState([]);

  const fetchPort = async () => {
    const req = await firestore
      .collection("portfolio")
      .where("userId", "==", currentUser.email)
      .get();
    const tempPorts = req.docs.map((port) => ({
      ...port.data(),
      id: port.id,
      postedOn: port.data().postedOn.toDate(),
    }));
    setPort(tempPorts);
    console.log(port);
  };

  useEffect(() => {
    fetchPort();
  }, []);

  const [locTitle, setLocTitle] = useState([]);

  const getPorts = async () => {
    try {
      const portsSnapshot = await firebase
        .firestore()
        .collection("portfolio")
        .where("userId", "==", currentUser.email)
        .get();
      const portsPayload = [];
      portsSnapshot.forEach((port) =>
        portsPayload.push({
          ...port.data(),
        })
      );
      console.log(portsPayload);

      setLocTitle(portsPayload);
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    (async () => {
      try {
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

  // ** validation Check
  const handleSubmit = async () => {
    for (const field in portDetails) {
      if (typeof portDetails[field] === "string" && !portDetails[field]) return;
    }
    if (!portDetails.skills.length) return;
    console.log(portDetails);

    await postPort(portDetails, fileUrl);
  };

  return (
    <Container>
      <Container
        style={{ marginTop: "200px", width: "1000px" }} // 1150px
      ></Container>
      {/* 소개 및 포트폴리오 업로드 */}
      <Container
        style={{ marginTop: "30px", width: "850px" }} // 1150px
      >
        <Grid
          item
          xs
          container
          direction="row"
          style={{ marginBottom: "20px" }}
        >
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              disableElevation
              onClick={handleSubmit}
            >
              수정 완료
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              disableElevation
              onClick={() => {
                history.push("/mypage");
              }}
            >
              돌아가기
            </Button>
          </Grid>
        </Grid>
        <Row>
          <Col xs="12">
            <Grid>
              <PortfolioGrid
                handleChange={handleChange}
                portDetails={portDetails}
                addRemoveSkill={addRemoveSkill}
                furl={furl}
              />
            </Grid>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
