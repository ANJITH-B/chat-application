import { CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react'
import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { cn } from '../../lib/utils'

type Props = {
    children?: ReactNode
    message?: string | string[]
    type?: 'success' | 'error' | 'warning' | 'info'
    className?: string
}

const icons = {
    success: <CheckCircle2 size={26} className='text-green-500' />,
    error: <XCircle size={26} className='text-red-500' />,
    warning: <AlertCircle size={26} className='text-yellow-500' />,
    info: <Info size={26} className='text-blue-500' />
}

const labelVariants = tv({
    base: 'space-y-3 border pt-1 pb-4 px-5',
    variants: {
        type: {
            success: 'bg-green-500/20  border-green-500/40',
            error: 'bg-red-500/20 border-red-500/40',
            warning: 'bg-yellow-500/20 border-yellow-500/40',
            info: 'bg-blue-500/20 border-blue-500/40'
        }
    },
    defaultVariants: {
        type: 'info'
    }
})

const ItemsVariants = tv({
    base: 'flex items-center gap-3',
    variants: {
        type: {
            success: 'text-green-500',
            error: 'text-red-500',
        }
    },
    defaultVariants: {
        type: 'success'
    }
})

const Label = ({ message, children, type, className }: Props) => {
    return (
        <div className={cn(labelVariants({ type }), className)}>
            <div className="flex items-center gap-3">
                {type && message && <div className="shrink-0">{icons[type]}</div>}
                <div className="flex flex-col gap-1">
                    {message && <p className="text-black text-sm leading-relaxed font-medium">{message}</p>}
                </div>
            </div>
            {children}
        </div>
    )
}

const Items = ({ message, type, className }: Props) => {
    return (
        <div className={cn('flex items-center gap-2', className)}>
            {type && <div className="shrink-0">{icons[type]}</div>}
            <p className="text-black text-sm leading-relaxed font-medium">{message}</p>
        </div>
    )
}

Label.Items = Items
export default Label    