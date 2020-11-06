import React from 'react';
import { Link } from 'react-router-dom';
import AuthenticatedFactory from '../utils/AuthenticatedFactory';
import logo from '../img/Photos/logo.png'
import UserIsLogged from '../utils/UserIsLogged';
import { useGlobalState } from '../state/GlobalState';

function NavBar() {
    const [userData] = useGlobalState("userData")
    const goTo = userData ? `/profile/${userData.id}`:"/" 
    return (
        <nav className="navbar navbar-white navbar-fixed-top">
            <div className="container">
                <div className="navbar-header" style={{ display: 'flex', flexDirection: 'row'}}>
                    <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar"
                        aria-expanded="false" aria-controls="navbar">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                    <Link className="navbar-brand" to={goTo}>
                        <img src={logo} alt="" className="profile-img img-responsive center-block show-in-modal" />
                    </Link>
                    <p style={{ marginTop: "auto", marginBottom: "auto", fontSize: "38px", color: '#cd2b6b', fontFamily: 'AlexBrush-Regular' }}>
                        UK'S No.1 Adult Directory
                    </p>
                </div>
                <div id="navbar" className="navbar-collapse collapse">
                    <ul className="nav navbar-nav navbar-right">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/contact-us">Contact Us</Link></li>
                        <li><Link to="/about-us">About Us</Link></li>
                        {UserIsLogged() && <li><Link to="/logout">Logout</Link></li>}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
export default NavBar;
