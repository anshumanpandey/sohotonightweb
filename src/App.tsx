import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
//@ts-ignore
import AlertTemplate from 'react-alert-template-basic'
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
import PicturesPage from './pages/Profile/Pictures.page';
import AboutPage from './pages/Profile/About.page';
import PictureUpload from './pages/Profile/PictureUpload.page';
import VideoUpload from './pages/Profile/VideoUpload.page';

const options = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_CENTER,
  timeout: 5000,
  offset: '30px',
  // you can also just use 'scale'
  transition: transitions.SCALE
}

function App() {
  return (
  <body style={{ backgroundColor: '#e9eaed'}}>
    <Router>
    <AlertProvider template={AlertTemplate} {...options}>
      <Switch>
        <Route exact path="/">
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
        <ProtectedRoute path="/list-post" component={ListPostPage} />
        <ProtectedRoute path="/profile" component={ProfilePage} />
        <ProtectedRoute path="/profile-edit" component={ProfileEditPage} />
        <ProtectedRoute path="/profile-video" component={VideosPage} />
        <ProtectedRoute path="/profile-pictures" component={PicturesPage} />
        <ProtectedRoute path="/profile-about" component={AboutPage} />        
        <ProtectedRoute path="/picture-upload" component={PictureUpload} />
        <ProtectedRoute path="/video-upload" component={VideoUpload} />
      </Switch>
      </AlertProvider>
    </Router>
  </body>
  );
}

export default App;
