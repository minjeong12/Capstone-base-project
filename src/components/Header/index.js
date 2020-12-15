import { Box, Button, Grid, makeStyles } from "@material-ui/core";
import React from "react";
import { Col, Row, Container } from "react-bootstrap";
import clickImage from "../../assets/click.png";

export default (props) => {
  const classes = useStyles();
  return (
    <Box pt={10} pb={10} bgcolor="transparent">
      <Container
        style={{ marginTop: "100px" }} // 1150px
      >
        <Row>
          <Col xs="4"></Col>
          <Col xs="4"></Col>
          <Col xs="4" className="splash-container">
            <button style={{ border: 0, outline: 0 }}>
              <img
                src={clickImage}
                alt="my image"
                onClick={props.openNewJobModal}
                style={{ marginTop: "-100px", marginLeft: "-130px", width: "100px", height: "130px" , backgroundColor: 'transparent' }}
              />
            </button>
          </Col>
        </Row>
      </Container>
    </Box>
  );
};

const useStyles = makeStyles((theme) => ({
  openJobButton: {
    height: "50px",
    width: "95px",
    backgroundColor: 'transparent',
    marginTop: "100px",
  },
  img: {
    width: "150px",
    height: "150px",
  },
}));
