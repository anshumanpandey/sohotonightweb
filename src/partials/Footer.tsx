import React from 'react';
import { Link } from 'react-router-dom';
import { BrandColor } from '../utils/Colors';

function Footer() {
    return (
        <footer className="footer">
            <div className="container" style={{ display: 'flex' }}>
                <p className="text-muted">
                    Copyright &copy; Company - All rights reserved
                </p>
                <div style={{ marginLeft: 'auto', width: "55%", display: "flex", justifyContent: "space-around" }}>
                    <Link style={{ marginLeft: 'auto' }} className="text-muted" to={"/privacyPolicy"}>
                        Privacy Policy
                    </Link>
                    <Link style={{ marginLeft: 'auto' }} className="text-muted" to={"/statementAndOpinion"}>
                        Statement And Opinion
                    </Link>
                    <Link style={{ marginLeft: 'auto' }} className="text-muted" to={"/antiSlavery"}>
                        Anti Slavery
                    </Link>
                    <Link style={{ marginLeft: 'auto' }} className="text-muted" to={"/marketplaceAgreement"}>
                        Marketplace Agreement
                    </Link>
                    <div style={{ marginLeft: '5%',display: "flex", alignItems: "center", justifyContent: "space-between", width: "12%" }}>
                        <a target="_blank" style={{ color: BrandColor }} href="https://www.youtube.com/channel/UC0op8VoVJKDylALcmbNbF6Q">
                            <i style={{ fontSize: '2rem'}} className="fa fa-youtube-play" aria-hidden="true"></i>
                        </a>
                        <a target="_blank" style={{ color: BrandColor }} href="https://twitter.com/sohotonight">
                            <i style={{ fontSize: '2rem'}} className="fa fa-twitter" aria-hidden="true"></i>
                        </a>
                        <a target="_blank" style={{ color: BrandColor }} href="https://www.instagram.com/sohotonight">
                            <i style={{ fontSize: '2rem'}} className="fa fa-instagram" aria-hidden="true"></i>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
export default Footer;
