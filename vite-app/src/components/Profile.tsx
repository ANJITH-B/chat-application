import { Camera, LogOutIcon } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import Button from './ui/button'

type Props = {}

const Profile = (props: Props) => {
    const { user, isUpdatingProfile, updateProfile } = useAuthStore()

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('profilePic', file);
        updateProfile(formData);
    }


    return (
        <div className='w-full flex flex-col items-center py-5 px-3 pr-8'>
            <div className='flex items-center justify-between w-full'>
                <p className=' text-black font-semibold'>Profile</p>
                <Button variant='link' onClick={() => { }}>
                    <LogOutIcon size={18} />
                </Button>
            </div>
            <div className='py-5 gap-2 w-full flex flex-col items-center'>
                <div className='relative'>
                    <img src={user.profilePic} alt=".." className='rounded-full w-30' />
                    <label
                        htmlFor='profile-upload'
                        className={`cursor-pointer border border-gray-500 p-1.5 rounded-full absolute bottom-0 right-0 backdrop-blur-sm hover:bg-blue-500 hover:text-white
         ${isUpdatingProfile ? 'cursor-not-allowed animate-pulse' : ''}`}
                    >
                        <Camera size={16} strokeWidth={1.5} />
                        <input type="file" id='profile-upload' className='hidden' disabled={isUpdatingProfile} accept='image/*' onChange={handleImageUpload} />
                    </label>
                </div>
                <p className='text-sm'>{user.username}</p>
            </div>

            <p className=' text-black font-semibold w-full text-sm  pb-2'>Personal Informations</p>
            <div className='flex items-center justify-between gap-2 w-full border-b py-2 border-gray-300'>
                <p className=' text-black text-sm'>Email</p>
                <p className=' text-gray-500 text-sm'>{user?.email}</p>
            </div>
            <div className='flex items-center justify-between gap-2 w-full border-b py-2 border-gray-300'>
                <p className=' text-black text-sm'>Member since</p>
                <p className=' text-gray-500 text-sm'>{user?.createdAt && new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
        </div>
    )
}

export default Profile