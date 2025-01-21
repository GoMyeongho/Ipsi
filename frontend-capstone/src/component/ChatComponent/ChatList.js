import styled from "styled-components";
import { ChatTitle } from "../ChatComponent/ChatMenuBar";
import React, { useContext, useEffect, useState } from "react";
import Commons from "../../util/Common";
import { ChatContext } from "../../context/ChatStore";
import ChattingApi from "../../api/ChattingApi";
import axiosApi from "../../api/AxiosApi";
import axios from "axios";

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
    const [loggedInUser, setLoggedInUser] = useState(null);

    // 서버로부터 채팅방 목록을 가져오는 API
    const fetchChatRooms = async() => {
        try {
            const response = await ChattingApi.chatList();
            console.log(response.data);
            setChatRooms(response.data);
        } catch (e) {
            console.log(e); // 서버와의 통신 실패 예외 처리
        }
    };

    const checkLoginAndFilterRooms = async () => {
        try {
            const isLoginResponse = await Commons.IsLogin();
            console.log("isLoginResponse data : {}", isLoginResponse.data);
            if (isLoginResponse.data && isLoginResponse.data.userID) {
                setLoggedInUser(isLoginResponse.data.userID); // 현재 로그인한 사용자 아이디 저장
            } else {
                setLoggedInUser(null);
            }

            // 로그인한 사용자가 들어간 채팅방만 필터링
            if (loggedInUser) {
                const filteredRooms = chatRooms.filter(room => room.participants.some(p => p.userId === loggedInUser));
                setChatRooms(filteredRooms);
            }
        } catch (e) {
            console.log("IsLogin failed:", e);
        }
    };

    // 처음 화면이 나타나는 시점에 서버로부터 정보를 가져옴
    useEffect(() => {
        fetchChatRooms();
    }, []);

    // 채팅방이 변경될 때마다 로그인 상태와 필터링 적용
    useEffect(() => {
        checkLoginAndFilterRooms();
    }, [chatRooms]);

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