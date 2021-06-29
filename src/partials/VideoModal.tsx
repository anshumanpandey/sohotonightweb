import React from 'react';
import { UsePeerVideo, useVideoState } from '../hooks/UsePeerVideoChat';
import { BrandColor } from '../utils/Colors';
import SohoModal from './SohoModal';

const SohoVideoModal: React.FC = () => {
    const [currentVideoChat] = useVideoState("currentVideoChat")

    const videoPeer = UsePeerVideo({ parentNode: document.getElementById('video-div') as HTMLElement })

    let iconBaseStyle: React.CSSProperties = { fontSize: '2.5rem', padding: '0.5rem', cursor: 'pointer', color: BrandColor }
    let disablebaleIconStyles: React.CSSProperties = iconBaseStyle
    if (videoPeer.isBroadcastingVideo === false) {
        disablebaleIconStyles = { ...iconBaseStyle, color: 'black', background: '#00000080', borderRadius: '50%', opacity: 0.5 }
    }

    const endCall = () => videoPeer.endCall(currentVideoChat)

    return (
        <SohoModal
            closeOnBackdropClik={false}
            size={"lg"}
            onClose={endCall}
            show={currentVideoChat != null}
            title="Chatting..."
            footer={() => {
                return (
                    <div style={{ display: 'flex', justifyContent: "space-around" }}>
                        <i onClick={videoPeer.isBroadcastingAudio ? videoPeer.muteMyself : videoPeer.shareAudio} style={disablebaleIconStyles} className={`fa fa-microphone`} aria-hidden="true"></i>
                        <i onClick={videoPeer.isBroadcastingVideo ? videoPeer.stopMyVideo : videoPeer.shareVideo} style={disablebaleIconStyles} className="fa fa-video-camera" aria-hidden="true"></i>
                        <i onClick={videoPeer.requestFullScreen} style={disablebaleIconStyles} className={`fa fa-expand`} aria-hidden="true"></i>
                        <i onClick={endCall} style={iconBaseStyle} className={`fa fa-window-close`} aria-hidden="true"></i>
                    </div>
                )
            }}
        >
            <div id="video-div" className="embed-responsive embed-responsive-16by9"></div>
        </SohoModal>
    );
}
export default SohoVideoModal;
