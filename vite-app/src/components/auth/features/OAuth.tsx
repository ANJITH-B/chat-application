import { CheckCircle2, XCircle } from 'lucide-react'
import React from 'react'

type Props = {}

const icons = {
    success: <CheckCircle2 size={36} className='text-green-500' />,
    error: <XCircle size={36} className='text-red-500' />,
}

const Register = ({ }: Props) => {
  return (
    <div className='flex flex-col gap-2'>
      {/* (!formData.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) */}

      <div className='flex items-center gap-2'>
        <p className='text-sm text-black'>Password must be at least 8 characters long</p>
        <p className='text-sm text-black'>Password must contain at least one uppercase letter</p>
        <p className='text-sm text-black'>Password must contain at least one lowercase letter</p>
        <p className='text-sm text-black'>Password must contain at least one number</p>
        <p className='text-sm text-black'>Password must contain at least one special character</p>
      </div>
      
    </div>
  )
}

export default Register