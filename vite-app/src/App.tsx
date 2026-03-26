import './App.css'
import ChatList from './components/InboxPannel'
import ChatWindow from './components/ui/chat-window'
import Navigator from './layout/Navigator'
function App() {

  return (
    <>
      <div className='flex bg-[#F0EFEB] container mx-auto'>
        <Navigator />
        <ChatList />
        <ChatWindow />
      </div>
    </>
  )
}

export default App
