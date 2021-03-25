import React from 'react';
import { callEnded, useGlobalState } from '../state/GlobalState';
import SohoModal from './SohoModal';

const SohoCallModal: React.FC = () => {
    const [currentCall] = useGlobalState("currentCall");

    return (
        <SohoModal
            onClose={() => callEnded()}
            show={currentCall != null && !(currentCall == "Ending...")}
            title="Calling..."
            footer={(close) => <button onClick={() => {
                close()
            }} type="button" className="btn btn-default">Close</button>}
        >
            {currentCall}
        </SohoModal>
    );
}
export default SohoCallModal;
