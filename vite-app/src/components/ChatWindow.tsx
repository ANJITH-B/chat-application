import ChatWindow from './layout/chat-window'
import { MessageInput } from './MessageInput'
import { Profile } from './ui/profile'
import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore'
import { Headset, Video } from 'lucide-react'
import { ChatContainer } from './ChatContainer'

type Props = {}

export const ChatSection = (props: Props) => {
    const { onlineUsers } = useAuthStore()
    const { selectedChat } = useChatStore()


    return (
        <ChatWindow isLoading={false} isSelected={!!selectedChat}>
            <ChatWindow.Header>
                {selectedChat && (
                    <Profile 
                        isOnline={!('isGroup' in selectedChat) && onlineUsers.includes(selectedChat._id)} 
                        image={(selectedChat as any).profilePic || (selectedChat as any).image} 
                        name={(selectedChat as any).username || (selectedChat as any).name} 
                        description={('isGroup' in selectedChat) ? (selectedChat as any).description : "In room #XR Prototyping"} 
                    />
                )}
                <div className="flex flex-row gap-5 items-center px-5">
                    <Headset strokeWidth={1} size={20} />
                    <Video strokeWidth={1} />
                </div>
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