import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import ButtonBase from "@material-ui/core/ButtonBase";
import ac from "../../assets/ac.jpg";
import { firestore, firebase } from "../../firebase/config";
import styled from "styled-components";
import { v4 as uuid } from "uuid";
import { useAuth } from "../../contexts/AuthContext";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
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

export default function ReviewGrid(props) {
  const classes = useStyles();
  const opt = props.st;
  const [vid, setVid] = useState("");
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchReviews(vid);
  }, [vid]);

  const handleChangeV = (event) => {
    setVid(event.target.value);
  };

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReviews = async (vid) => {
    setLoading(true);
    console.log("vi", vid);
    const id = uuid();

    if (vid === "") {
      const req = await firestore
        .collection("reviews")
        // .orderBy('postedOn', 'desc')
        .get();
      const tempReviews = req.docs.map((review) => ({
        ...review.data(),
        id: review.id,
        // postedOn: review.data().postedOn.toDate(),
      }));

      tempReviews.map((x, i) => {
        if (
          JSON.parse(x["0"]).understanding < 3 &&
          JSON.parse(x["0"]).satisfaction < 3
        ) {
          un -= parseInt(JSON.parse(x["0"]).understanding) / 10;
          st -= parseInt(JSON.parse(x["0"]).satisfaction) / 10;
        } else if (
          JSON.parse(x["0"]).satisfaction < 3 &&
          JSON.parse(x["0"]).understanding >= 3
        ) {
          un += parseInt(JSON.parse(x["0"]).understanding) / 10;
          st -= parseInt(JSON.parse(x["0"]).satisfaction) / 10;
        } else if (
          JSON.parse(x["0"]).satisfaction >= 3 &&
          JSON.parse(x["0"]).understanding >= 3
        ) {
          un += parseInt(JSON.parse(x["0"]).understanding) / 10;
          st += parseInt(JSON.parse(x["0"]).satisfaction) / 10;
        } else if (
          JSON.parse(x["0"]).satisfaction >= 3 &&
          JSON.parse(x["0"]).understanding < 3
        ) {
          un -= parseInt(JSON.parse(x["0"]).understanding) / 10;
          st += parseInt(JSON.parse(x["0"]).satisfaction) / 10;
        }
      });
      const fileRef = db.collection("scores").doc(id);
      fileRef.set(
        {
          un: 50 + un,
          st: 50 + st,
          email: currentUser.email,
          username: currentUser.displayName,
          // postedOn: firebase.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      setReviews(tempReviews);
      props.handleEval(50 + un, 50 + st);
      console.log(tempReviews);
    } else {
      const req = await firestore
        .collection("reviews")
        // .orderBy('postedOn', 'desc')
        .where("videoId", "==", vid)
        .get();
      const tempReviews = req.docs.map((review) => ({
        ...review.data(),
        id: review.id,
        // postedOn: review.data().postedOn.toDate(),
      }));
      setReviews(tempReviews);
      console.log(tempReviews);
    }
    setLoading(false);
  };

  const db = firebase.firestore();

  // console.log(reviews);
  // console.log(vid);
  var un = 0;
  var st = 0;

  return (
    <>
      <div className={classes.root}>
        {reviews.map((x, i) => {
          console.log(JSON.parse(x["0"]).complement);
          // console.log(JSON.parse(x["0"]).suggestions);
          console.log(JSON.parse(x["0"]).satisfaction);
          // console.log(JSON.parse(x["0"]).understanding);

          return loading === true ? (
            <Spinner />
          ) : (
            <Grid className={classes.paper}>
              <Grid container spacing={2}>
                <Grid item>
                  <ButtonBase className={classes.image}>
                    <img
                      className={classes.img}
                      alt="complex"
                      src={x["photo"] === null ? ac : x["photo"]}
                    />
                  </ButtonBase>
                  <Typography style={{ fontWeight: 700, textAlign: "center" }}>
                    {x["username"]}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm container>
                  <Grid item xs container direction="column" spacing={2}>
                    <Grid item xs>
                      {/* <Typography
                        variant="subtitle1"
                        style={{ fontWeight: 700 }}
                      >
                        보완해주세요
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
                          {JSON.parse(x["0"]).complement}
                        </Typography>
                      </Paper> */}
                      {/* <Typography
                        variant="subtitle1"
                        style={{ fontWeight: 700 }}
                      >
                        설계실 곰돌이
                      </Typography> */}
                      <Paper
                        style={{
                          height: "120px",
                          marginBottom: "-10px",
                          boxShadow: "5px 5px 5px 1px rgba(224, 224, 224, 0.8)",
                          overflow: "auto",
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          style={{
                            padding: "20px 20px",
                            paddingTop: "20px",
                            paddingBottom: "40px",
                          }}
                        >
                          {JSON.parse(x["0"]).satisfaction}
                          {/* 너무 잘 도와주신것 같아용!! 다음에 또 어시 하고 싶어용
                          ㅎㅋㅋㅋㅋ */}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          );
        })}
      </div>
    </>
  );
}

const Spinner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  border: 3px solid ${"rgba(255, 255, 255, 0.3)"};
  border-top-color: ${"rgba(255, 255, 255, 1)"};
  animation: anim 0.7s infinite linear;

  @keyframes anim {
    to {
      transform: rotate(360deg);
    }
  }
`;
