import { Mic, MicOff, Phone, PhoneOff, Video, VideoOff, X, Users } from 'lucide-react';
import { useCallStore } from '../store/useCallStore';
import { useGroupCallStore } from '../store/useGroupCallStore';
import { useEffect, useRef } from 'react';
import { useLayoutStore } from '../store/useLayoutStore';
import { useChatStore } from '../store/useChatStore';

const ParticipantVideo = ({ stream, name }: { stream: MediaStream, name: string }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    return (
        <div className="relative bg-slate-800 rounded-lg overflow-hidden aspect-video border border-white/10 group">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-md rounded text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                {name}
            </div>
        </div>
    );
};

const CallPannel = () => {
    const {
        callStatus,
        callType,
        localStream: p2pLocalStream,
        remoteStream: p2pRemoteStream,
        incomingCall,
        targetUser: p2pTargetUser,
        isMuted: p2pIsMuted,
        isVideoOff: p2pIsVideoOff,
        answerCall,
        rejectCall,
        endCall,
        toggleMute: toggleP2PMute,
        toggleVideo: toggleP2PVideo
    } = useCallStore();

    const {
        isGroupCallActive,
        localStream: groupLocalStream,
        participants,
        leaveGroupCall,
        produceMedia,
    } = useGroupCallStore();

    const { selectedChat } = useChatStore();
    const { setIsCallPannelOpen } = useLayoutStore();
    
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (localVideoRef.current && (p2pLocalStream || groupLocalStream)) {
            localVideoRef.current.srcObject = p2pLocalStream || groupLocalStream;
        }
    }, [p2pLocalStream, groupLocalStream]);

    useEffect(() => {
        if (remoteVideoRef.current && p2pRemoteStream) {
            remoteVideoRef.current.srcObject = p2pRemoteStream;
        }
    }, [p2pRemoteStream]);

    const handleClose = () => {
        if (isGroupCallActive) {
            leaveGroupCall();
        } else if (callStatus === 'idle') {
            setIsCallPannelOpen(false);
        } else {
            endCall();
        }
    };

    if (!isGroupCallActive && callStatus === 'idle' && !incomingCall) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-6 bg-slate-50 border-l border-slate-200 animate-in fade-in slide-in-from-right-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                    <Phone className="text-slate-400" size={32} />
                </div>
                <p className="text-slate-500 text-sm font-medium">No active call</p>
                <button onClick={() => setIsCallPannelOpen(false)} className="mt-4 text-xs text-blue-500 hover:underline">Close panel</button>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-[#0f172a] text-white relative border-l border-slate-800 overflow-hidden">
            {/* Header */}
            <div className="p-4 flex items-center justify-between z-10 bg-gradient-to-b from-black/50 to-transparent">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold">
                        {isGroupCallActive ? <Users size={20} /> : (p2pTargetUser?.username || incomingCall?.from?.username)?.[0].toUpperCase()}
                    </div>
                    <div>
                        <p className="text-sm font-medium truncate w-32">
                            {isGroupCallActive ? (selectedChat as any)?.name || "Group Call" : (p2pTargetUser?.username || incomingCall?.from?.username)}
                        </p>
                        <p className="text-[10px] text-slate-300 capitalize">
                            {isGroupCallActive ? `${participants.size + 1} Participants` : callStatus}
                        </p>
                    </div>
                </div>
                <button onClick={handleClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <X size={20} />
                </button>
            </div>

            {/* Video Container */}
            <div className="flex-1 relative bg-slate-900 overflow-hidden flex flex-col">
                {isGroupCallActive ? (
                    <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
                        <div className={`grid gap-4 ${
                            participants.size === 0 ? 'grid-cols-1' : 
                            participants.size < 3 ? 'grid-cols-1 md:grid-cols-2' : 
                            'grid-cols-2'
                        }`}>
                            {/* Local Video in Grid */}
                            <div className="relative bg-slate-800 rounded-lg overflow-hidden aspect-video border border-blue-500/30 group">
                                <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                                <div className="absolute bottom-2 left-2 px-2 py-1 bg-blue-600/50 backdrop-blur-md rounded text-[10px] font-medium">
                                    You
                                </div>
                            </div>

                            {/* Remote Participants */}
                            {Array.from(participants.values()).map((p) => (
                                <ParticipantVideo key={p.userId} stream={p.stream} name={`User ${p.userId.slice(-4)}`} />
                            ))}
                        </div>
                        
                        {participants.size === 0 && !groupLocalStream && (
                            <div className="h-full flex flex-col items-center justify-center gap-4 text-slate-400">
                                <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center border border-white/5">
                                    <Video size={40} />
                                </div>
                                <p className="text-sm">You are the only one here</p>
                                <button 
                                    onClick={() => produceMedia(selectedChat?._id || "", "video")}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-full text-xs font-medium hover:bg-blue-700 transition-colors"
                                >
                                    Enable Camera
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        {/* P2P Content (Previous implementation) */}
                        <div className="flex-1 relative">
                            {callType === 'video' ? (
                                <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-800">
                                    <div className="w-24 h-24 rounded-full bg-blue-600/20 flex items-center justify-center animate-pulse">
                                        <Mic size={48} className="text-blue-500" />
                                    </div>
                                </div>
                            )}

                            {callType === 'video' && p2pLocalStream && (
                                <div className="absolute bottom-4 right-4 w-32 aspect-video bg-black rounded-lg overflow-hidden border border-white/20 shadow-xl ring-2 ring-black/20">
                                    <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                                </div>
                            )}
                            
                            {callStatus === 'dialing' && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
                                    <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center animate-bounce mb-4"><Phone size={32} /></div>
                                    <p className="text-lg font-medium">Dialing...</p>
                                </div>
                            )}

                            {callStatus === 'ringing' && incomingCall && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md z-20">
                                    <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center mb-6 relative">
                                        <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-25"></div>
                                        <img src={incomingCall.from.profilePic || ""} className="w-full h-full rounded-full border-4 border-blue-500" alt="" />
                                    </div>
                                    <p className="text-xl font-bold mb-1">{incomingCall.from.username}</p>
                                    <p className="text-sm text-slate-300 mb-8">Incoming {incomingCall.type} call...</p>
                                    <div className="flex gap-8">
                                        <button onClick={rejectCall} className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600"><PhoneOff size={24} /></button>
                                        <button onClick={answerCall} className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-600"><Phone size={24} /></button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Controls Bar */}
            {(callStatus === 'active' || isGroupCallActive) && (
                <div className="p-6 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center gap-6 z-10">
                    <button 
                        onClick={() => isGroupCallActive ? null : toggleP2PMute()}
                        className={`p-4 rounded-full transition-all ${p2pIsMuted ? 'bg-red-500' : 'bg-white/10 hover:bg-white/20'}`}
                    >
                        {p2pIsMuted ? <MicOff size={24} /> : <Mic size={24} />}
                    </button>
                    
                    <button 
                        onClick={handleClose}
                        className="p-4 rounded-full bg-red-500 hover:bg-red-600 transition-all shadow-lg shadow-red-500/30 hover:scale-110 active:scale-95"
                    >
                        <PhoneOff size={28} />
                    </button>

                    <button 
                        onClick={() => isGroupCallActive ? produceMedia(selectedChat?._id || "", "video") : toggleP2PVideo()}
                        className={`p-4 rounded-full transition-all ${p2pIsVideoOff ? 'bg-red-500' : 'bg-white/10 hover:bg-white/20'}`}
                    >
                        {p2pIsVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
                    </button>
                </div>
            )}
        </div>
    );
};

export default CallPannel;