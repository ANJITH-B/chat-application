import { useEffect, useRef } from 'react'
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import { Message } from './ui/message';

export const ChatContainer = () => {
    const { messages, selectedChat, getMessages, subscribeToMessages, unsubscribeFromMessages, isMessageLoading } = useChatStore();
    const { user: authUser } = useAuthStore();
    const lastMessageRef = useRef<HTMLDivElement>(null);
    const prevCountRef = useRef(0);

    useEffect(() => {
        if (selectedChat?._id) {
            const isGroup = 'isGroup' in selectedChat && selectedChat.isGroup;
            getMessages(selectedChat._id, !!isGroup);
            subscribeToMessages();
        }
        return () => unsubscribeFromMessages();
    }, [selectedChat?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

    useEffect(() => {
        if (messages.length > 0) {
            const behavior = prevCountRef.current === 0 ? "auto" : "smooth";
            lastMessageRef.current?.scrollIntoView({ behavior });
        }
        prevCountRef.current = messages.length;
    }, [messages]);

    if (isMessageLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center gap-2 h-full">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-[#7C7C7C]">Loading messages...</p>
            </div>
        )
    }

    return (
        <>
            {messages.map((message: any) => {
                const isMe = message.senderId?._id === authUser?._id || message.senderId === authUser?._id;
                const sender = isMe ? authUser : message.senderId;
                return (
                    <Message message={message} isMe={isMe} sender={sender} ref={lastMessageRef} />
                );
            })}
        </>
    )
}