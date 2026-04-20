import { Check, CheckCheck } from "lucide-react"

interface MessageProps {
    message: any;
    isMe: boolean;
    sender: any;
    ref: React.RefObject<HTMLDivElement | null>;
}

export const Message = ({ message, isMe, sender, ref }: MessageProps) => {
    return (
        <div ref={ref} key={message._id} className={`flex flex-row items-start gap-2 ${isMe ? 'flex-row-reverse self-end' : 'self-start'}`}>
            <img src={sender?.profilePic || "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"} alt="..." className="w-8 h-8 rounded-full" />
            <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <p className="text-[10px] text-[#7C7C7C]">{sender?.username}</p>
                <div className={`p-2 rounded-lg max-w-xs flex items-end gap-1 ${isMe ? 'bg-blue-100 text-ˀblack' : 'bg-[#E5E5EA] text-black'}`}>
                    {message.image && <img src={message.image} alt="attachment" className="max-w-full rounded-md mb-1" />}
                    {message.message && (
                        <div className="text-sm wrap-anywhere leading-tight">
                            {message.message}
                            <div className="flex items-center gap-1 float-right mt-1.5 ml-1 leading-none">
                                <span className="text-[10px] text-[#7C7C7C]">
                                    {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                {isMe && (
                                    message.isSeen ? (
                                        <CheckCheck size={12} className="text-blue-500" />
                                    ) : (
                                        <Check size={12} className="text-[#7C7C7C]" />
                                    )
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}