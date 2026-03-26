import { Command, Plus, Search } from "lucide-react"

interface SectionProps {
  title: string;
  createRoom?: () => void;
  children: React.ReactNode;
  showMore?: boolean;
}

const InboxPannel = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className='h-screen w-[300px] py-4 px-2 flex flex-col gap-3 items-start font-inter'>
        <p className=' text-black font-semibold'>Conversations</p>
        {children}
      </div>
    </>
  )
}

const SearchBar = () => {
  return (
    <div className='flex items-center  gap-2 w-full h-8 bg-[#E7E7E5] border border-[#D4D4D4] rounded-md px-2'>
      <Search strokeWidth={1} size={18} />
      <input type="text" placeholder='Search' className='w-full h-full outline-none text-xs pb-0.5' />

      <div className='flex items-center justify-center gap-1'>
        <Command strokeWidth={1} size={13} />
        <p className='text-xs'>K</p>
      </div>
    </div>
  )
}

const Section = ({ title, createRoom, children, showMore }: SectionProps) => {
  return (
    <>
      <div className='w-full flex flex-col gap-3 py-3'>
        <div className='flex items-center justify-between w-full gap-2'>
          <p className='text-xs '>{title}</p>
          {createRoom && <button onClick={createRoom} className="cursor-pointer ">
            <Plus strokeWidth={1.5} size={18} />
          </button>}
          <p className={`${showMore ? 'block' : 'hidden'} text-[12px] cursor-pointer`}>Show more</p>
        </div>
        <div className='flex flex-col items-start w-full gap-2 text-black'>
          {children}
        </div>
      </div>
    </>
  )
}


InboxPannel.Section = Section
InboxPannel.SearchBar = SearchBar

export default InboxPannel