import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';

type Props = {
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
}

const icons = {
    success: <CheckCircle2 size={36} className='text-green-500' />,
    error: <XCircle size={36} className='text-red-500' />,
    warning: <AlertCircle size={36} className='text-yellow-500' />,
    info: <Info size={36} className='text-blue-500' />
}


const toast = ({message, type}: Props) => {
  return (
    <div className='absolute bottom-10 right-10'>
        <div className="flex items-center gap-3">
            {icons[type]}
            <p className="text-black text-sm leading-relaxed font-medium">{message}</p>
        </div>
    </div>
  )
}

export default toast