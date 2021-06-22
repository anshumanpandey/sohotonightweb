import React from 'react';
import Loader from "react-loader-spinner";
import { BrandColor } from '../utils/Colors';

const SohoLoader: React.FC<{ show: boolean,size?: number }> = ({ size = 80, show = false }) => {
    if (show === false) return <></>

    return (
        <div style={{ pointerEvents: "none", position: 'absolute', backgroundColor: '#ffffff50', display: 'flex', justifyContent: 'center', width: '100%', height: '100%' }}>
            <Loader
                type="ThreeDots"
                color={BrandColor}
                height={size}
                width={size}
            />
        </div>
    );
}

export default SohoLoader;