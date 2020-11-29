import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  makeStyles,
  Typography,
} from "@material-ui/core";
import {
  Close as CloseIcon,
  MailOutline as MessageIcon,
} from "@material-ui/icons";
import * as dateFns from "date-fns";
import { useAuth } from "../../contexts/AuthContext";
import UpdateJobModal from "./UpdateJobModal";
import { Link } from "react-router-dom";
import defaultImage from "../../assets/sampleImage.PNG";

export default (props) => {
  const classes = useStyles();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [updateJobModal, setUpdateJobModal] = useState(false);

  console.log("props.job.userId", props.job.userId);

  const closeModal = () => {
    setLoading(false);

    // props.closeViewModal();
    props.closeModal();
  };

  return (
    <Dialog open={!!Object.keys(props.job).length} fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          [{props.job.location}]{props.job.title}
          <IconButton onClick={props.closeModal}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box>
          <Box className={classes.info} display="flex">
            <Typography variant="caption">작성일 : </Typography>
            <Typography variant="body2">
              {props.job.postedOn &&
                dateFns.format(props.job.postedOn, "yyyy-MM-dd HH:MM")}
            </Typography>
          </Box>

          <Box className={classes.info} display="flex">
            <Grid item container fullWidth>
              <img
                src={props.imageUrl != null ? props.imageUrl : defaultImage}
                height="200px"
                width="355px"
                alt="testA"
                style={{ borderRadius: 10 }}
              />
            </Grid>
            <Typography
              variant="body2"
              style={{ marginLeft: "-165px", padding: "10px" }}
            >
              Project simple description
            </Typography>
            <Typography
              variant="body2"
              style={{ marginTop: "65px", marginLeft: "-190px" }}
            >
              <Grid className={classes.openRewardButton}>
                {props.job.reward}
              </Grid>
            </Typography>

            <Box style={{ marginTop: "159px", marginLeft: "-90px" }}>
              <DialogActions>
                <Button
                  variant="contained"
                  className={classes.openMessageButton}
                  disableElevation
                  disabled={loading}
                  style={{ marginLeft: "-10px", marginRight: "-20px" }}
                >
                  {loading ? (
                    <CircularProgress color="secondary" size={22} />
                  ) : (
                    <>
                      <Link
                        to={{
                          pathname: "/chat",
                          query: {
                            userId: props.job.userId ? props.job.userId : null,
                          },
                        }}
                      >
                        <Typography>쪽지 보내기</Typography>
                        {/* <MessageIcon /> */}
                      </Link>
                    </>
                  )}
                </Button>
              </DialogActions>
            </Box>
          </Box>

          <Box
            className={classes.info}
            display="flex"
            style={{ marginBottom: "30px" }}
          >
            <Typography variant="caption">
              -------------------------------------------------------------------------------
            </Typography>
          </Box>

          <Box className={classes.info} display="flex">
            <Typography variant="caption">(부엉이 프로필) : </Typography>
            <Typography variant="body2" style={{ marginBottom: "30px" }}>
              {props.job.userId}
            </Typography>
          </Box>
          <Box
            className={classes.info}
            display="flex"
            style={{ marginBottom: "30px" }}
          >
            <Typography variant="caption">
              -------------------------------------------------------------------------------
            </Typography>
          </Box>
          {/* <Box className={classes.info} display="flex">
            <Typography variant="caption">Job title : </Typography>
            <Typography variant="body2">{props.job.title}</Typography>
          </Box> */}
          {/* <Box className={classes.info} display="flex">
            <Typography variant="caption">Job school : </Typography>
            <Typography variant="body2">{props.job.school}</Typography>
          </Box> */}
          <Box className={classes.info} display="flex">
            <Typography variant="caption">작업실 위치 : </Typography>
            <Typography variant="body2" style={{ marginBottom: "30px" }}>
              {props.job.location}
            </Typography>
          </Box>

          <Box className={classes.info} display="flex">
            <Typography variant="caption">
              구하는 부엉이 어시 인원수 :{" "}
            </Typography>
            <Typography variant="body2" style={{ marginBottom: "30px" }}>
              {props.job.nOfPeople}
            </Typography>
          </Box>
          <Box className={classes.info} display="flex">
            <Typography variant="caption">부엉이 어시 성별 : </Typography>
            <Typography variant="body2" style={{ marginBottom: "30px" }}>
              {props.job.sex}
            </Typography>
          </Box>
          {/* <Box className={classes.info} display="flex">
            <Typography variant="caption">Job type : </Typography>
            <Typography variant="body2">{props.job.type}</Typography>
          </Box> */}

          <Box className={classes.info} display="flex">
            <Typography variant="caption">프로젝트 설명 : </Typography>
            <Typography variant="body2" style={{ marginBottom: "30px" }}>
              {props.job.description}
            </Typography>
          </Box>
          <Box className={classes.info} display="flex">
            <Typography variant="caption">부엉이 어시 구하는 날 : </Typography>
            <Typography variant="body2" style={{ marginBottom: "30px" }}>
              {props.job.endDate}
            </Typography>
          </Box>
          <Box ml={0.5} style={{ marginBottom: "30px" }}>
            <Typography variant="caption">부엉이 어시가 할 일 : </Typography>
            <Grid container alignItems="center">
              {props.job.skills &&
                props.job.skills.map((skill) => (
                  <Grid item key={skill} className={classes.openJobButton}>
                    {skill}
                  </Grid>
                ))}
            </Grid>
          </Box>

          <Box
            className={classes.info}
            display="flex"
            style={{ marginBottom: "30px" }}
          >
            <Typography variant="caption">
              부엉이 어시 시다경험 유무 :{" "}
            </Typography>
            <Typography variant="body2">{props.job.experience}</Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        {props.job.userId === currentUser.email ? (
          <Grid>
            <Button
              style={{ marginRight: "10px" }}
              variant="contained"
              onClick={() => setUpdateJobModal(true)}
            >
              수정
            </Button>
            <UpdateJobModal
              closeModal={() => setUpdateJobModal(false)}
              closeViewModal={props.closeModal}
              updateJobModal={updateJobModal}
              updateJob={props.updateJob}
              job={props.job}
            />
            <Button
              style={{ backgroundColor: "red" }}
              variant="contained"
              onClick={() => {
                if (
                  window.confirm("Are you sure you wish to delete this post?")
                ) {
                  props.deleteJob(props.job);
                  closeModal();
                }
              }}
            >
              삭제
            </Button>
          </Grid>
        ) : null}
      </DialogActions>
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  info: {
    "& > *": {
      margin: "4px",
    },
  },
  skillChip: {
    margin: theme.spacing(0.5),
    padding: theme.spacing(0.75),
    fontSize: "14.5px",
    borderRadius: "5px",
    transition: ".3s",
    fontWeight: 600,
    backgroundColor: theme.palette.secondary.main,
    color: "#fff",
  },
  openJobButton: {
    // backgroundColor: theme.palette.subColor.main,
    margin: theme.spacing(0.5),
    padding: theme.spacing(0.75),
    fontSize: "14.5px",
    borderRadius: "5px",
    transition: ".3s",
    fontWeight: 600,
    color: "#fff",
    backgroundColor: theme.palette.mainColor.main,
  },
  openMessageButton: {
    backgroundColor: "#e1bee7",
  },
  openRewardButton: {
    fontSize: "14.5px",
    height: "70px",
    width: "70px",
    borderRadius: "50%",
    textAlign: "center",
    lineHeight: "72px",
    transition: ".3s",
    fontWeight: 600,
    color: "#fff",
    backgroundColor: theme.palette.mainColor.main,
  },
}));
