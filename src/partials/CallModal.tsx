import React from 'react';
import { useGlobalState } from '../state/GlobalState';
import SohoModal from './SohoModal';

const SohoCallModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [isCalling] = useGlobalState("isCalling");
    const [callStatus] = useGlobalState("callStatus")

    return (
        <SohoModal
            onClose={() => onClose()}
            show={isCalling}
            title="Calling..."
            footer={() => <button onClick={() => {
                onClose()
            }} type="button" className="btn btn-default">Close</button>}
        >
            {callStatus}
        </SohoModal>
    );
}
export default SohoCallModal;
