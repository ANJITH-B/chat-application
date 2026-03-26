import { Headset, Video } from "lucide-react"

const ChatWindow = () => {
    return (
        <>
            <div className='w-full border border-[#D4D4D4] my-5 mx-3 mr-6 rounded-xl'>
                <div className='w-full h-13 border-b border-[#D4D4D4] flex items-center justify-between px-4'>
                    <div className='flex items-center gap-2'>
                        <div className='w-8 h-8 bg-[#E7E7E5] rounded-xl border-2 border-[#D4D4D4]'></div>
                        <div className='flex flex-col items-start'>
                            <p className='text-xs text-black'>Ramachandran</p>
                            <p className='text-[11px] leading-4 text-[#7C7C7C] '>In room #XR Prototyping</p>
                        </div>
                    </div>
                    <div className="flex flex-row gap-5 items-center px-5">
                        <Headset strokeWidth={1} size={20} />
                        <Video strokeWidth={1} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChatWindow
