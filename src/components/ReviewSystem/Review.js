import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import * as Survey from "survey-react";
import "survey-react/survey.css";
import { v4 as uuid } from "uuid";
import { useAuth } from "../../contexts/AuthContext";
import { firestore, firebase, app } from "../../firebase/config";
import { ToastContainer, toast } from "react-toastify";

Survey.StylesManager.applyTheme("orange");
// Survey.StylesManager.applyTheme("stone");
export default function Review(props) {
  const [isCompleted, setIsCompleted] = useState(false);
  const { currentUser } = useAuth();
  const history = useHistory();

  // const postReview = async (details) => {
  //   const req = await firestore
  //     .collection("reviews")
  //     .doc() // currentUser.email+ props.match.params.ID)
  //     .get()
  //     .then(function (doc) {
  //       // 중복 체크
  //       if (doc.exists === false) {
  //         push(details);
  //         console.log("작성중");
  //       } else {
  //         // toast();
  //         alert("이미 작성되었습니다.");
  //         window.setTimeout(() => {
  //           history.push("/");
  //         }, 2000);
  //       }
  //     })
  //     .catch(function (error) {
  //       console.log("Error getting document:", error);
  //     });
  //   window.setTimeout(() => {
  //     history.push("/");
  //   }, 2000);
  // };

  const pushF = async (details) => {
    const id = uuid();
    await firestore
      .collection("reviews")
      //.doc(id) //currentUser.email) // + props.match.params.ID)
      .add({
        ...details,
        // postedOn: app.firestore.FieldValue.serverTimestamp(),
        // postId: props.match.params.ID,
        userId: currentUser.email,
        username: currentUser.displayName,
        photo: currentUser.photoURL,
      })
      .then(function (doc) {
        console.log("작성완료");
      });
  };
  // function toast() {
  //   toast("이미 후기를 남겼습니다!");
  //   window.setTimeout(() => {
  //     history.push("/");
  //   }, 2000);
  // }

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
  }
  return (
    <>
      <div style={{ width: "1000px", margin: "0 auto" }}>
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
    </>
  );
}