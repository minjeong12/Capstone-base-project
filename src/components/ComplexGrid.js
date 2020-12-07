import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import ButtonBase from "@material-ui/core/ButtonBase";
import ac from "../assets/ac.jpg";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    // padding: theme.spacing(2),
    margin: "auto",
    maxWidth: 900,
  },
  image: {
    width: 128,
    height: 128,
  },
  img: {
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%",
  },
}));

export default function ComplexGrid() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item>
            <ButtonBase className={classes.image}>
              <img className={classes.img} alt="complex" src={ac} />
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography variant="subtitle1" style={{ fontWeight: 700 }}>
                  설계실 곰돌이
                </Typography>
                <Paper
                  style={{
                    height: "120px",
                    marginBottom: "-10px",
                    boxShadow: "5px 5px 5px 1px rgba(224, 224, 224, 0.8)",
                  }}
                >
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    style={{
                      padding: "20px 20px",
                      paddingTop: "40px",
                      paddingBottom: "40px",
                    }}
                  >
                    너무 잘 도와주신것 같아용!! 다음에 또 어시 하고 싶어용
                    ㅎㅋㅋㅋㅋ
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
