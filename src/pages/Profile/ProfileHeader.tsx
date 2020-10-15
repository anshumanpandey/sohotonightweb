import React from 'react';
import { Link } from 'react-router-dom';
import cover from '../../img/Cover/profile-cover.jpg';
import photo1 from '../../img/Photos/1.jpg';
import '../../css/cover.css';

function ProfileHeader() {
    return (
        <div className="row">
            <div className="col-md-12">
                <div className="cover profile">
                    <div className="wrapper" style={{ padding: 0 }}>
                        <div className="image">
                            <img src={cover} className="show-in-modal" alt="people" />
                        </div>

                    </div>
                    <div className="cover-info">
                        <div className="avatar">
                            <img src={photo1} alt="people" />
                        </div>
                        <div className="name"><a href="#">John Breakgrow jr.</a></div>
                        <ul className="cover-nav">
                            <li>
                                <Link to="/profile">
                                    <i className="fa fa-fw fa-bars"></i> Timeline
                                </Link>
                            </li>
                            <li className="active">
                                <Link to="/profile-about">
                                    <i className="fa fa-fw fa-user"></i> About
                                </Link>
                            </li>
                            <li className="active">
                                <Link to="/profile-pictures">
                                    <i className="fa fa-picture-o"></i> Picture
                                </Link>
                            </li>
                            <li>
                                <Link to="/profile-video">
                                    <i className="fa fa-picture-o"></i> Video
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ProfileHeader;
