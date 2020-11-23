import React from 'react';
import { Link } from 'react-router-dom';
import { BrandColor } from '../utils/Colors';
import UseIsMobile from '../utils/UseIsMobile';

function Footer() {
    const isMobile = UseIsMobile();

    return (
        <footer className="footer">
            <div className="container" style={{ display: 'flex', flexDirection: isMobile ? "column" : "row" }}>
                <p className="text-muted">
                    Copyright &copy; Sohotonight Limited - All rights reserved
                </p>
                <div style={{ marginLeft: 'auto', flexDirection: isMobile ? 'column': 'row',width: isMobile ? "100%" : "55%", display: "flex", justifyContent: "space-around" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                        <Link style={{ marginLeft: 'auto', textAlign: isMobile ? 'center': "left" }} className="text-muted" to={"/privacyPolicy"}>
                            Privacy Policy
                    </Link>
                        <Link style={{ marginLeft: 'auto', textAlign: isMobile ? 'center': "left" }} className="text-muted" to={"/statementAndOpinion"}>
                            Statement And Opinion
                    </Link>
                        <Link style={{ marginLeft: 'auto', textAlign: isMobile ? 'center': "left" }} className="text-muted" to={"/antiSlavery"}>
                            Anti Slavery
                    </Link>
                        <Link style={{ marginLeft: 'auto', textAlign: isMobile ? 'center': "left" }} className="text-muted" to={"/marketplaceAgreement"}>
                            Marketplace Agreement
                    </Link>
                    </div>
                    <div style={{ marginLeft: isMobile ? "auto":'5%', marginRight: isMobile ? "auto": undefined,display: "flex", alignItems: "center", justifyContent: "space-between", width: isMobile ? "50%":"12%" }}>
                        <a target="_blank" style={{ color: BrandColor }} href="https://www.youtube.com/channel/UC0op8VoVJKDylALcmbNbF6Q">
                            <i style={{ fontSize: '2rem' }} className="fa fa-youtube-play" aria-hidden="true"></i>
                        </a>
                        <a target="_blank" style={{ color: BrandColor }} href="https://twitter.com/sohotonight">
                            <i style={{ fontSize: '2rem' }} className="fa fa-twitter" aria-hidden="true"></i>
                        </a>
                        <a target="_blank" style={{ color: BrandColor }} href="https://www.instagram.com/sohotonight">
                            <i style={{ fontSize: '2rem' }} className="fa fa-instagram" aria-hidden="true"></i>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
export default Footer;
