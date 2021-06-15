import React from 'react';
import { UsePeerVideo, useVideoState } from '../hooks/UsePeerVideoChat';
import SohoModal from './SohoModal';

const SohoVideoModal: React.FC = () => {
    const [currentVideoChat] = useVideoState("currentVideoChat")

    const videoPeer = UsePeerVideo({ parentNode: document.getElementById('video-div') as HTMLElement })

    return (
        <SohoModal
            closeOnBackdropClik={false}
            size={"lg"}
            onClose={() => {
                console.log('endCall')
                videoPeer.endCall(currentVideoChat)
            }}
            show={currentVideoChat != null}
            title="Chatting..."
            footer={(close) => <button onClick={() => {
                close()
            }} type="button" className="btn btn-default">Hang Up</button>}
        >
            <div id="video-div" className="embed-responsive embed-responsive-16by9"></div>
        </SohoModal>
    );
}
export default SohoVideoModal;
