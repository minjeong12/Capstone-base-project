import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import ButtonBase from "@material-ui/core/ButtonBase";
import ac from "../../assets/ac.jpg";
import { firestore, firebase, app } from "../../firebase/config";
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
    width: 108,
    height: 108,
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
  const { currentUser } = useAuth();
  const uId = props.user;
  const uname = props.uname;
  const uPhoto = props.uPhoto;
  const email = props.email;

  useEffect(() => {
    fetchReviews();
  }, []);

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const db = firebase.firestore();
  var st = 0;

  const fetchReviews = async () => {
    setLoading(true);
    const id = uuid();
    // if (uId === "") {
    if (uId === undefined) {
      const req = await firestore
        .collection("reviews")
        .where("TraderId", "==", currentUser.uid)
        .orderBy("postedOn", "desc")
        .get();
      const tempReviews = req.docs.map((review) => ({
        ...review.data(),
        id: review.id,
        postedOn: review.data().postedOn.toDate(),
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
      const fileRef = db.collection("scores").doc(currentUser.uid);
      fileRef.set(
        {
          st: 50 + st,
          userId: currentUser.uid,
          email: currentUser.email,
          username: currentUser.displayName,
          postedOn: app.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      setReviews(tempReviews);
      props.handleEval(50 + st);
      console.log(tempReviews);

      setLoading(false);
    } else {
      const req = await firestore
        .collection("reviews")
        .where("TraderId", "==", uId)
        .orderBy("postedOn", "desc")
        .get();
      const tempReviews = req.docs.map((review) => ({
        ...review.data(),
        id: review.id,
        postedOn: review.data().postedOn.toDate(),
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
      const fileRef = db.collection("scores").doc(uId);
      fileRef.set(
        {
          st: 50 + st,
          userId: uId,
          email: email,
          username: uname,
          postedOn: app.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      setReviews(tempReviews);
      props.handleEval(50 + st);
      console.log(tempReviews);

      setLoading(false);
    }
  };

  console.log(uId);
  // console.log(reviews);
  return (
    <>
      <div className={classes.root}>
        {reviews.length === 0 && (
          <Grid item xs={12} sm container>
            <Typography>후기가 없습니다.</Typography>
          </Grid>
        )}
        {reviews.map((x, i) => {
          console.log(JSON.parse(x["0"]).complement);
          console.log(JSON.parse(x["0"]).satisfaction);

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
                      <Paper
                        style={{
                          height: "130px",
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
                          {JSON.parse(x["0"]).satisfaction}
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
