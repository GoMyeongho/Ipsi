import styled from "styled-components";
import React, { useContext, useEffect, useState } from "react";
import AxiosApi from "../../api/AxiosApi";
import { Link } from "react-router-dom";
import { useNavigate, Outlet } from "react-router-dom";
import openIcon from "../../images/chat.png";
import closeIcon from "../../images/close.png";
import ChatMenuBar from "../../component/ChatComponent/ChatMenuBar";
import ChatList from "../../component/ChatComponent/ChatList";
import OpenChatSearch from "../../component/ChatComponent/OpenChatSearch";
import ChatBot from "../../component/ChatComponent/ChatBot";
import Chatting from "../../component/ChatComponent/Chatting";
import ChatRoomCreate from "../../component/ChatComponent/ChatRoomCreate";
import ChatStore, { ChatContext } from "../../context/ChatStore";

const defaultBackgroundColor = "#9aa06";
const sideMenuBackgroundColor = "#eee";
// const topbarHeight = "54px";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    width: 100%;
    margin: auto;
    position: relative;
    background-color: ${props => props.color || defaultBackgroundColor};
    .footer {
        text-align: center;
    }
`;
const ChatIconBox = styled.div`
    position: fixed;
    cursor: pointer;
    z-index: 990;
    bottom: 30px;
    right: 30px;
`
const ChatIcon = styled.img`
    width: 65px;
`
const SelectPage = styled.div`
    width: 100%;
    height: calc(100% - 50px);
    flex: 1;
    overflow-y: auto;
`
export const UserContainer = styled.div`
    display: flex;
    margin: 40px 20px;
`;
export const UserAndName = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: start;
    margin: 2px 10px;
    line-height: 1.5;
`;
export const StyledSideMenu = styled.div`
    position: fixed;
    right: 30px;
    bottom: 50px;
    width: 400px;
    //height: 700px;
    aspect-ratio: 4 / 7;
    background-color: #FFF;
    border-radius: 30px;
    box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.5);
    z-index: ${props => props.isOpen ? "-1000" : "1000"};
    transform: ${props => props.isOpen ? "translateY(0)" : "translateY(-10%)"};
    opacity: ${props => props.isOpen ? "0" : "1"};
    transition: 0.5s ease;
    overflow: hidden;
`;
export const StyledMenuItem = styled.li`
    padding: 10px 20px;
    border-bottom: 1px solid #CCC;
    display: flex;
    align-items: center;
`;
export const MenuIcon = styled.span`
    margin-right: 10px;
`;
export const StyledLink = styled(Link)`
    text-decoration: none;
    color: inherit;
    &:hover {
        color: #3498db;
    }
`;

const ChatModal = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(true);    // Side Bar 메뉴 열고 닫기
    const {selectedPage, setSelectedPage, roomId} = useContext(ChatContext);

    const toggleMenu = () => {
        if (isMenuOpen) {
            setTimeout(() => {
                setSelectedPage("chatList");
            }, 100);
        }
        setIsMenuOpen(!isMenuOpen);
    };

    const renderSelectedPage = () => {
        switch (selectedPage) {
            case "chatList":
                return <ChatList setSelectedPage={setSelectedPage}/>;
            case "openChatSearch":
                return <OpenChatSearch setSelectedPage={setSelectedPage}/>;
            case "chatBot":
                return <ChatBot/>;
            case "chatting":
                return <Chatting setSelectedPage={setSelectedPage} roomId={roomId}/>;
            case "chatRoomCreate":
                return <ChatRoomCreate setSelectedPage={setSelectedPage}/>;
            default:
                return null;
        }
    };

    return (
        <Container>
            <ChatIconBox onClick={toggleMenu}>
                {isMenuOpen ? (
                    <ChatIcon src={openIcon} alt="Open"/>
                    ) : (
                    <ChatIcon src={closeIcon} alt="Close"/>
                    )}
            </ChatIconBox>
            <StyledSideMenu isOpen={isMenuOpen}>
                <SelectPage>{renderSelectedPage()}</SelectPage>
                <ChatMenuBar setSelectedPage={setSelectedPage} selectedPage={selectedPage}/>
            </StyledSideMenu>
            {/* <Dummy /> */}
            <main className="body">
                <Outlet />
            </main>
        </Container>
    );
};
export default ChatModal;