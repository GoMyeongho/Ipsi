import styled from "styled-components";
import { ChatTitle } from "../ChatComponent/ChatMenuBar";
import React, { useContext, useEffect, useState } from "react";
import AxiosApi from "../../api/AxiosApi";
import Commons from "../../util/Common";
import { ChatContext } from "../../context/ChatStore";

const ChatListBg = styled.div`
    width: 100%;
    height: 100%;
    background-color: palegoldenrod;
    padding: 0 30px;
`
export const ChatUl = styled.ul`
  list-style-type: none;
  padding: 0;
`;
export const ChatRoom = styled.li`
  background-color: #fff;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  padding: 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #e9e9e9;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }
`;
export const ChatName = styled.p`
  font-size: 1em;
  margin: 0 0 10px 0;
  color: #444;
`;
/* const ChatDate = styled.p`
  font-size: 1em;
  color: #666;
  margin: 0;
  text-align: right;
`; */

const ChatList = ({ setSelectedPage }) => {
    const [chatRooms, setChatRooms] = useState([]);
    const {setRoomId} = useContext(ChatContext);

    // 서버로부터 채팅방 목록을 가져오는 API
    const fetchChatRooms = async() => {
        try {
            const response = await AxiosApi.chatList();
            console.log(response.data);
            setChatRooms(response.data);
        } catch (e) {
            console.log(e); // 서버와의 통신 실패 예외 처리
        }
    };

    useEffect(() => {
        fetchChatRooms();
    }, []); // 처음 화면이 나타나는 시점에 서버로부터 정보를 가져옴

    // 채팅방 이동
    const enterChatRoom = (roomId) => {
      console.log("Room ID:", roomId);
      setRoomId(roomId);
      setSelectedPage("chatting");
    };

    return (
        <ChatListBg>
            <ChatTitle>채팅</ChatTitle>
            <ChatUl>
                {chatRooms.map((room) => (
                    <ChatRoom key={room.roomId} onClick={() => enterChatRoom(room.roomId)}>
                        <ChatName>{room.name}</ChatName>
                    </ChatRoom>
                ))}
            </ChatUl>
        </ChatListBg>
    );
};
export default ChatList;