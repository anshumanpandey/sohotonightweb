import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import "./utils/AxiosBootstrap"
import Landing from './pages/landing/landing.page';
import ContactUs from './pages/contactus/ContactUs.page';
import AboutUs from './pages/AboutUs/AboutUs.page';
import LoginPage from './pages/login/Login.page';
import RegisterPage from './pages/Register/RegisterPage.page';
import ListPostPage from './pages/ListPosts/ListPost.page';

function App() {
  return (
  <body style={{ backgroundColor: '#e9eaed'}}>
    <Router>
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
        <Route path="/list-post">
          <ListPostPage />
        </Route>
      </Switch>
    </Router>
  </body>
  );
}

export default App;
