import styled from "styled-components";
import chattingIcon from "../../images/chatting.svg";
import searchIcon from "../../images/search.svg";
import chatbotIcon from "../../images/chatbot.svg";

export const ChatTitle = styled.h2`
    width: 100%;
    padding: 30px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
`
const ChatNavBar = styled.div`
    position: absolute;
    width: 100%;
    height: 50px;
    bottom: 0;
    //background-color: #FAFAFA;
    background-color: rgba(224, 206, 255, 0.5);
    display: flex;
    align-items: center;
    justify-content: space-evenly;
`
const IconSvg = styled.img`
    width: 25px;
    filter: ${({ isSelected }) => (isSelected ? "none" : "grayscale(100%)")};
    opacity: ${({ isSelected }) => (isSelected ? "1" : "0.7")};
    cursor: pointer;
    &:hover {
      filter: none;
      opacity: 1;
    }
`

const ChatMenuBar = ({setSelectedPage, selectedPage}) => {
    return(
        <ChatNavBar>
            <IconSvg src={chattingIcon} alt="Chatting"
            isSelected={selectedPage === "chatList" || selectedPage === "chatting"}
            onClick={() => setSelectedPage("chatList")}/>
            <IconSvg src={searchIcon} alt="Search"
            isSelected={selectedPage === "openChatSearch" || selectedPage === "chatRoomCreate"}
            onClick={() => setSelectedPage("openChatSearch")}/>
            <IconSvg src={chatbotIcon} alt="Chatbot"
            isSelected={selectedPage === "chatBot"}
            onClick={() => setSelectedPage("chatBot")}/>
        </ChatNavBar>
    );
};
export default ChatMenuBar;