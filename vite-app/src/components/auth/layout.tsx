interface PopupProps {
    children: React.ReactNode,
    tab: 'LogIn' | 'SignUp' | 'OTP' | 'ResetPassword',
    className?: string
}

export const Popup = ({ children, tab, className }: PopupProps) => {
    return (
        <div className={`w-[450px] absolute top-1/2 left-1/2 border border-gray-200 -translate-x-1/2 -translate-y-1/2 bg-white ${className}`}>
            
            <h1 className="text-lg text-center py-5 text-black mb-2">
                {tab === 'LogIn' ? 'Welcome Back' : 'Create Account'}
            </h1>
            {children}
        </div>

    )
}
            
interface SectionProps {
    children: React.ReactNode,
    className?: string
}
const Section = ({ children, className }: SectionProps) => {
    return (
        <div className={`border-t border-gray-200 py-3 px-5 gap ${className}`}>{children}</div>
    )
}


Popup.Section = Section
