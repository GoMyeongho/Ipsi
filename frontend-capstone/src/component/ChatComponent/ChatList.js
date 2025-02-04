import styled from "styled-components";
import { ChatTitle } from "./ChatMenuBar";
import React, { useContext, useEffect, useState } from "react";
import Commons from "../../util/Common";
import { ChatContext } from "../../context/ChatStore";
import ChattingApi from "../../api/ChattingApi";
import axiosApi from "../../api/AxiosApi";

const ChatListBg = styled.div`
    width: 100%;
    height: 100%;
    //background-color: palegoldenrod;
    background: #FFF;
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

const ChatList = ({ setSelectedPage }) => {
    const [chatRooms, setChatRooms] = useState([]);
    const {setRoomId} = useContext(ChatContext);
    const [loggedInUser, setLoggedInUser] = useState(null);

    // 토큰에서 memberId를 가져오는 로직
    const fetchMemberIdFromToken = async () => {
        try {
            const response = await Commons.getTokenByMemberId();
            const memberId = response.data; // 서버에서 반환한 memberId
            console.log("로그인 한 memberId:", memberId);
            setLoggedInUser(memberId);
            fetchChatRoomsForUser(memberId); // memberId로 채팅방 리스트 가져오기
        } catch (e) {
            console.error("Failed to fetch memberId from token:", e);
        }
    };

    // memberId와 관련된 채팅방 목록 가져오기
    const fetchChatRoomsForUser = async (memberId) => {
        try {
            const rooms = await ChattingApi.getMyChatRoom(memberId);
            console.log("Fetched Chat Rooms for Member:", rooms);
            setChatRooms(rooms);
        } catch (error) {
            console.error("Error Fetching Chat Rooms for Member:", error);
        }
    };

    // 처음 화면이 나타나는 시점에 서버로부터 정보를 가져옴
    useEffect(() => {
        fetchMemberIdFromToken();
    }, []);

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