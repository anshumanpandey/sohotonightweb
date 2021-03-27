import React from 'react';
import { UsePeerVideo } from '../hooks/UsePeerVideoChat';
import { callEnded, hideVideoModal, useGlobalState } from '../state/GlobalState';
import SohoModal from './SohoModal';

const SohoVideoModal: React.FC = () => {
    const [currentVideoChat] = useGlobalState("currentVideoChat");
    const videoPeer = UsePeerVideo({ parentNode: document.getElementById('video-div') as HTMLElement })

    return (
        <SohoModal
            size={"lg"}
            onClose={() => {
                hideVideoModal()
                videoPeer.endCall(videoPeer.currentVideoChat)
            }}
            show={currentVideoChat != null}
            title="Chatting..."
            footer={(close) => <button onClick={() => {
                close()
            }} type="button" className="btn btn-default">Close</button>}
        >
            <div id="video-div"></div>
        </SohoModal>
    );
}
export default SohoVideoModal;
