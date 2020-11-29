import { Box, Button, Grid, makeStyles } from "@material-ui/core";
import React from "react";

export default (props) => {
  const classes = useStyles();
  return (
    <Box py={10} bgcolor="transparent" color="white">
      <Grid container justify="center">
        <Grid item xs={10}>
          <Box display="flex" justifyContent="space-between">
            {/* <img className={classes.img} src={logo} alt="testA" /> */}
            {/* <Typography variant="h4" style={{ padding: "40px 0" }}>
              부엉이 구하러 가기(미정)
            </Typography> */}
            <Button
              onClick={props.openNewJobModal}
              variant="contained"
              className={classes.openJobButton}
              disableElevation
            >
              Post a Job
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

const useStyles = makeStyles((theme) => ({
  openJobButton: {
    height: "50px",
    width: "170px",
    backgroundColor: "#e1bee7",
    marginTop: "100px",
  },
  img: {
    width: "150px",
    height: "150px",
  },
}));
