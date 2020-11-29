import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import Tooltip from "@material-ui/core/Tooltip";
import { firebase } from "../firebase/config";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const emailRef2 = useRef();
  const passwordRef2 = useRef();
  const { login, currentUser } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const passwordConfirmRef = useRef();
  const nameRef = useRef();
  const fileRef = useRef();
  const {
    signup,
    updateDisplayName,
    addUserToDB,
    updatePhotoImage,
  } = useAuth();
  const [file, setFile] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      history.push("/");
    } catch {
      setError("로그인에 실패했습니다.");
    }

    setLoading(false);
  }

  async function handleSubmit2(e) {
    e.preventDefault();

    if (passwordRef2.current.value !== passwordConfirmRef.current.value) {
      return setError("비밀번호가 일치하지 않습니다.");
    }
    try {
      setError("");
      setLoading(true);
      console.log("em", emailRef2.current.value);
      console.log("pw", passwordRef2.current.value);
      console.log("nm", nameRef.current.value);
      await signup(emailRef2.current.value, passwordRef2.current.value);
      await updateDisplayName(nameRef.current.value, fileRef.current.value);
      // addImage();
      await addUserToDB();

      history.push("/");
    } catch {
      setError("회원가입에 실패했습니다.");
    }

    setLoading(false);
  }

  var imageUrl = "https://ifh.cc/g/v0jZ9D.png";

  const handleClick = () => {
    fileRef.current.click();
  };

  const handleFileChange = (event) => {
    console.log("Make something");
    setFile(event.target.files[0]);
  };

  // function addImage() {
  //   try {
  //     const imageRef = firebase.firestore().collection("images").add({
  //       userEmail: currentUser.email,
  //       postedOn: firebase.firestore.FieldValue.serverTimestamp(),
  //     });
  //     const imageSnapshot = firebase
  //       .storage()
  //       .ref(`images/${imageRef.id}.png`)
  //       .put(file);
  //     const imageoUrl = imageSnapshot.ref.getDownloadURL();
  //     imageRef.update({ image: imageoUrl });
  //   } catch (err) {
  //     throw err;
  //   }
  // }

  console.log(file);

  return (
    // <div className="w-100" style={{ maxWidth: "400px" }}>
    <div className="login-register-area pt-100 pb-100" style={{ marginTop: "220px"}}>
      {error && (
        <section>
          <p>Error</p>
          This is an error alert — <strong>{error}</strong>
        </section>
      )}
      <div className="container">
        <div className="row">
          <div className="col-lg-7 col-md-12 ml-auto mr-auto">
            <div className="login-register-wrapper">
              <Tab.Container defaultActiveKey="login">
                <Nav variant="pills" className="login-register-tab-list">
                  <Nav.Item>
                    <Nav.Link eventKey="login">
                      <h4>로그인</h4>
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="register">
                      <h4>Register</h4>
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
                <Tab.Content>
                  <Tab.Pane eventKey="login">
                    <div className="login-form-container">
                      <div className="login-register-form">
                        <form onSubmit={handleSubmit}>
                          <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            ref={emailRef}
                            required
                          />
                          <input
                            type="password"
                            name="user-password"
                            placeholder="Password"
                            ref={passwordRef}
                            required
                          />
                          <div className="button-box">
                            <div className="login-toggle-btn">
                              <input type="checkbox" />
                              <label className="ml-10">Remember me</label>
                              <Link to="/forgot-password">비밀번호 재설정</Link>
                            </div>
                            <button type="submit">
                              <span>Login</span>
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="register">
                    <div className="login-form-container">
                      <div className="login-register-form">
                        <form onSubmit={handleSubmit2}>
                          <input
                            id="standard-adornment-name-confirm"
                            type="text"
                            placeholder="user-name"
                            ref={nameRef}
                            required
                          />
                          <input
                            id="standard-adornment-password"
                            type="password"
                            placeholder="Password"
                            ref={passwordRef2}
                            required
                          />
                          <input
                            id="standard-adornment-password-confirm"
                            type="password"
                            placeholder="Password-confirm"
                            ref={passwordConfirmRef}
                            required
                          />
                          <input
                            id="standard-adornment-email"
                            type="email"
                            placeholder="Email"
                            ref={emailRef2}
                            required
                          />
                          {/* <img
                            src={imageUrl}
                            alt="profile"
                            style={{
                              width: "140px",
                              height: "140px",
                              left: "50%",
                              marginBottom: "10px",
                            }}
                          />
                          <input
                            id="imageInput"
                            type="file"
                            ref={fileRef}
                            hidden="hidden"
                            onChange={(e) => handleFileChange(e)}
                            required
                          />
                          <Tooltip
                            title="Edit profile picture"
                            placement="top"
                            style={{ marginTop: "100px" }}
                          >
                            <IconButton className="button">
                              <EditIcon
                                color="primary"
                                onClick={() => handleClick()}
                              />
                            </IconButton>
                          </Tooltip> */}
                          <div className="button-box">
                            <button type="submit">
                              <span>Register</span>
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
