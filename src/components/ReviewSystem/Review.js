import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import * as Survey from "survey-react";
import "survey-react/survey.css";
import { v4 as uuid } from "uuid";
import { useAuth } from "../../contexts/AuthContext";
import { firestore, db, app } from "../../firebase/config";
import { ToastContainer, toast } from "react-toastify";
import { Container } from "@material-ui/core";

Survey.StylesManager.applyTheme("orange");
// Survey.StylesManager.applyTheme("stone");
export default function Review(props) {
  const [isCompleted, setIsCompleted] = useState(false);
  const { currentUser } = useAuth();
  const history = useHistory();

  const [uName, setuName] = useState("");
  const [uPhoto, setuPhoto] = useState("");
  const [email, setEmail] = useState("");
  var emailtoJob = "";

  async function TraderProfile() {
    try {
      await db
        .ref(`users/${props.match.params.ID}`)
        .once("value")
        .then((snapshot) => {
          setuName(snapshot.val().uname);
          setuPhoto(snapshot.val().photoURL);
          setEmail(snapshot.val().email);
          emailtoJob = snapshot.val().email;
        });
    } catch (err) {
      console.log("traderProfile에러");

      throw err;
    }
  }

  async function putScore() {
    try {
      const id = uuid();
      const req = await firestore
        .collection("reviews")
        .where("TraderId", "==", props.match.params.ID)
        .orderBy("postedOn", "desc")
        .get();
      const tempReviews = req.docs.map((review) => ({
        ...review.data(),
        // id: review.id,
        // postedOn: review.data().postedOn.toDate(),
      }));

      tempReviews.map((x, i) => {
        if (JSON.parse(x["0"]).satisfaction === 1) {
          st -= 0.5;
        } else if (JSON.parse(x["0"]).satisfaction == 2) {
          st -= 0.25;
        } else if (JSON.parse(x["0"]).satisfaction == 3) {
          st -= 0;
        } else if (JSON.parse(x["0"]).satisfaction == 4) {
          st += 0.25;
        } else {
          st += 0.5;
        }
      });
      const fileRef = firestore.collection("scores").doc(props.match.params.ID);
      fileRef.set(
        {
          st: 50 + st,
          userId: props.match.params.ID,
          email: email,
          username: uName,
          postedOn: app.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    } catch (err) {
      console.log("putScore 에러");

      throw err;
    }
  }

  useEffect(() => {
    (async () => {
      try {
        await TraderProfile();
        // await getPorts();
      } catch (err) {
        console.log("error in review");
      }
      // await getJobs();
    })();
  }, []);

  var st = 0;

  const pushF = async (details) => {
    // const id = uuid();
    const id = uuid();

    await firestore
      .collection("reviews")
      .add({
        ...details,
        postedOn: app.firestore.FieldValue.serverTimestamp(),
        TraderId: props.match.params.ID,
        userId: currentUser.email,
        username: currentUser.displayName,
        photo: currentUser.photoURL,
      })
      .then(function (doc) {
        console.log("작성완료");
        window.setTimeout(() => {
          history.push("/");
        }, 1000);
      });
  };

  function onCompleteComponent() {
    setIsCompleted(true);
  }
  let json = {
    questions: [
      {
        type: "rating",
        name: "satisfaction",
        title: "거래 만족도는 어떠셨나요?",
        mininumRateDescription: "매우 불만족",
        maximumRateDescription: "매우 만족",
      },
      {
        type: "comment",
        name: "suggestions",
        title: "부엉이 어시 거래에서 어떤 점이 만족스러웠나요?",
      },
    ],
  };
  var surveyRender = !isCompleted ? (
    <Survey.Survey
      json={json}
      showCompletedPage={false}
      onComplete={onComplete}
    />
  ) : null;
  var arr = [];
  async function onComplete(survey, options) {
    //Write survey results into database
    console.log("Survey results: " + JSON.stringify(survey.data));
    arr.push(JSON.stringify(survey.data));
    await pushF(arr);
    await putScore();
  }
  return (
    <Container
      style={{ marginTop: "200px", width: "1000px" , }} // 1150px
    >
      <div style={{ height: "800px", width: "1000px", margin: "0 auto" }}>
        {surveyRender}
        {onCompleteComponent}
      </div>
      <div
        style={{
          height: "100px !important",
          width: "100px !important",
          fontSize: "20px",
        }}
      >
        <ToastContainer />
      </div>
    </Container>
  );
}
