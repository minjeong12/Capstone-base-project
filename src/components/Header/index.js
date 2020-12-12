import { Box, Button, Container, Grid, makeStyles } from "@material-ui/core";
import React from "react";

export default (props) => {
  const classes = useStyles();
  return (
    <Box py={10} bgcolor="transparent">
      <Grid container justify="center">
        <Container display="flex" flexDirection="row" alignItems="flex-end">
          <Box>
            <div class="splash-container">
              {/* <div>
                <Button
                  onClick={props.openNewJobModal}
                  className={classes.openJobButton}
                  disableElevation
                >
                  부엉이 어시
                  <br />
                  구하러 가기
                </Button>
              </div> */}
            </div>
            {/* <Button
              onClick={props.openNewJobModal}
              // variant="contained"
              className={classes.openJobButton}
              disableElevation
            >
              부엉이 어시 구하러 가기
            </Button> */}
          </Box>
        </Container>
      </Grid>
    </Box>
  );
};

const useStyles = makeStyles((theme) => ({
  openJobButton: {
    height: "50px",
    width: "95px",
    backgroundColor: "#e1bee7",
    marginTop: "100px",
  },
  img: {
    width: "150px",
    height: "150px",
  },
}));
