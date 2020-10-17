import React from 'react';

type Props = { onClick: () => void, value: string, block?: boolean, size?: "sm" | 'lg', style?: React.CSSProperties }
function SohoButton({ onClick, value, size = 'sm',block = false, style }: Props) {
    const resolveSize = () => {
        if (size == "sm") return 14
        if (size == "lg") return 18
    }
    return (
            <div className="upload-btn-wrapper" style={{ display: 'table',width: block ? "100%": "unset", ...style }}>
                <button style={{ padding: 5, fontSize: resolveSize(), alignSelf: "center" }} onClick={onClick} className="btn">
                    {value}
                </button>
            </div>
    );
}
export default SohoButton;
