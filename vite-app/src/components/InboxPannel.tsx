import InboxPannel from "./layout/inbox-pannel"
import { Profile } from "./ui/profile"
import { useChatStore } from "../store/useChatStore"
import { useAuthStore } from "../store/useAuthStore"
import { useEffect, useState } from "react"
import Button from "./ui/button"
import { useLayoutStore } from "../store/useLayoutStore"
import { SearchBar } from "./ui/search"
import { Welcome } from "./Welcome"


const ChatList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { users, getUsers, groups, getGroups, selectedChat, setSelectedChat, isUserLoading, isGroupLoading, selectedMembers, toggleMember } = useChatStore()
  const { setIsGroupCreationOpen, isGroupCreationOpen, setIsGroupCreationPopupOpen } = useLayoutStore()
  const { onlineUsers } = useAuthStore()

  useEffect(() => {
    getUsers()
    getGroups()
  }, [getUsers, getGroups])

  const filteredUsers = users.filter((user: any) => user.username.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredGroups = groups.filter((group: any) => group.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (isUserLoading || isGroupLoading) return <p>Loading...</p>

  return (
    <InboxPannel>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      {searchTerm.length === 0 && !isGroupCreationOpen && (
        <InboxPannel.Section title='Rooms' button={{ onClick: () => { }, label: 'create room' }}>
          {['XR Prototyping', 'Peer Seed UX', 'Chat updates Dev'].map((room, index) => (
            <p key={index} className='text-xs text-black'># {room}</p>
          ))}
        </InboxPannel.Section>
      )}
      {filteredUsers.length > 0 && (
        <InboxPannel.Section title={ isGroupCreationOpen ? "Select Members" : "Personal Chats"} button={{ onClick: () => { }, label: 'show more' }}>
          {filteredUsers.map((user: any) => (
            <Profile
              toggle={isGroupCreationOpen}
              isSelected={isGroupCreationOpen ? selectedMembers.includes(user._id) : !!(selectedChat && selectedChat._id === user._id && !('isGroup' in selectedChat && selectedChat.isGroup))}
              isOnline={onlineUsers.includes(user._id)}
              onClick={() => { isGroupCreationOpen ? toggleMember(user._id) : setSelectedChat(user) }}
              key={user._id}
              image={user.profilePic}
              name={user.username}
              description={user.lastMessage || "No messages yet"}
              unreadMessages={user.unreadCount}
            />
          ))}
        </InboxPannel.Section>
      )}
      {(groups.length === 0 || filteredGroups.length > 0) && !isGroupCreationOpen && (
        <InboxPannel.Section title="Groups" button={{ onClick: () => setIsGroupCreationOpen(true), label: 'create group' }} >
          {groups.length > 0 ?
            <>
              {filteredGroups.map((group: any) => (
                <Profile
                  isSelected={!!(selectedChat && selectedChat._id === group._id && 'isGroup' in selectedChat && selectedChat.isGroup)}
                  onClick={() => setSelectedChat(group)}
                  key={group._id}
                  image={group.image || '/logo.svg'}
                  name={group.name}
                  description={group.lastMessage || "No messages yet"}
                />
              ))}
            </> : <Welcome message="You are not in any groups yet" button={{ onClick: () => setIsGroupCreationOpen(true), label: 'create group' }} />}
        </InboxPannel.Section>
      )}
      {isGroupCreationOpen && (
        <div className="flex flex-row gap-2 items-center pt-4 w-full">
          <Button variant="secondary" onClick={() => setIsGroupCreationOpen(false)}>Cancel</Button>
          <Button disabled={selectedMembers.length === 0} variant="primary" onClick={() => setIsGroupCreationPopupOpen(true)}>Create</Button>
        </div>
      )}
    </InboxPannel>
  )
}

export default ChatList








