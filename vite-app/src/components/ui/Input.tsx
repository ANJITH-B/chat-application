import { useState } from "react"
import { Mail, Lock, User, LogIn as LoginIcon, UserPlus, Ghost, Eye, EyeOff } from 'lucide-react'


const icons = {
  email: <Mail size={18} />,
  password: <Lock size={18} />,
  text: <User size={18} />,
  LoginIcon: <LoginIcon size={18} />,
  UserPlus: <UserPlus size={18} />,
  Ghost: <Ghost size={18} />,
  Eye: <Eye size={18} />,
  EyeOff: <EyeOff size={18} />,
};



export const Input = ({ type, placeholder, value, onChange }: { type: string, placeholder: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className='flex flex-col gap-2 my-2'>
            <div className="relative group">
                {/* {icons[icons]} */}
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                    type={type== 'password' ? showPassword ? 'text' : 'password' : type} placeholder={placeholder} value={value} onChange={onChange}
                    className="w-full bg-black/5 border border-black/10 py-3 pl-12 pr-4 text-black placeholder:text-slate-600 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                // value={formData.fullName}
                // onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />

                {type === 'password' && 
                <button type='button' onClick={() => setShowPassword(!showPassword)}><Eye size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors z-20" /></button>}
            </div>
        </div>
    )
}