import SimplePeer from 'simple-peer';

export const buildPeerClient = (p?: SimplePeer.Options) => {
    return new SimplePeer({
        config: {
            iceServers: [
                //{ urls: 'stun:stun.sohotonight.com:5349?transport=tcp' },
                {'url': 'stun:stun.l.google.com:19302', 'urls': 'stun:stun.l.google.com:19302'}
            ]
        },
        ...p
    })
}