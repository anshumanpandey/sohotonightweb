import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="footer">
            <div className="container" style={{ display: 'flex'}}>
                <p className="text-muted">
                    Copyright &copy; Company - All rights reserved
                </p>
                <div style={{ marginLeft: 'auto', width: "50%", display: "flex", justifyContent: "space-around" }}>
                    <Link className="text-muted" to={"/privacyPolicy"}>
                        Privacy Policy
                    </Link>
                    <Link className="text-muted" to={"/statementAndOpinion"}>
                        Statement And Opinion
                    </Link>
                    <Link className="text-muted" to={"/antiSlavery"}>
                        Anti Slavery
                    </Link>
                    <Link className="text-muted" to={"/marketplaceAgreement"}>
                        Marketplace Agreement
                    </Link>
                </div>
            </div>
        </footer>
    );
}
export default Footer;
