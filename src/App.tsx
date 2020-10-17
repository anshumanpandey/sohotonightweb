import React, { useEffect } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { transitions, positions, Provider as AlertProvider, useAlert } from 'react-alert'

import "./utils/AxiosBootstrap"
import Landing from './pages/landing/landing.page';
import ContactUs from './pages/contactus/ContactUs.page';
import AboutUs from './pages/AboutUs/AboutUs.page';
import LoginPage from './pages/login/Login.page';
import RegisterPage from './pages/Register/RegisterPage.page';
import ListPostPage from './pages/ListPosts/ListPost.page';
import ProtectedRoute from './partials/ProtectedRoute';
import ProfileEditPage from './pages/Profile/ProfileEdit.page';
import ProfilePage from './pages/Profile/Profile.page';
import VideosPage from './pages/Profile/Videos.page';
import PicturesPage from './pages/Profile/pictures/Pictures.page';
import AboutPage from './pages/Profile/About.page';
import VideoUpload from './pages/Profile/VideoUpload.page';
import LogoutPage from './pages/logout/logout.page';
import ComingSoon from './pages/comingSoon/CominSoon.page';
import enter from './img/Photos/enter-bg.jpg';
import { dispatchGlobalState, GLOBAL_STATE_ACIONS, useGlobalState } from './state/GlobalState';
import 'react-block-ui/style.css';

function App() {
  const alert = useAlert()
  const [error] = useGlobalState('error')
  const [globalLoading] = useGlobalState('globalLoading')

  useEffect(() => {
    if (!error) return
    alert.error(error, {
      onClose: () => {
        dispatchGlobalState({ type: GLOBAL_STATE_ACIONS.ERROR, payload: null })
      }
    })
  }, [error])

  return (
    <body style={{ minHeight: '100vh', backgroundColor: '#e9eaed', backgroundImage: `url(${enter})`, backgroundSize: "cover", backgroundRepeat: "no-repeat" }}>
      <Router>
        <Switch>
          <Route exact path="/">
            <ComingSoon />
          </Route>
          <Route exact path="/preview">
            <Landing />
          </Route>
          <Route path="/contact-us">
            <ContactUs />
          </Route>
          <Route path="/about-us">
            <AboutUs />
          </Route>
          <Route path="/register">
            <RegisterPage />
          </Route>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route path="/list-post">
            <ListPostPage />
          </Route>
          <Route path="/profile/:id?">
            <ProfilePage />
          </Route>
          <Route path="/profile-about/:id?">
            <AboutPage />
          </Route>
          <Route path="/profile-video/:id?">
            <VideosPage />
          </Route>
          <Route path="/profile-pictures/:id?">
            <PicturesPage />
          </Route>
          <ProtectedRoute path="/profile-edit" component={ProfileEditPage} />
          <ProtectedRoute path="/video-upload/:id?" component={VideoUpload} />
          <ProtectedRoute path="/logout" component={LogoutPage} />
        </Switch>
      </Router>
    </body>
  );
}

export default App;
