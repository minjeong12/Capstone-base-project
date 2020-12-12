import React, { useEffect, useRef, useState } from "react";
import Grid from "@material-ui/core/Grid";
import {
  Box,
  Button,
  FilledInput,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { useAuth } from "../../contexts/AuthContext";
import uploadFilesIcon from "../../assets/uploadFilesIcon.png";
import { firebase } from "../../firebase/config";

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
  skillChip: {
    margin: theme.spacing(0.5),
    padding: theme.spacing(0.75),
    fontSize: "14.5px",
    borderRadius: "5px",
    transition: ".3s",

    fontWeight: 600,
    border: `1px solid  #0B0B15`,
    color: "#0B0B15",
    cursor: "pointer",

    "&:hover": {
      backgroundColor: "#0B0B15",
      color: "#fff",
    },
  },
  included: {
    backgroundColor: "#0B0B15",
    color: "#fff",
  },
  openJobButton: {
    margin: theme.spacing(0.5),
    padding: theme.spacing(0.75),
    fontSize: "14.5px",
    borderRadius: "5px",
    transition: ".3s",

    fontWeight: 600,
    border: `1px solid #0B0B15`,
    color: "#0B0B15",
  },
}));

export default function PortfolioGrid(props) {
  const portDetails = props.portDetails;
  const classes = useStyles();
  const { currentUser } = useAuth();
  const inputRef = useRef();
  const previewRef = useRef();
  // const [fileUrl, setFileUrl] = useState(null);
  const [files, setFiles] = useState("");
  const fileTypes = [
    "image/apng",
    "image/pjpeg",
    "image/png",
    "image/svg+xml",
    "image/tiff",
    "image/webp",
    "image/x-icon",
    "image/bmp",
    "image/cgm",
    "image/vnd.djvu",
    "image/gif",
    "image/x-icon",
    "text/calendar",
    "image/ief",
    "image/jp2",
    "image/jpeg",
    "image/x-macpaint",
    "image/x-portable-bitmap",
    "image/pict",
    "image/x-portable-anymap",
    "image/x-macpaint",
    "image/x-portable-pixmap",
    "image/x-quicktime",
    "image/x-cmu-raster",
    "image/x-rgb",
    "image/tiff",
    "image/vnd.wap.wbmp",
    "image/x-xbitmap",
    "image/x-xpixmap",
    "image/x-xwindowdump",
  ];

  function validFileType(file) {
    return fileTypes.includes(file.type);
  }

  function returnFileSize(number) {
    if (number < 1024) {
      return number + "bytes";
    } else if (number >= 1024 && number < 1048576) {
      return (number / 1024).toFixed(1) + "KB";
    } else if (number >= 1048576) {
      return (number / 1048576).toFixed(1) + "MB";
    }
  }

  const onFileChange = async (e) => {
    e.persist();
    const filed = e.target.files[0];
    const storageRef = firebase.storage().ref();
    if (filed !== undefined) {
      const fileRef = storageRef.child(filed.name);
      await fileRef.put(filed);
      // setFileUrl(await fileRef.getDownloadURL());
      props.furl(await fileRef.getDownloadURL());

      for (let i = 0; i < e.target.files.length; i++) {
        const newFile = e.target.files[i];
        newFile["id"] = Math.random();
        // add an "id" property to each File object
        setFiles((prevState) => [...prevState, newFile]);
        console.log(newFile);
        console.log(files);
      }
      while (previewRef.current.firstChild) {
        previewRef.current.removeChild(previewRef.current.firstChild);
      }

      const curFiles = inputRef.current.files;
      if (curFiles.length === 0) {
        const para = document.createElement("p");
        para.textContent = "No files currently selected for upload";
        previewRef.current.appendChild(para);
      } else {
        const list = document.createElement("ol");
        previewRef.current.appendChild(list);

        for (const file of curFiles) {
          const listItem = document.createElement("div");
          const para = document.createElement("p");

          if (validFileType(file)) {
            para.style.color = "black";
            para.textContent = `${file.name},  ${returnFileSize(file.size)}.`;
            const image = document.createElement("img");
            image.style.height = "100px";
            image.style.width = "100px";
            image.src = URL.createObjectURL(file);

            listItem.appendChild(image);
            listItem.appendChild(para);
          } else {
            para.textContent = `${file.name}: Not a valid file type. Update your selection.`;
            para.style.color = "red";
            listItem.appendChild(para);
          }

          list.appendChild(listItem);
        }
      }
    }
  };

  const skills = [
    "판넬작업",
    "다이어그램",
    "도면작업",
    "심부름",
    "모형작업",
    "기타업무",
  ];

  // console.log(props.ports[0]);
  // console.log(props.ports[0].intro);

  return (
    <>
      <div className={classes.root}>
        <Grid className={classes.paper}>
          <Grid container>
            <Grid item xs={12} sm container>
              <Grid item xs container direction="column" spacing={2}>
                <Grid item xs>
                  <Grid
                    style={{
                      height: "130px",
                      marginBottom: "-10px",
                    }}
                  >
                    <h3>소개</h3>
                    {/* 안녕하세요 :) 설계실 곰돌이 입니다. 앞으로 많은 소통해요~ */}
                    {props.ports === undefined ? (
                      <FilledInput
                        onChange={props.handleChange}
                        name="intro"
                        value={portDetails.intro}
                        placeholder="intro *"
                        disableUnderline
                        fullWidth
                        multiline
                        rows={2}
                      />
                    ) : (
                      <>{props.ports[0] && props.ports[0].intro}</>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid className={classes.paper}>
          <Grid container>
            <Grid item xs={12} sm container>
              <Grid item xs container direction="column" spacing={2}>
                <Grid item xs>
                  <Grid
                    style={{
                      height: "130px",
                      marginBottom: "-10px",
                    }}
                  >
                    <h3>보유 능력</h3>
                    {props.ports === undefined ? (
                      <Box display="flex">
                        {skills.map((skill) => (
                          <Box
                            onClick={() => props.addRemoveSkill(skill)}
                            className={`${classes.skillChip} ${
                              portDetails.skills.includes(skill) &&
                              classes.included
                            }`}
                            key={skill}
                          >
                            {skill}
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <>
                        <Grid container alignItems="center">
                          {props.ports[0] &&
                            props.ports[0].skills.map((skill) => (
                              <Grid
                                item
                                key={skill}
                                className={classes.openJobButton}
                              >
                                {skill}
                              </Grid>
                            ))}
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid className={classes.paper}>
          <Grid container>
            <Grid item xs={12} sm container>
              <Grid item xs container direction="column" spacing={2}>
                <Grid item xs>
                  <Grid
                    style={{
                      height: "130px",
                      marginBottom: "-10px",
                    }}
                  >
                    <h3>자격증 리스트</h3>
                    {props.ports === undefined ? (
                      <FilledInput
                        onChange={props.handleChange}
                        name="certificate"
                        value={portDetails.certificate}
                        placeholder="certificate *"
                        disableUnderline
                        fullWidth
                        multiline
                        rows={2}
                      />
                    ) : (
                      <>{props.ports[0] && props.ports[0].certificate}</>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid className={classes.paper}>
          <Grid container>
            <Grid item xs={12} sm container>
              <Grid item xs container direction="column" spacing={2}>
                <Grid item xs>
                  <Grid
                    style={{
                      height: "180px",
                      marginBottom: "-10px",
                    }}
                  >
                    <h3>포트폴리오</h3>
                    {props.ports === undefined ? (
                      <Button variant="contained" component="label">
                        <label htmlFor="file_uploads">
                          {inputRef.current !== undefined &&
                          inputRef.current.files.length === 0 ? (
                            <img
                              src={uploadFilesIcon}
                              width="35"
                              height="35"
                              alt="uploadFilesIcon"
                            />
                          ) : null}
                        </label>
                        <input
                          id={"file-input"}
                          type="file"
                          name="imageFile"
                          style={{
                            display: "none",
                            opacity: 0,
                            width: "30px",
                            height: "30px",
                          }}
                          ref={inputRef}
                          onChange={onFileChange}
                        />
                        <div className="preview" ref={previewRef}>
                          <p>No files currently selected for upload</p>
                        </div>
                      </Button>
                    ) : (
                      <>
                        {props.ports[0] && (
                          <img
                            src={props.ports[0].imageUrl}
                            style={{
                              width: "100px",
                              height: "100px",
                            }}
                          ></img>
                        )}
                      </>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </>
  );
}
