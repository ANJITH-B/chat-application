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

  const safeUsers = Array.isArray(users) ? users.filter(Boolean) : [];
  const safeGroups = Array.isArray(groups) ? groups.filter(Boolean) : [];
  const search = (searchTerm ?? '').toLowerCase();

  const filteredUsers = safeUsers.filter((user: any) => String(user?.username ?? '').toLowerCase().includes(search));
  const filteredGroups = safeGroups.filter((group: any) => String(group?.name ?? '').toLowerCase().includes(search));

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
        <InboxPannel.Section title={isGroupCreationOpen ? "Select Members" : "Personal Chats"} button={{ onClick: () => { }, label: 'show more' }}>
          {filteredUsers.map((user: any) => (
            <Profile
              toggle={isGroupCreationOpen}
              isSelected={isGroupCreationOpen ? selectedMembers.includes(user._id) : !!(selectedChat && selectedChat._id === user._id && !('isGroup' in selectedChat && selectedChat.isGroup))}
              isOnline={onlineUsers.includes(user._id)}
              onClick={() => { isGroupCreationOpen ? toggleMember(user._id) : setSelectedChat(user) }}
              key={user._id}
              image={user?.profilePic || "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"}
              name={user?.username ?? 'Unknown user'}
              description={user?.lastMessage || "No messages yet"}
              unreadMessages={user?.unreadCount}
            />
          ))}
        </InboxPannel.Section>
      )}
      {(safeGroups.length === 0 || filteredGroups.length > 0) && !isGroupCreationOpen && (
        <InboxPannel.Section title="Groups" button={{ onClick: () => setIsGroupCreationOpen(true), label: 'create group' }} >
          {safeGroups.length > 0 ?
            <>
              {filteredGroups.map((group: any) => (
                <Profile
                  isSelected={!!(selectedChat && selectedChat._id === group._id && 'isGroup' in selectedChat && selectedChat.isGroup)}
                  onClick={() => setSelectedChat(group)}
                  key={group._id}
                  image={group?.image || '/logo.svg'}
                  name={group?.name ?? 'Untitled group'}
                  description={group?.lastMessage || "No messages yet"}
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








