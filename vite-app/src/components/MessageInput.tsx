import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";
import Button from "./ui/button";

export const MessageInput = () => {
    const [message, setMessage] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { sentMessage } = useChatStore();

    const handleImageChange = (e: any) => {
        const file = e.target.files[0];
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image');
            return;
        }
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => setImagePreview(null);
    
    const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!message.trim() && !imagePreview) return;
        try {
            await sentMessage({ message, image: imagePreview });
            setMessage('');
            setImagePreview(null);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="w-full h-13 border-t border-[#D4D4D4] ">
            <form onSubmit={handleSendMessage} className="flex items-center justify-between px-4 h-full">
                <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder='Type a message...' className='w-full h-full outline-none text-xs pb-0.5' />
                {imagePreview &&
                    <div className="flex flex-row items-center gap-2 relative">
                        <img src={imagePreview} alt="..." className="w-10 h-10 rounded-lg" />
                        <Button className="absolute w-full text-white" variant="icon" type='button' icon="X" onClick={() => removeImage} />
                    </div>
                }
                <Button variant="icon" type='button' icon="Camera" onClick={() => fileInputRef.current?.click()} />
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
                <Button variant="icon" type='submit' icon="Send" />
            </form>
        </div>
    )

}