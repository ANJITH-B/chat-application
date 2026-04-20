import { Routes, Route } from 'react-router-dom'
import ChatList from './components/InboxPannel'
import Navigator from './layout/Navigator'
import Auth from './components/auth/page'
import { useAuthStore } from './store/useAuthStore'
import { useEffect } from 'react'
import Profile from './components/Profile'
import Toast from './components/ui/toast'
import CallPannel from './components/CallPannel'
import { useLayoutStore } from './store/useLayoutStore'
import { AnimatePresence, motion } from 'framer-motion'
import { ChatSection } from './components/ChatWindow'
import { CreateGroup } from './components/CreateGroup'


function App() {
  const { user, isAuthChecking, checkAuthStatus, onlineUsers } = useAuthStore()
  const { isProfileOpen, isCallPannelOpen, isGroupCreationPopupOpen } = useLayoutStore()

  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  console.log("online users", onlineUsers);

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

  if (!user) return (
    <>
      <Auth />
      <Toast />
    </>
  )


  return (
    <div className='flex h-screen w-full'>
      <Navigator />
      <div className='flex h-screen w-[calc(100%-26px)]'>
        <motion.aside className='w-1/4'>
          <ChatList />
        </motion.aside>
        <AnimatePresence>
          <motion.main animate={{ width: isProfileOpen || isCallPannelOpen ? '50%' : '73%' }} >
            <ChatSection />
          </motion.main>
          {isProfileOpen && (
            <motion.div
              className='w-1/4'
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}>
              {isProfileOpen && <Profile />}
              {isCallPannelOpen && <CallPannel />}
            </motion.div>
          )}
        </AnimatePresence>
        <Routes>
          {!user && <Route path='/auth' element={<Auth />} />}
        </Routes>
      </div>
      <Toast />
      {isGroupCreationPopupOpen && <CreateGroup />}
    </div>
  )
}

export default App

