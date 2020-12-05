import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
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
  const { signup, updateDisplayNameAndPhoto, addUserToDB } = useAuth();
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
      await updateDisplayNameAndPhoto(nameRef.current.value, fileUrl);
      await addUserToDB();

      history.push("/");
    } catch {
      setError("회원가입에 실패했습니다.");
    }

    setLoading(false);
  }

  var imageUrl = "https://ifh.cc/g/v0jZ9D.png";
  const inputRef = useRef();
  const [fileUrl, setFileUrl] = useState(imageUrl);
  const previewRef = useRef();
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

  const handleFileChange = async (e) => {
    e.persist();
    const filed = e.target.files[0];
    const storageRef = firebase.storage().ref();
    const fileRef = storageRef.child(filed.name);
    await fileRef.put(filed);
    setFileUrl(await fileRef.getDownloadURL());

    const newFile = e.target.files[0];
    newFile["id"] = Math.random();
    setFile(newFile);
    console.log(newFile);

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
          para.textContent = `${file.name}`;
          const image = document.createElement("img");
          image.style.height = "400px";
          image.style.width = "400px";
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
  };

  const handleClick = () => {
    inputRef.current.click();
  };

  console.log(file);
  console.log(fileUrl);

  return (
    <div
      className="login-register-area pt-100 pb-100"
      style={{ marginTop: "220px" }}
    >
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
                          <div
                            style={{
                              position: "relative",
                              lineHeight: "1em",
                              textAlign: "center",
                            }}
                          >
                            <img
                              src={fileUrl}
                              alt="profile"
                              style={{
                                width: "140px",
                                height: "140px",
                                left: "50%",
                                marginBottom: "10px",
                              }}
                              ref={previewRef}
                            />

                            <input
                              style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                width: "100%",
                                marginTop: "-0.5em",
                                marginLeft: "-50%",
                                textAlign: "center",
                              }}
                              id="imageInput"
                              type="file"
                              ref={inputRef}
                              hidden="hidden"
                              onChange={(e) => handleFileChange(e)}
                              required
                            />
                            <div className="button-box">
                              <button
                                style={{
                                  width: "145px",
                                  backgroundColor: "lightgray",
                                  color: "white",
                                }}
                                onClick={() => handleClick()}
                              >
                                사진 등록
                              </button>
                            </div>
                          </div>

                          <div className="button-box">
                            <button
                              type="submit"
                              style={{
                                marginTop: "20px",
                              }}
                            >
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
