import React from 'react';
import { BrandColor } from '../utils/Colors';

const SohoLink: React.FC<{ style?: React.CSSProperties, disabled?: boolean, onClick: () => void }> = ({ children, style, disabled = false, onClick }) => {
    let color = style?.color ? style?.color : BrandColor
    let cursor = 'pointer'
    if (disabled === true) {
        color = "gray"
        cursor = "default"
    }
    return (
        <p onClick={onClick} style={{ cursor: cursor,marginBottom: '10px', fontSize: 15, display: 'inline-block', fontWeight: 'bold', width: '100%', ...style, color: color, }} >
            {children}
        </p>
    );
}
export default SohoLink;
