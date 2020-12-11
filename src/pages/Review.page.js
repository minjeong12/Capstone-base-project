import { Container } from "@material-ui/core";
import React from "react";
import Review from "../components/ReviewSystem/Review";

export default function ReviewPage() {
  return (
    <Container
      style={{ marginTop: "200px", width: "1000px" }} // 1150px
    >
      <Review />
    </Container>
  );
}
