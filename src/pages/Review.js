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
        type: "checkbox",
        name: "car",
        title: "What car are you driving?",
        isRequired: true,
        hasSelectAll: true,
        hasNone: true,
        noneText: "None of the above",
        colCount: 4,
        choicesOrder: "asc",
        choices: [
          "Ford",
          "Tesla",
          "Vauxhall",
          "Volkswagen",
          "Nissan",
          "Audi",
          "Mercedes-Benz",
          "BMW",
          "Peugeot",
          "Toyota",
          "Citroen",
        ],
      },
      {
        type: "rating",
        name: "satisfaction",
        title: "How satisfied are you with the Product?",
        mininumRateDescription: "Not Satisfied",
        maximumRateDescription: "Completely satisfied",
      },
      {
        type: "rating",
        name: "recommend friends",
        visibleIf: "{satisfaction} > 3",
        title:
          "How likely are you to recommend the Product to a friend or co-worker?",
        mininumRateDescription: "Will not recommend",
        maximumRateDescription: "I will recommend",
      },
      {
        type: "comment",
        name: "suggestions",
        title: "What would make you more satisfied with the Product?",
      },
    ],
  };
  var surveyRender = !isCompleted ? (
    <Survey.Survey
      json={json}
      showCompletedPage={false}
      onComplete={onCompleteComponent}
    />
  ) : null;
  var onCompleteComponent = isCompleted ? (
    <div style={{ fontSize: "30px" }}>The component after onComplete event</div>
  ) : null;
  return (
    <div style={{ marginTop: "300px" }}>
      {surveyRender}
      {onCompleteComponent}
    </div>
  );
}
