import React, { Children } from 'react'
import Button from './button'
import { X } from 'lucide-react'

type Props = {
    children: React.ReactNode
    onClose: () => void
    className?: string
}

const Popup = ({children, onClose, className}: Props) => {
  return (
    <div onClick={onClose} className={`fixed inset-0 flex items-center justify-center w-screen h-screen backdrop-blur-xs bg-black/20 z-50 ${className}`}>
      <div
        onClick={(e) => e.stopPropagation()}
        className='w-[450px] max-h-[600px] bg-white p-6 rounded-xl shadow-2xl flex flex-col gap-4'>
        
        <div className='flex items-center justify-between pb-3'>
          <h1 className=' font-semibold text-slate-800'>Create New Group</h1>
          <Button variant='icon' onClick={onClose}> <X size={20} /> </Button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default Popup