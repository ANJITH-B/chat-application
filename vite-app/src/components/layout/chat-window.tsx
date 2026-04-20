

const ChatWindow = ({ isLoading, isSelected, children }: { isLoading?: boolean, isSelected: boolean, children: React.ReactNode }) => {

    // if(isLoading) return <p>Loading...</p>

    return (
        <div className='h-[calc(100vh-40px)] border border-[#D4D4D4] my-5 mx-3 rounded-xl'>
            {isSelected ? <>{children}</> : <WelcomeScreen />}
        </div>
    )
}


const Header = ({ children }: { children: React.ReactNode }) => {
    return <div className='w-full h-13 border-b border-[#D4D4D4] flex items-center justify-between px-4'>
        {children}
    </div>
}

const Body = ({ children }: { children: React.ReactNode }) => {
    return <div className="w-full h-[calc(100vh-150px)] overflow-y-auto p-4 flex flex-col gap-4">
        {children}
    </div>
}

const Footer = ({ children }: { children: React.ReactNode }) => {
    return <div className="w-full h-13 border-t border-[#D4D4D4] ">
        {children}
    </div>
}

const WelcomeScreen = () => {
    return (
        <div className='w-full h-full flex items-center justify-center'>
            <p className='text- text-black text-center'>Welcome to Chat Application <br /> Select a Conversations to start messaging</p>
        </div>
    )
}

ChatWindow.Header = Header;
ChatWindow.Body = Body;
ChatWindow.Footer = Footer;

export default ChatWindow;