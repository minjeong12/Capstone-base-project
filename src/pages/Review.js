import React, { useState } from "react";
import * as Survey from "survey-react";
import "survey-react/survey.css";

Survey.StylesManager.applyTheme("orange");
export default function Review() {
  const [isCompleted, setIsCompleted] = useState(false);

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
      // {
      //   type: "rating",
      //   name: "recommend friends",
      //   visibleIf: "{satisfaction} > 3",
      //   title: "친구나 동료에게 추천하실 생각이 있나요?",
      //   mininumRateDescription: "비추천",
      //   maximumRateDescription: "추천",
      // },
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
  // var onCompleteComponent = isCompleted
  //   ? console.log("Survey results: " + JSON.stringify(Survey.data))(
  //       <div style={{ fontSize: "30px" }}>완료되었습니다.</div>
  //     )
  //   : null;
  function onComplete(survey, options) {
    //Write survey results into database
    console.log("Survey results: " + JSON.stringify(survey.data));
  }
  return (
    <div style={{ marginTop: "300px" }}>
      {surveyRender}
      {onCompleteComponent}
    </div>
  );
}
