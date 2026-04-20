
interface ProfileProps {
    image: string;
    name: string;
    description: string;
    onClick?: () => void;
    isOnline?: boolean;
    isSelected?: boolean;
    unreadMessages?: number;
    toggle?: boolean;
}

export const Profile = ({ image, name, description, onClick, isOnline, isSelected, unreadMessages, toggle }: ProfileProps) => {
    return (
        <>
            <button onClick={onClick} className={`flex flex-row items-center justify-between w-full gap-2 text-black transition-all duration-200 ease-in-out ${isSelected ? 'bg-[#E7E7E5] rounded-lg px-1 py-1.5' : ''}`}>
                <div className="flex items-center justify-end gap-2">
                    <div className="relative">
                        <img
                            src={image ? image : "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"}
                            alt="..."
                            className='w-8 h-8 bg-[#E7E7E5] rounded-xl border-2 border-[#D4D4D4]'
                        />
                        {isOnline && <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-white" />}
                    </div>
                    <div className='flex flex-col items-start flex-1 overflow-hidden'>
                        <p className='text-xs font-medium'>{name}</p>
                        <p className={`text-[10px]  truncate w-full text-start ${unreadMessages ? "text-blue-500 font-semibold" : "text-[#7C7C7C]"}`}>{description}</p>
                    </div>
                </div>
                    {unreadMessages && !toggle ? (
                        <div className="bg-blue-500 text-white text-[9px] min-w-[17px] h-[17px] rounded-full flex items-center justify-center px-1">
                            {unreadMessages}
                        </div>
                    ) : null}
                {toggle && (
                    <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-slate-300'}`}>
                        {isSelected && (
                            <div className='w-1.5 h-1.5 bg-white rounded-full' />
                        )}
                    </div>
                )}
            </button>

        </>
    )
}
