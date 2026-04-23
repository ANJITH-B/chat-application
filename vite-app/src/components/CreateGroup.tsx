import { useState } from 'react'
import { useLayoutStore } from '../store/useLayoutStore'
import { useChatStore } from '../store/useChatStore'
import Button from './ui/button'
import { Camera } from 'lucide-react'
import { useEffect } from 'react'
import Popup from './ui/popup'

export const CreateGroup = () => {
    const [name, setName] = useState('')
    const [groupImage, setGroupImage] = useState<string>('')
    const [description, setDescription] = useState('')
    const { setIsGroupCreationOpen, setIsGroupCreationPopupOpen } = useLayoutStore()
    const { createGroup, users, getUsers, selectedMembers } = useChatStore()


    useEffect(() => {
        if (users.length === 0) getUsers()
    }, [users.length, getUsers])


    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setGroupImage(reader.result as string);
          };
          reader.readAsDataURL(file);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return
        // Ensure current user is included if desired, but backend usually handles adding admin
        await createGroup(name, description, "", selectedMembers)
        setIsGroupCreationOpen(false)
        setIsGroupCreationPopupOpen(false)
    }

    return (
        <Popup onClose={() => setIsGroupCreationPopupOpen(false)}>
            <form onSubmit={handleCreate} className='flex flex-col gap-4 overflow-hidden'>
                <div className='flex flex-col gap-2 items-center'>
                    <div className='relative w-fit my-5'>
                        <img src={groupImage || "https://static.vecteezy.com/system/resources/thumbnails/073/422/950/small/community-forum-group-chat-collaboration-icon-vector.jpg"} alt=".." className='rounded-full w-30 border' />
                        <label
                            htmlFor='profile-upload'
                            className={`cursor-pointer border border-gray-500 p-1.5 rounded-full absolute bottom-0 right-0 backdrop-blur-sm hover:bg-blue-500 hover:text-white
        `}
                        >
                            <Camera size={16} strokeWidth={1.5} />
                            <input type="file" id='profile-upload' className='hidden' accept='image/*' onChange={handleImageUpload} />
                        </label>
                    </div>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder='Group name'
                        className='w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                    />
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder='Group description (optional)'
                        className='w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                    />
                </div>

                    <Button
                        type='submit'
                        className={`bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-all ${(!name.trim() || selectedMembers.length === 0) ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                    >
                        Create Group
                    </Button>
            </form>
        </Popup>
    )
}


//  ${isUpdatingProfile ? 'cursor-not-allowed animate-pulse' : ''}