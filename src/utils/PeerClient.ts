import SimplePeer from 'simple-peer';

export const buildPeerClient = (p?: SimplePeer.Options) => {
    return new SimplePeer({
        config: {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:global.stun.twilio.com:3478?transport=udp' },
                { urls: 'stun:stun.services.mozilla.com'},
                { urls: 'stun:stun.sohotonight.com:5349?transport=tcp' },
            ]
        },
        ...p
    })
}