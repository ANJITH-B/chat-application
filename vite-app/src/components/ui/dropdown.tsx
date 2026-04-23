import { LogOutIcon, UserIcon } from 'lucide-react'
import Button from './button'
import { useAuthStore } from '../../store/useAuthStore'
import { useLayoutStore } from '../../store/useLayoutStore'


const Dropdown = () => {
    const { logout } = useAuthStore();
    const { setIsProfileOpen } = useLayoutStore();

    return (
        <div className='w-40 h-fit absolute bg-white rounded-md shadow-lg z-10'>
            <ul>
                <li className='border-b border-gray-300'>
                    <Button className='flex items-center justify-between w-full px-3 py-2.5' variant='icon' onClick={logout}>
                        <span className='text-sm'>Logout</span>
                        <LogOutIcon size={18} />
                    </Button>
                </li>
                <li>
                    <Button className='flex items-center justify-between w-full px-3 py-2.5' variant='icon' onClick={() => setIsProfileOpen(true)}>
                        <span className='text-sm '>Profile</span>
                        <UserIcon size={18} />
                    </Button>
                </li>
            </ul>
        </div>
    )
}

export default Dropdown