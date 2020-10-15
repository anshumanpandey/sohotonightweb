import React from 'react';

function ErrorLabel({ message }: { message: string }) {
    return (
        <p style={{ color: 'rgba(255,0,0,0.6)'}}>{message}</p>
    );
}
export default ErrorLabel;
