import mediasoup from 'mediasoup';

let workers = [];
let nextWorkerIdx = 0;

const config = {
    // Worker settings
    worker: {
        rtcMinPort: 10000,
        rtcMaxPort: 10100, // Reduced range for dev
        logLevel: 'warn',
        logTags: [
            'info',
            'ice',
            'dtls',
            'rtp',
            'srtp',
            'rtcp',
        ],
    },
    // Router settings
    router: {
        mediaCodecs: [
            {
                kind: 'audio',
                mimeType: 'audio/opus',
                clockRate: 48000,
                channels: 2,
            },
            {
                kind: 'video',
                mimeType: 'video/VP8',
                clockRate: 90000,
                parameters: {
                    'x-google-start-bitrate': 1000,
                },
            },
        ],
    },
    // WebRtcTransport settings
    webRtcTransport: {
        listenIps: [
            {
                ip: '127.0.0.1', 
                announcedIp: null,
            },
        ],
        initialAvailableOutgoingBitrate: 1000000,
        minimumAvailableOutgoingBitrate: 600000,
        maxSctpMessageSize: 262144,
    },
};

export const createWorker = async () => {
    const worker = await mediasoup.createWorker({
        logLevel: config.worker.logLevel,
        logTags: config.worker.logTags,
        rtcMinPort: config.worker.rtcMinPort,
        rtcMaxPort: config.worker.rtcMaxPort,
    });

    worker.on('died', () => {
        console.error('mediasoup worker died, exiting in 2 seconds... [pid:%d]', worker.pid);
        setTimeout(() => process.exit(1), 2000);
    });

    workers.push(worker);
    return worker;
};

// Initialize workers on startup
export const initMediasoup = async () => {
    // Create one worker for now
    await createWorker();
};

export const getWorker = () => {
    const worker = workers[nextWorkerIdx];
    nextWorkerIdx = (nextWorkerIdx + 1) % workers.length;
    return worker;
};

export const createTransport = async (router) => {
    const {
        listenIps,
        initialAvailableOutgoingBitrate,
    } = config.webRtcTransport;

    const transport = await router.createWebRtcTransport({
        listenIps,
        enableUdp: true,
        enableTcp: true,
        preferUdp: true,
        initialAvailableOutgoingBitrate,
    });

    transport.on('dtlsstatechange', (dtlsState) => {
        if (dtlsState === 'closed') {
            transport.close();
        }
    });

    transport.on('close', () => {
        console.log('transport closed');
    });

    return {
        transport,
        params: {
            id: transport.id,
            iceParameters: transport.iceParameters,
            iceCandidates: transport.iceCandidates,
            dtlsParameters: transport.dtlsParameters,
        },
    };
};

export const getRouterConfig = () => config.router;
