import React from 'react';
import { callEnded, useGlobalState } from '../state/GlobalState';
import SohoModal from './SohoModal';

const SohoCallModal: React.FC = () => {
    const [currentCall] = useGlobalState("currentCall");

    return (
        <SohoModal
            onClose={() => callEnded()}
            show={currentCall.isCalling ? currentCall.isCalling : false}
            title="Calling..."
            footer={() => <button onClick={() => {
                callEnded()
            }} type="button" className="btn btn-default">Close</button>}
        >
            {currentCall?.callStatus}
        </SohoModal>
    );
}
export default SohoCallModal;
