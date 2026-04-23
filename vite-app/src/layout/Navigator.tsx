import { Layers, MessageSquareText } from "lucide-react";
import Button from "../components/ui/button";
import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";
import Dropdown from "../components/ui/dropdown";

const Navigator = () => {
    const { user } = useAuthStore()

    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    return (
        <>
            <div className='h-screen w-26 bg-[#F0EFEB] flex flex-col gap-7 items-center justify-between py-5'>
                <div className="flex flex-col gap-7 items-center">
                    <img src="/logo.svg" alt="" className='w-5 h-5' />
                    <Layers strokeWidth={1.5} />
                    <MessageSquareText strokeWidth={1.5} />
                </div>
                <div className="flex flex-col gap-7 items-center relative">
                    <Button variant='icon' onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                        <img src={user.profilePic} alt="" className='w-8 h-8 rounded-full border' />
                    </Button>
                    {isDropdownOpen && (
                        <div className="absolute -top-full left-full ml-2">
                            <Dropdown />
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default Navigator