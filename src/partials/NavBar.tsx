import React from "react";
import { Link } from "react-router-dom";
import logo from "../img/Photos/logo.png";
import UserIsLogged from "../utils/UserIsLogged";
import { showBuyTokensModal, useGlobalState } from "../state/GlobalState";
import UseIsMobile from "../utils/UseIsMobile";
import UseIsLess1200Res from "../utils/UseIsLess1200Res";
import SohoLink from "./SohoLink";
import UserLoggedIsModel from "../utils/UserLoggedIsModel";

function NavBar() {
  const isMobile = UseIsMobile();
  const isLess1200 = UseIsLess1200Res();

  const [userData] = useGlobalState("userData");

  let goTo = "/list-post";
  if (userData && userData.role === "MODEL") {
    goTo = `/profile/${userData.id}`;
  }

  return (
    <nav className="navbar navbar-white navbar-fixed-top">
      <div className="container">
        <div
          className="navbar-header"
          style={{
            display: "flex",
            flexDirection: "row",
            width: isLess1200 ? "100%" : "60%",
          }}
        >
          <button
            type="button"
            className="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#navbar"
            aria-expanded="false"
            aria-controls="navbar"
          >
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: isLess1200 ? "center" : "space-between",
            }}
          >
            <Link className="navbar-brand" to={"/"}>
              <img
                src={logo}
                alt=""
                className="profile-img img-responsive center-block show-in-modal"
                style={{
                  width: isMobile ? "35%" : "60%",
                  display: "block",
                  marginRight: "auto",
                  marginLeft: isMobile ? "auto" : "unset",
                  float: "none",
                }}
              />
            </Link>
            <p
              style={{
                textAlign: isMobile ? "center" : "left",
                marginTop: "auto",
                marginBottom: "auto",
                fontSize: "38px",
                color: "#cd2b6b",
                fontFamily: "Aerolite",
              }}
            >
              #1 Adult Directory
            </p>
          </div>
        </div>
        <div id="navbar" className="navbar-collapse collapse">
          <ul
            style={
              isLess1200
                ? {
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                  }
                : undefined
            }
            className="nav navbar-nav navbar-right"
          >
            <li>
              <Link to={goTo}>Home</Link>
            </li>
            <li>
              <Link to="/contact-us">Contact</Link>
            </li>
            <li>
              <Link to="/about-us">About</Link>
            </li>
            {UserIsLogged() && (
              <li>
                <Link to="/messages">Messages</Link>
              </li>
            )}
            {!UserIsLogged() && (
              <li>
                <Link to="/register">Register/Login</Link>
              </li>
            )}
            {!UserLoggedIsModel() && UserIsLogged() && !UserLoggedIsModel() && (
              <li>
                <SohoLink
                  onClick={() => showBuyTokensModal(true)}
                  disabled={true}
                >
                  <i className="fa fa-diamond"></i>
                  {userData?.tokensBalance}
                </SohoLink>
              </li>
            )}
            {UserIsLogged() && (
              <li>
                <Link to="/logout">
                  <i className="fa fa-sign-out" />
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
export default NavBar;
