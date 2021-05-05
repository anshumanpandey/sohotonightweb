import React, { useEffect } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
  Link,
} from "react-router-dom";
import { transitions, positions, Provider as AlertProvider, useAlert } from 'react-alert'
import CookieConsent from "react-cookie-consent";
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
import PicturesPage from './pages/Profile/pictures/Pictures.page';
import AboutPage from './pages/Profile/About.page';
import VideosPage from './pages/Profile/Videos.page';
import LogoutPage from './pages/logout/logout.page';
import ComingSoon from './pages/comingSoon/CominSoon.page';
import enter from './img/Photos/enter-bg.jpg';
import { dispatchGlobalState, GLOBAL_STATE_ACIONS, updateCurrentUser, useGlobalState } from './state/GlobalState';
import currentPageIs from './utils/currentPageIs';
import PaymentPage from './pages/payment/Payment.Page';
import CookiePolicy from './pages/cookiePolicy/CookiePolicy.page';
import PrivacyPolicy from './pages/privacyPolicy/PrivacyPolicy.page';
import StatementAndOpinion from './pages/statementAndOpinion/StatementAndOpinion.page';
import UserAgreement from './pages/userAgreement/UserAgreement.page';
import WebUserAgreement from './pages/webUserAgreement/WebUserAgreement.page';
import AntiSlavery from './pages/antiSlavery/AntiSlavery.page';
import MarketplaceAgreement from './pages/marketplaceAgreement/MarketplaceAgreement.page';
import RegionsPage from './pages/regions/Regions.page';
import CallTest from './pages/callTest/CallTest.page';
import VideoChat from './pages/Profile/VideoChat.page';
import BuyTokenModal from './partials/BuyTokenModal';
import { answerInvitation } from './request/socketClient';
import VoiceCallsTracker from './partials/NotificationTracker';
import SohoCallModal from './partials/CallModal';
import SohoVideoModal from './partials/VideoModal';
import UserIsLogged from './utils/UserIsLogged';
import UserLoggedIsModel from './utils/UserLoggedIsModel';
import MessagesPage from './pages/messages/Messages.page';
import BuyConfirmModal from './partials/BuyConfirmModal';

function App() {
  const alert = useAlert()
  const location = useLocation()
  const [jwtToken] = useGlobalState('jwtToken')
  const [error] = useGlobalState('error')
  const [info] = useGlobalState('info')
  const [success] = useGlobalState('success')

  useEffect(() => {
    answerInvitation()
    if (jwtToken) {
      updateCurrentUser()
    }
  }, [])

  useEffect(() => {
    if (!error) return
    alert.error(error, {
      onClose: () => {
        dispatchGlobalState({ type: GLOBAL_STATE_ACIONS.ERROR, payload: null })
      }
    })
  }, [error])

  useEffect(() => {
    if (!info) return
    alert.info(info, {
      onClose: () => {
        dispatchGlobalState({ type: GLOBAL_STATE_ACIONS.INFO, payload: null })
      }
    })
  }, [info])

  useEffect(() => {
    if (!success) return
    alert.success(success, {
      onClose: () => {
        dispatchGlobalState({ type: GLOBAL_STATE_ACIONS.SUCCESS, payload: null })
      }
    })
  }, [success])

  const pageToShowBackgroundImg = () => {
    return currentPageIs(location.pathname, "preview") ||
      currentPageIs(location.pathname, "")
  }

  return (
    <body style={{ minHeight: '100vh', backgroundColor: '#e9eaed', display: 'flex', flexDirection: 'column', backgroundImage: pageToShowBackgroundImg() ? `url(${enter})` : undefined, backgroundSize: "cover", backgroundRepeat: "no-repeat" }}>
      <Switch>
        <Route exact path="/">
          <Landing />
        </Route>
        <Route exact path="/cookiePolicy">
          <CookiePolicy />
        </Route>
        <Route exact path="/callTest">
          <CallTest />
        </Route>
        <Route exact path="/privacyPolicy">
          <PrivacyPolicy />
        </Route>
        <Route exact path="/statementAndOpinion">
          <StatementAndOpinion />
        </Route>  
        <Route exact path="/userAgreement">
          <UserAgreement />
        </Route>
        <Route exact path="/webUserAgreement">
          <WebUserAgreement />
        </Route>
        <Route exact path="/regions">
          <RegionsPage />
        </Route>
        <Route exact path="/antiSlavery">
          <AntiSlavery />
        </Route>
        <Route exact path="/marketplaceAgreement">
          <MarketplaceAgreement />
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
        <Route path="/video-chat/:id?/:acceptedInvitationId?">
          <VideoChat />
        </Route>
        <Route path="/profile-video/:id?">
          <VideosPage />
        </Route>
        <Route path="/messages">
          <MessagesPage />
        </Route>
        <Route path="/profile-pictures/:id?">
          <PicturesPage />
        </Route>
        <Route path="/payment">
          <PaymentPage />
        </Route>
        <ProtectedRoute path="/profile-edit" component={ProfileEditPage} />
        <ProtectedRoute path="/logout" component={LogoutPage} />
      </Switch>
      {UserIsLogged() && <BuyConfirmModal />}
      {UserIsLogged() && <SohoCallModal />}
      {UserIsLogged() && <SohoVideoModal />}
      {UserIsLogged() && <BuyTokenModal />}
      {UserIsLogged() && <VoiceCallsTracker />}
      
      <CookieConsent buttonText="Accept Cookies">
        This website uses cookies to enhance the user experience.{' '}
        <Link to="/cookiePolicy">See more</Link>
      </CookieConsent>
    </body>
  );
}

export default App;
