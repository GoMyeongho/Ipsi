import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AxiosApi from "../../api/AxiosApi";
import styled from "styled-components";
import { ChatTitle } from "../ChatComponent/ChatMenuBar";

const CreateChatRoomBg = styled.div`
    width: 100%;
    height: 100%;
    background-color: pink;
    padding: 0 30px;
`

const Input = styled.input`
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 300px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px; // 버튼 사이의 간격
`;

const Button = styled.button`
  padding: 10px 20px;
  margin: 5px;
  border: none;
  border-radius: 4px;
  background-color: #4caf50;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

const ChatRoomCreate = ({ setSelectedPage }) => {
    const [chatRoomTitle, setChatRoomTitle] = useState([]);
    const navigate = useNavigate();
    const email = localStorage.getItem("email");

    // 채팅방 개설을 위한 axios 호출
    const handleCreateChatRoom = async() => {
        try {
            const response = await AxiosApi.chatCreate(email, chatRoomTitle);
            console.log(response.data);
            navigate(`/chatting/${response.data}`);
        } catch (e) {
            console.log(e);
        }
    };
    const handleCancel = () => {
      setSelectedPage("openChatSearch");
    }
    return (
        <CreateChatRoomBg>
            <ChatTitle>오픈 채팅방 만들기</ChatTitle>
            <Input
                type="text"
                value={chatRoomTitle}
                onChange={(e) => setChatRoomTitle(e.target.value)}
            />
            <ButtonContainer>
                <Button onClick={handleCreateChatRoom}>확인</Button>
                <Button onClick={handleCancel}>취소</Button>
            </ButtonContainer>
        </CreateChatRoomBg>
    );
};
export default ChatRoomCreate;