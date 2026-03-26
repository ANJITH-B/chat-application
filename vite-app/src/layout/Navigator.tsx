import { Layers, MessageSquareText } from "lucide-react";

const Navigator = () => {
    return (
        <>
            <div className='h-screen w-15 bg-[#F0EFEB] flex flex-col gap-7 items-center py-5'>
                <img src="/logo.svg" alt="" className='w-5 h-5' />
                <Layers strokeWidth={1} />
                <MessageSquareText strokeWidth={1} />
            </div>
        </>
    )
}

export default Navigator