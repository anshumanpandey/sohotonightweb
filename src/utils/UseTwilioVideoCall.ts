import useAxios from "axios-hooks"
import { connect, createLocalTracks, createLocalVideoTrack } from "twilio-video"

export const UseTwilioVideoCall = () => {

    const [callTokenReq, request] = useAxios({
        method: 'GET',
    }, { manual: true })
    
    const initVideoCall = async (params: { identity: string, roomName: string, divNode: any }) => {

        return request({ url: '/video/generateVideoToken', params: { identity: params.identity, roomName: params.roomName } })
        .then(({ data }) => {
            return connect(data.token, { name: params.roomName })
            .then((room) => {
                room.on('participantConnected', participant => {
                    console.log(`Participant "${participant.identity}" connected`);
                  
                    participant.tracks.forEach(publication => {
                      if (publication.isSubscribed) {
                        const track = publication.track;
                        //@ts-ignore
                        params.divNode.appendChild(track?.attach());
                      }
                    });

                    participant.on('trackSubscribed', track => {
                        //@ts-ignore
                        params.divNode.appendChild(track?.attach());
                    });
                });

                createLocalVideoTrack().then(track => {
                    track.dimensions.height = 100
                    track.dimensions.width = 200
                    params.divNode.appendChild(track.attach());
                });
                  

            })
        })

    }

    return {
        initVideoCall
    }
}