import React from 'react';

type Props = { onClick: (e: any) => void, value: string, block?: boolean, size?: "sm" | 'lg', style?: React.CSSProperties, disabled?: boolean }
function SohoButton({ onClick, value, size = 'sm',block = false, style, disabled = false }: Props) {
    const resolveSize = () => {
        if (size == "sm") return 14
        if (size == "lg") return 18
    }
    return (
            <div className="upload-btn-wrapper" style={{ borderColor: disabled ? "#9f9f9f" : "#cf2c6b", color: disabled ? "#9f9f9f" : "#cf2c6b", display: 'table',width: block ? "100%": "unset", ...style }}>
                <button type="button" disabled={disabled} style={{ padding: 5, fontSize: resolveSize(), alignSelf: "center" }} onClick={onClick} className="btn">
                    {value}
                </button>
            </div>
    );
}
export default SohoButton;
