
interface ProfileProps {
    image: string;
    name: string;
    description: string;
}

export const Profile = ({ image, name, description }: ProfileProps) => {
    return (
        <>
            <div className='flex flex-row items-start w-full gap-2 text-black'>
                {/* <img src="/logo.svg" alt="..." className='w-5 h-5 bg-[#E7E7E5]' /> */}
                <div className='w-8 h-8 bg-[#E7E7E5] rounded-xl border-2 border-[#D4D4D4]'></div>
                <div className='flex flex-col items-start'>
                    <p className='text-xs '>{name}</p>
                    <p className='text-xs text-[#7C7C7C] '>{description}</p>
                </div>
            </div>
        </>
    )
}