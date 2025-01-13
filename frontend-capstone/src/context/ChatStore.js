import { createContext, useState } from "react";
import { Outlet } from "react-router-dom";

export const ChatContext = createContext(null);

const ChatStore = () => {
    const [selectedPage, setSelectedPage] = useState("chatList");
    const [roomId, setRoomId] = useState(null);
    return (
        <ChatContext.Provider value={{selectedPage, setSelectedPage, roomId, setRoomId}}>
            <Outlet/>
        </ChatContext.Provider>
    );
}
export default ChatStore;