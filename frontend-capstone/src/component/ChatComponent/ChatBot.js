import styled from "styled-components";
import { ChatTitle } from "./ChatMenuBar";

const ChatBotBg = styled.div`
    width: 100%;
    height: 100%;
    //background-color: skyblue;
    padding: 0 30px;
`

const ChatBot = () => {
    return (
        <ChatBotBg>
            <ChatTitle>AI 챗봇</ChatTitle>
        </ChatBotBg>
    );
};
export default ChatBot;