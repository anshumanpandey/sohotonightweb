import SimplePeer from 'simple-peer';

export const buildPeerClient = (p?: SimplePeer.Options) => {
    return new SimplePeer({
        config: {
            debugger: true,
            iceServers: [
                {
                    urls: 'stun:stun.sohotonight.com:5349',
                    "username": "admin",
                    "credential": "123456abc!" },
                {
                    "urls": "turn:turn.sohotonight.com:5349",
                    "username": "admin",
                    "credential": "123456abc!"
                }
                //{'url': 'stun:stun.l.google.com:19302', 'urls': 'stun:stun.l.google.com:19302'}
            ]
        },
        ...p
    })
}