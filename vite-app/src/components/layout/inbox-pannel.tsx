import { Command, Plus, Search } from "lucide-react"
import Button from "../ui/button";

interface SectionProps {
  title: string;
  button?: {
    onClick: () => void
    label : string 
  };
  children: React.ReactNode;
}

const InboxPannel = ({ children }: { children: React.ReactNode }) => {
  return (
    <aside className='h-screen py-4 px-2 flex flex-col gap-3 items-start font-inter'>
      <p className=' text-black font-semibold'>Conversations</p>
      {children}
    </aside>
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

const Section = ({ title, children, button }: SectionProps) => {
  return (
    <>
      <div className='w-full flex flex-col gap-3 py-3'>
        <div className='flex items-center justify-between w-full gap-2'>
          <p className='text-xs font-semibold text-slate-500 uppercase tracking-wider'>{title}</p>
          {button && <Button variant="icon" onClick={button.onClick} className="cursor-pointer text-xs rounded-lg gap-1 pr-3 pb-1.5">
            <Plus strokeWidth={1.5} size={18} />
           {button.label}
          </Button>}
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