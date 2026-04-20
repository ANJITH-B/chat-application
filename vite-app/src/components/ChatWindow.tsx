import ChatWindow from './layout/chat-window'
import { MessageInput } from './MessageInput'
import { Profile } from './ui/profile'
import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore'
import { Headset, Video } from 'lucide-react'
import { ChatContainer } from './ChatContainer'

import { useLayoutStore } from '../store/useLayoutStore'
import { useCallStore } from '../store/useCallStore'
import { useGroupCallStore } from '../store/useGroupCallStore'

type Props = {}

export const ChatSection = (props: Props) => {
    const { onlineUsers } = useAuthStore()
    const { selectedChat } = useChatStore()
    const { setIsCallPannelOpen } = useLayoutStore()
    const { startCall } = useCallStore()
    const { joinGroupCall } = useGroupCallStore()

    const isGroup = selectedChat && 'isGroup' in selectedChat;

    const handleCall = (type: 'audio' | 'video') => {
        if (!selectedChat) return;
        
        if (isGroup) {
            joinGroupCall(selectedChat._id);
        } else {
            setIsCallPannelOpen(true);
            startCall(selectedChat, type);
        }
    }

    return (
        <ChatWindow isLoading={false} isSelected={!!selectedChat}>
            <ChatWindow.Header>
                {selectedChat && (
                    <Profile 
                        isOnline={!isGroup && onlineUsers.includes(selectedChat._id)} 
                        image={(selectedChat as any).profilePic || (selectedChat as any).image} 
                        name={(selectedChat as any).username || (selectedChat as any).name} 
                        description={isGroup ? (selectedChat as any).description : "In room #XR Prototyping"} 
                    />
                )}
                {selectedChat && (
                    <div className="flex flex-row gap-5 items-center px-5">
                        <button 
                            onClick={() => handleCall('audio')}
                            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600 flex items-center gap-2"
                            title={isGroup ? "Join Group Call" : "Voice Call"}
                        >
                            <Headset strokeWidth={1} size={20} />
                            {isGroup && <span className="text-[10px] font-bold">JOIN</span>}
                        </button>
                        <button 
                            onClick={() => handleCall('video')}
                            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
                            title={isGroup ? "Join Group Call" : "Video Call"}
                        >
                            <Video strokeWidth={1} />
                        </button>
                    </div>
                )}
            </ChatWindow.Header>
            <ChatWindow.Body>
                <ChatContainer />
            </ChatWindow.Body>
            <ChatWindow.Footer>
                <MessageInput />
            </ChatWindow.Footer>
        </ChatWindow>
    )
}