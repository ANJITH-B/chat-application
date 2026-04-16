import { Routes, Route } from 'react-router-dom'
import ChatList from './components/InboxPannel'
import ChatWindow from './components/ui/chat-window'
import Navigator from './layout/Navigator'
import Auth from './components/auth/page'
import { useAuthStore } from './store/useAuthStore' 
import { useEffect } from 'react'


function App() {
  const { user , isAuthChecking, checkAuthStatus } = useAuthStore()

  useEffect(()=>{
    checkAuthStatus()
  },[checkAuthStatus])

  if (isAuthChecking) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#0f172a] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium animate-pulse">Checking session...</p>
        </div>
      </div>
    )
  }

  if (!user) return <Auth />


  return (
    <>
      <div className='flex bg-[#F0EFEB] container mx-auto'>
        <Navigator />
        <ChatList />
        <Routes>
          <Route path="/chat/:id" element={<ChatWindow />} />
          {!user && <Route path='/auth' element={<Auth/>} />}
        </Routes>
      </div>
    </>
  )
}

export default App

