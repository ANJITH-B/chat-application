import { Layers, LogOutIcon, MessageSquareText } from "lucide-react";
import Button from "../components/ui/button";
import { useAuthStore } from "../store/useAuthStore";

const Navigator = () => {
    const { logout, user } = useAuthStore()

    return (
        <>
            <div className='h-screen w-15 bg-[#F0EFEB] flex flex-col gap-7 items-center py-5'>
                {user?.profilePicture ? (
                    <img src={user.profilePicture} alt="" className='w-5 h-5' />
                ) : (
                    <img src="/logo.svg" alt="" className='w-5 h-5' />
                )}
                <p>{user.username}</p>
                <Layers strokeWidth={1} />
                <MessageSquareText strokeWidth={1} />
                <Button variant='link' onClick={logout}>
                    <LogOutIcon size={18} />
                </Button>
            </div>
        </>
    )
}

export default Navigator