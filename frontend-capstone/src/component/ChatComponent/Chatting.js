import React, { useEffect, useState, useRef, useContext, useCallback } from "react";
import styled from "styled-components";
import backIcon from "../../images/back.svg";
import exitIcon from "../../images/exit.svg";
import sendIcon from "../../images/send_color.png";
import { OverlayContainer, OverlayContent, BtnBox } from "../ChatComponent/OpenChatSearch";
import { useNavigate, useParams } from "react-router-dom";
import Commons from "../../util/Common";
import { ChatContext } from "../../context/ChatStore";
import ChattingApi from "../../api/ChattingApi";

const ChattingRoomBg = styled.div`
    width: 100%;
    height: 100%;
    background: #FFF;
    padding: 0 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
`
const ChattingTitle = styled.div`
    width: 100%;
    /* font-size: 18px; */
    font-size: 1.15em;
    padding: 30px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
`
const ChattingIcon = styled.img`
    width: 25px;
    filter: brightness(0);
    &:hover {
      filter: none;
    }
`
const SendButton = styled.img`
    width: 25px;
    aspect-ratio: 1 / 1;
    object-fit: contain;
    cursor: ${(props) => (props.disabled ? "default" : "pointer")};
    filter: ${(props) => (props.disabled ? "grayscale(100%)" : "none")};
`


const MessagesContainer = styled.div`
    display: flex;
    flex-direction: column;
    //height: calc(100% - 165px);
    width: 100%;
    height: calc(100% - 148px);
    overflow-y: auto;
    transition: height 0.2s ease;
    padding: 10px;
    &::-webkit-scrollbar {
        width: 10px;
    }
    &::-webkit-scrollbar-thumb {
        height: 30%;
        background: #9f8fe4;
        border-radius: 10px;
    }
    &::-webkit-scrollbar-track {
        background: #FFF;
        border-radius: 10px; 
    }
`;

const MessageBox = styled.div`
    align-self: ${(props) => (props.isSender ? "flex-end" : "flex-start")};
`

const MsgTime = styled.div`
    display: flex;
    align-items: flex-end;
    gap: 8px;
    margin: 10px 0;
    flex-direction: ${(props) => (props.isSender ? "row-reverse" : "row")};
`

const Message = styled.div`
    word-break: break-all;  // 영문 넘침 방지
    padding: 10px;
    max-width: 70%;
    border-radius: 20px;
    background-color: ${(props) => (props.isSender ? "#ECE1FF" : "#E0E0E0")};
    border: ${(props) =>
        props.isSender ? "1px solid #ECE1FF" : "1px solid #E0E0E0"};
`;

const Sender = styled.div`
    display: ${(props) => (props.isSender ? "none" : "block")};
`

const SentTime = styled.div`

`

const MsgInput = styled.textarea`
    padding: 5px 10px;
    width: 90%;
    box-sizing: border-box;
    outline-style: none;
    border: none;
    background: none;
    font-size: 1em;
    resize: none;
    max-height: 100px;
    overflow-y: auto;
    &::-webkit-scrollbar {
    width: 10px;
    }
    &::-webkit-scrollbar-thumb {
    height: 30%;
    background: #9f8fe4;
    border-radius: 10px;
    }
    &::-webkit-scrollbar-track {
    background: #FFF;
    border-radius: 10px;
    }
`;

const MsgInputBox = styled.div`
    width: 110%;
    padding: 10px;
    //margin-bottom: 2vw;
    border-radius: 10px;
    background-color: #EEE;
    display: flex;
    justify-content: space-between;
    margin: 13px 0;
`
const ExitMsg = styled.p`
    font-size: 1.1em;
    text-align: center;
`

const DateSeparator = styled.div`
    text-align: center;
    color: #888;
    font-size: 12px;
    margin: 15px 0;
    font-weight: bold;
`;
const ChattingBottom = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 10px;
`;
const ChatInput = styled.textarea`
    flex: 1;
    padding: 10px;
    resize: none;
`;

const ChatButton = styled.button`
    background-color: #007bff;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
`;

function formatLocalDateTime(localDateTime) {
    if (localDateTime) {
        // JavaScript의 Date 객체로 변환 후 KST로 변환
        const kstOffset = 9 * 60 * 60 * 1000; // 9시간을 밀리초로 변환
        const kstDate = new Date(localDateTime + kstOffset);
        return kstDate.toLocaleTimeString('ko-KR', { hour: 'numeric', minute: 'numeric', hour12: true });
    } else {
        return new Date().toLocaleString(); // 만약 null일 경우, 현재 시간 반환
    }
}

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
};

const Chatting = ({ setSelectedPage }) => {
    const [isOverlayOpen, setIsOverlayOpen] = useState(false); // Overlay 상태 관리
    const [socketConnected, setSocketConnected] = useState(false);  // 웹소켓 연결 여부
    const [inputMsg, setInputMsg] = useState("");   // 입력 메시지
    const [chatList, setChatList] = useState([]);   // 채팅 글 목록
    const {roomId} = useContext(ChatContext);   // 채팅방 번호, 새로운 방 개설, 기존 방 입장
    const [sender, setSender] = useState("");   // 보낸사람
    const [roomName, setRoomName] = useState("");   // 채팅방 이름
    const [nickName, setNickName] = useState("");
    const [profile, setProfile] = useState("");
    const [regDate, setRegDate] = useState("")
    const ws = useRef(null);    // 웹소켓 객체 생성, 소켓 연결 정보를 유지해야하지만 렌더링과는 무관

    useEffect(() => {
        // 채팅방 정보 가져 오기
        const getChatRoom = async () => {
            try {
                const rsp = await ChattingApi.chatDetail(roomId);

                if (rsp && rsp.name) {
                    if (rsp.name) {
                        console.log("채팅방 이름 가져오기 : ", rsp.name, "채팅 룸 아이디 : ", rsp.roomId);
                        setRoomName(rsp.name);
                    } else {
                        console.warn("Invalid data format: ", rsp.data);
                        alert("채팅방 정보를 불러올 수 없습니다. 이전 페이지로 이동합니다.");
                    }
                } else {
                    console.log("Chatting Line 162", rsp);
                    alert("채팅방 정보를 불러올 수 없습니다. 다시 시도해주세요.");
                }
            } catch (error) {
                console.error("Error fetching chat details:", error);
                alert("채팅방 정보를 불러오지 못했습니다.");
            }
        }
        if (roomId) {
            console.log("roomId : ", roomId);
            getChatRoom();
        } else {
            console.warn("Invalid roomId : ", roomId);
        }
    }, [roomId]);

    const onChangeMsg = e => {
        setInputMsg(e.target.value);
    };

    const onEnterKey = (e) => {
        // 엔터키 입력 시, 공백 제거 후 비어있지 않으면
        if (e.key === "Enter" && inputMsg.trim() !== "") {
            e.preventDefault(); // 기존 이벤트 무시
            onClickMsgSend(e);
        }
    };

    // 뒤로 가기(채팅 목록으로)
    const onClickExit = () => {
        setSelectedPage("chatList");   // 채팅 목록으로 이동 
    };

    // 채팅 종료
    const onClickMsgClose = () => {
        // 메시지 전송
        ws.current.send(
            JSON.stringify({
              type: "CLOSE",
              roomId: roomId,
              sender: sender,
              message: inputMsg,  
            })
        );
        ws.current.close();
        setSelectedPage("chatList");   // 채팅 목록으로 이동 
    };

    useEffect(() => {
        // 웹소켓 연결하는 부분, 이전 대화내용 불러오는 함수 호출
        if (!ws.current) {
            ws.current = new WebSocket(Commons.Capstone_URL);
            ws.current.onopen = () => {
                setSocketConnected(true);

                // 채팅방 입장하기 전에 sender에 nickName을 설정
                if (sender === "") {  // sender가 비어있을 경우에만 nickName을 가져와서 설정
                    const fetchNickName = async () => {
                        const token = localStorage.getItem("accessToken");  // 로컬 스토리지에서 가져오기
                        if (!token) {
                            console.error("토큰이 없습니다.");
                            return;
                        }
                        try {
                            const response = await ChattingApi.getNickName();   // 토큰에서 닉네임 가져오기
                            const nickName = await response.data;
                            setSender(nickName); // sender에 닉네임 저장 후 웹소켓으로 보내기 전에 준비
                        } catch (error) {
                            console.error("Error fetching nickName: ", error);
                        }
                    };
                    fetchNickName();
                }
            };
        }
        if (socketConnected) {
            // 웹소켓 연결이 되어있다면,
            ws.current.send(
                JSON.stringify({
                    type: "ENTER",
                    roomId: roomId,
                    sender: sender,
                    profile: profile,
                    nickName: nickName,
                    msg: "첫 입장",
                })
            );
            loadPreviousChat();
        }
        ws.current.onmessage = msg => {
            const data = JSON.parse(msg.data);
            if (!data.regDate) {
                data.regDate = new Date().toLocaleString();  // 메시지가 전송된 현재 시간으로 대체
            }
            setChatList(prev => Array.isArray(prev) ? [...prev, data] : [data]);
        };
    }, [socketConnected, sender, ws.current, roomId]);

    // 이전 채팅 내용을 가져오는 함수
    const loadPreviousChat = async () => {
        try {
            const res = await ChattingApi.chatHistory(roomId);
            console.log("이전채팅내용 : ", res.data);

            // regDate만 추출
            const regDates = res.data.map(chat => chat.regDate);
            console.log("이전 채팅 전송 시간들 : ", regDates);
            const recentMessages = res.data;
            setChatList(recentMessages);
        } catch (error) {
            alert("error : 이전 대화내용을 불러오지 못했습니다.");
        }
    };
    
    // UTC -> KST 변환
    const getKSTDate = () => {
        const date = new Date();
        // UTC 시간에 9시간 추가
        const offset = 9 * 60 * 60 * 1000; // 9시간을 밀리초로 변환
        return new Date(date.getTime() + offset);
    };
    
    // 메시지 전송
    const onClickMsgSend = () => {
        //웹소켓 연결되어 있을 때 정보 보내기
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            if (inputMsg.trim() !== "") {
                ws.current.send(
                    JSON.stringify({
                        type: "TALK",
                        roomId: roomId,
                        sender: sender,
                        msg: inputMsg,
                        profile: profile,
                        nickName: nickName,
                        regDate: getKSTDate(),
                    })
                );
                setInputMsg("");
                ws.current.onmessage = msg => {
                    const data = JSON.parse(msg.data);
                    if (!data.regDate) {
                        data.regDate = getKSTDate();  // 메시지가 전송된 현재 시간으로 대체
                    }
                    setChatList(prev => Array.isArray(prev) ? [...prev, data] : [data]);
                };
            } else {
                // 빈 값일 경우 아무 동작 없이 종료
                console.log("메시지가 비어있습니다.");
            }
        } else {
        alert("채팅 연결에 실패.");
        }
    };

    const textRef = useRef();
    const handleResizeHeight = useCallback(() => {
        textRef.current.style.height = "auto";
        textRef.current.style.height = textRef.current.scrollHeight + "px";
    }, []);

    // 화면 하단으로 자동 스크롤
    const ChatContainerRef = useRef(null);  // DOM 요소 추적
    useEffect(() => {
        if (ChatContainerRef.current) {
            ChatContainerRef.current.scrollTop = ChatContainerRef.current.scrollHeight;
        }
    }, [chatList]);

    const ExitChatRoom = () => {
        setIsOverlayOpen(true);
    };

    const closeOverlay = () => {
        setIsOverlayOpen(false);
    };
    return (
        <ChattingRoomBg>
            <ChattingTitle>
                <ChattingIcon src={backIcon} alt="Back" onClick={onClickExit} />
                {roomName}
                <ChattingIcon src={exitIcon} alt="Exit" onClick={ExitChatRoom} />
            </ChattingTitle>
            <MessagesContainer ref={ChatContainerRef}>
                {chatList?.map((chat, index) => {
                    const currentDate = new Date(chat.regDate).toISOString().split("T")[0]; // YYYY-MM-DD 형식
                    const prevDate = index > 0 ? new Date(chatList[index - 1].regDate).toISOString().split("T")[0] : null;
                    const showDate = currentDate !== prevDate; // 이전 메시지와 날짜가 다르면 표시

                    return (
                        <React.Fragment key={index}>
                            {showDate && <DateSeparator>{formatDate(chat.regDate)}</DateSeparator>}
                            <MessageBox isSender={chat.sender === sender}>
                                <Sender isSender={chat.sender === sender}>
                                    {chat.sender}
                                </Sender>
                                <MsgTime isSender={chat.sender === sender}>
                                    <Message isSender={chat.sender === sender}>
                                        {chat.msg}
                                    </Message>
                                    <SentTime>
                                        {chat.regDate ? formatLocalDateTime(chat.regDate) : new Date().toLocaleString()}
                                    </SentTime>
                                </MsgTime>
                            </MessageBox>
                        </React.Fragment>
                    );
                })}
            </MessagesContainer>
            <MsgInputBox>
                <MsgInput
                    type="text"
                    ref={textRef}
                    placeholder="문자 전송"
                    value={inputMsg}
                    onInput={handleResizeHeight}
                    onChange={onChangeMsg}
                    onKeyUp={onEnterKey}
                />
                <SendButton
                    src={sendIcon} alt="Send"
                    onClick={onClickMsgSend}
                    disabled={!inputMsg.trim()}
                />
            </MsgInputBox>
            {isOverlayOpen && (
                <OverlayContainer>
                    <OverlayContent>
                        <ExitMsg>정말 채팅방을 나가시겠습니까?</ExitMsg>
                        <BtnBox>
                            <button className="cancel" onClick={closeOverlay}>취소</button>
                            <button className="submit" onClick={onClickMsgClose}>확인</button>
                        </BtnBox>
                    </OverlayContent>
                </OverlayContainer>
            )}
        </ChattingRoomBg>
    );
};

export default Chatting;