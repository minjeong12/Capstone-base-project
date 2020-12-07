import React, { Suspense, lazy } from "react";
import { Route, Switch } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./auth/PrivateRoute";
import { CircularProgress } from "@material-ui/core";
import "./styles.css";
import styled from "styled-components";

const UpdateProfilePage = lazy(() => import("./pages/UpdateProfile.page"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPassword.page"));
const JobListsPage = lazy(() => import("./JobLists"));
const LoginRegisterPage = lazy(() => import("./pages/LoginRegister"));
const HomePage = lazy(() => import("./pages/Home.page"));
const NoMatchPage = lazy(() => import("./pages/NoMatch.page"));
const Chatlist = lazy(() => import("./pages/Chatlist"));
const Chat = lazy(() => import("./pages/Chat"));
const Nav = lazy(() => import("./components/Header/Nav"));
const SearchPage = lazy(() => import("./pages/Search.page"));
const Review = lazy(() => import("./pages/Review"));
const MyPage = lazy(() => import("./pages/MyPage"));
// const Result = lazy(() => import("./pages/Result"));

function App(props) {
  return (
    <Container>
      <div style={{ flex: 1, flexDirection: "flex-start" }}>
        <Suspense
          fallback={
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "90vh",
              }}
            >
              <CircularProgress
                variant="static"
                value={75}
                style={{ color: "#f9efb8" }}
              />
            </div>
          }
        >
          <Nav />
          <div>
            <AuthProvider>
              <Switch>
                <PrivateRoute exact path="/" component={JobListsPage} />
                <PrivateRoute
                  path="/update-profile"
                  component={UpdateProfilePage}
                />
                <Route path="/login-register" component={LoginRegisterPage} />
                <Route path="/forgot-password" component={ForgotPasswordPage} />
                <Route path="/home" component={HomePage} />
                <Route exact path="/search/:sId" component={SearchPage} />
                <PrivateRoute path="/talent" component={JobListsPage} />
                <PrivateRoute exact path="/chat" component={Chatlist} />
                <PrivateRoute path="/chat/:chatID" component={Chat} />
                <Route path="/review" component={Review} />
                <Route path="/mypage" component={MyPage} />
                {/* <Route path="/result" component={Result} /> */}
                <Route component={NoMatchPage} />
              </Switch>
            </AuthProvider>
          </div>
        </Suspense>
      </div>
    </Container>
  );
}

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 200%;
  background: url(https://ifh.cc/g/n77edK.jpg/1029x4000);
  background-size: cover;
`;

export default App;
