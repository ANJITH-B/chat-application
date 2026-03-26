import InboxPannel from "./ui/inbox-pannel"
import { Profile } from "./ui/profile"


const ChatList = () => {

  return (
    <InboxPannel >
      <InboxPannel.SearchBar />
      <InboxPannel.Section title='Rooms' createRoom={() => { }}>
        {['XR Prototyping', 'Peer Seed UX', 'Chat updates Dev'].map((room, index) => (
          <p key={index} className='text-xs text-black'># {room}</p>
        ))}
      </InboxPannel.Section>
      <InboxPannel.Section title="Groups" showMore={true}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Profile key={index} image="/logo.svg" name="Dev Updates" description="Production release" />
        ))}
      </InboxPannel.Section>
    </InboxPannel>
  )
}

export default ChatList