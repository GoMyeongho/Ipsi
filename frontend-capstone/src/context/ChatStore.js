import { createContext, useState } from "react";
import { Outlet } from "react-router-dom";

export const ChatContext = createContext(null);

const ChatStore = ({children}) => {
    const [selectedPage, setSelectedPage] = useState("chatList");
    const [roomId, setRoomId] = useState(null);
    return (
        <ChatContext.Provider value={{selectedPage, setSelectedPage, roomId, setRoomId}}>
            {children}
        </ChatContext.Provider>
    );
}
export default ChatStore;