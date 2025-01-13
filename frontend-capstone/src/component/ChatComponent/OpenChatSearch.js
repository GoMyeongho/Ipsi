import styled from "styled-components";
import { ChatTitle } from "../ChatComponent/ChatMenuBar";
import searchIcon from "../../images/search.svg";
import React, { useEffect, useState } from "react";
import AxiosApi from "../../api/AxiosApi";
import { ChatUl, ChatRoom, ChatName } from "../ChatComponent/ChatList";

const OpenChatBg = styled.div`
    width: 100%;
    height: 100%;
    /* background-color: pink; */
    padding: 0 30px;
`
const CreateBtn = styled.button`
    width: 25%;
    padding: 7px;
    border-radius: 10px;
    border: 1px solid #777;
    background-color: #FFF;
`
const SearchBox = styled.div`
    width: 100%;
    border: 1px solid #777;
    border-radius: 30px;
    background-color: #FFF;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
`
const SearchInput = styled.input`
    width: calc(100% - 30px);
    padding: 10px 15px;
    outline-style: none;
    border: none;
    background: none;
`
const SearchIcon = styled.img`
    width: 15px;
    filter: grayscale(100%);
`
const CreateInputBox = styled.div`
    width: 100%;
    border-bottom: 1px solid #777;
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`
const Input = styled.input`
    width: 75%;
    padding: 10px;
    outline-style: none;
    border: none;
`;
const Max = styled.p`

`
const ModalText = styled.p`
    margin: 10px 0;
`;


const CreateTitle = styled.div`
    width: 100%;
    font-size: 1.1em;
    /* padding: 15px 0; */
    display: flex;
    align-items: center;
    justify-content: space-between;
`
export const OverlayContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const OverlayContent = styled.div`
    width: 80%;
    /* height: 50%; */
    background-color: white;
    border-radius: 30px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    padding: 40px 20px;
`;
export const BtnBox = styled.div`
    margin-top: 20px;
    display: flex;
    justify-content: space-evenly;
    button {
        width: 60px;
        height: 35px;
        border-radius: 10px;
        border: none;
    }
    .cancel { background-color: #E0CEFF; }
    .submit {
        background-color: #6154D4;
        color: #FFF;
    }
`

const OpenChatSearch = ({ setSelectedPage }) => {
    const [isOverlayOpen, setIsOverlayOpen] = useState(false); // Overlay 상태 관리
    const [chatRooms, setChatRooms] = useState([]);

    const [filteredChatRooms, setFilteredChatRooms] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태

    const [personCnt, setPersonCnt] = useState([]);
    const [chatRoomTitle, setChatRoomTitle] = useState([]);
    const email = localStorage.getItem("email");

    const [errorMessage, setErrorMessage] = useState("");

    // 서버로부터 채팅방 목록을 가져오는 API
    const fetchChatRooms = async() => {
        try {
            const response = await AxiosApi.chatList();
            console.log(response.data);
            setChatRooms(response.data);
            setFilteredChatRooms(response.data);
        } catch (e) {
            console.log(e); // 서버와의 통신 실패 예외 처리
        }
    };

    useEffect(() => {
        fetchChatRooms();
    }, []); // 처음 화면이 나타나는 시점에 서버로부터 정보를 가져옴

    // 채팅방 개설을 위한 axios 호출
    const handleCreateChatRoom = async() => {
        if (chatRoomTitle.length === 0) {
            setErrorMessage("채팅방 이름을 입력해주세요.");
            return;
        } else if (chatRoomTitle.length > 20) {
            setErrorMessage("채팅방 이름은 최대 20자입니다.");
            return;
        }
        if (personCnt === "" || isNaN(personCnt) || personCnt <= 1 || personCnt > 30) {
            setErrorMessage("참여 가능 인원은 최소 2명 최대 30명입니다.");
            return;
        }

        try {
            const response = await AxiosApi.chatCreate(chatRoomTitle, personCnt);
            console.log("Response data:", response.data); // 응답 데이터 확인
            setSelectedPage(`/chatting/${response.data}`);
        } catch (e) {
            console.log(e);
            setErrorMessage(e.response.data);
        }
        console.log("chatRoomTitle:", chatRoomTitle);
        console.log("personCnt:", personCnt);
    };

    // 채팅방 이동
    const enterChatRoom = (roomId) => {
        setSelectedPage("chatting");
    };

    const createChatRoom = () => {
        setIsOverlayOpen(true);
        setErrorMessage(""); // 초기화
    };

    const closeOverlay = () => {
        setIsOverlayOpen(false);
    };

    // 채팅방 검색 핸들링
    const handleSearch = (term) => {
        setSearchTerm(term);
        const filteredRooms = chatRooms.filter(room =>
            room.name.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredChatRooms(filteredRooms);
    };

    return (
        <OpenChatBg>
            <ChatTitle>오픈 채팅
                <CreateBtn onClick={createChatRoom}>+ 만들기</CreateBtn>
            </ChatTitle>
            <SearchBox>
                <SearchInput
                    placeholder="오픈 채팅방 검색"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                />
                <SearchIcon src={searchIcon} alt="Search"/>
            </SearchBox>
            <ChatUl>
            {filteredChatRooms.map(room => (
                    <ChatRoom key={room.roomId} onClick={() => enterChatRoom(room.roomId)}>
                        <ChatName>{room.name}</ChatName>
                    </ChatRoom>
                ))}
            </ChatUl>
            {isOverlayOpen && (
                <OverlayContainer>
                    <OverlayContent>
                        <CreateTitle>오픈 채팅방 만들기</CreateTitle>
                        <CreateInputBox>
                            <Input
                                type="text"
                                value={chatRoomTitle}
                                placeholder="채팅방 이름"
                                onChange={(e) => setChatRoomTitle(e.target.value)}
                            />
                            <Max>최대 20자</Max>
                        </CreateInputBox>
                        <CreateInputBox>
                            <Input
                                type="number"
                                value={personCnt}
                                placeholder="참여 가능 인원"
                                onChange={(e) => setPersonCnt(e.target.value)}
                            />
                            <Max>최대 30명</Max>
                        </CreateInputBox>
                        {errorMessage && <ModalText style={{ color: 'red' }}>{errorMessage}</ModalText>}
                        <BtnBox>
                            <button className="cancel" onClick={closeOverlay}>취소</button>
                            <button className="submit" onClick={handleCreateChatRoom}>확인</button>
                        </BtnBox>
                    </OverlayContent>
                </OverlayContainer>
            )}
        </OpenChatBg>
    );
};
export default OpenChatSearch;