import React from 'react';
import { Link } from 'react-router-dom';
import AuthenticatedFactory from '../utils/AuthenticatedFactory';
import logo from '../img/Photos/logo.png'

function NavBar() {
    return (
        <nav className="navbar navbar-white navbar-fixed-top">
            <div className="container">
                <div className="navbar-header">
                    <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar"
                        aria-expanded="false" aria-controls="navbar">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                    <Link className="navbar-brand" to="">
                        <img src={logo} alt="" className="profile-img img-responsive center-block show-in-modal" />
                    </Link>
                </div>
                <div id="navbar" className="navbar-collapse collapse">
                    <ul className="nav navbar-nav navbar-right">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/contact-us">Contact Us</Link></li>
                        <li><Link to="/about-us">About Us</Link></li>
                        {AuthenticatedFactory({
                            authenticated: () => {
                                return (
                                    <>
                                    <li><Link to="/profile-edit">Edit Profile</Link></li>
                                    <li><Link to="/logout">Logout</Link></li>
                                    </>
                                );
                            },
                            nonAuthenticated: () => {
                                return (
                                    <>
                                    <li><Link to="/login">Login</Link></li>
                                    <li><Link to="/register">Register</Link></li>
                                    </>
                                );
                            }
                        })}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
export default NavBar;
