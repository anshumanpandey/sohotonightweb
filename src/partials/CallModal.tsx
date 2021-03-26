import React from 'react';
//@ts-ignore
import AudioSpectrum from 'react-audio-spectrum';
import { UsePeerCall } from '../hooks/UsePeerCall';
import { callEnded, useGlobalState } from '../state/GlobalState';
import { BrandColor } from '../utils/Colors';
import SohoModal from './SohoModal';

const SohoCallModal: React.FC = () => {
    const [currentCall] = useGlobalState("currentCall");
    const call = UsePeerCall({ node: document.getElementById('call-div') as HTMLElement })

    return (
        <SohoModal
            onClose={() => callEnded()}
            show={currentCall != null && !(currentCall == "Ending...")}
            title="Calling..."
            footer={(close) => <button onClick={() => {
                close()
            }} type="button" className="btn btn-default">Close</button>}
        >
            <p style={{ fontSize: 20, color: BrandColor, textAlign: 'center' }}>{currentCall}</p>
            <div id="call-div"></div>
            {/*call.audioPlayer && (
                <AudioSpectrum
                    id="audio-canvas"
                    height={200}
                    width={300}
                    audioId={'voice-player'}
                    capColor={'red'}
                    capHeight={2}
                    meterWidth={2}
                    meterCount={512}
                    meterColor={[
                        { stop: 0, color: '#f00' },
                        { stop: 0.5, color: '#0CD7FD' },
                        { stop: 1, color: 'red' }
                    ]}
                    gap={4}
                />
            )*/}
        </SohoModal>
    );
}
export default SohoCallModal;
