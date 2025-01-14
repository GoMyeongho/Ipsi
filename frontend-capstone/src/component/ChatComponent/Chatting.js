import React, { useEffect, useState, useRef, useContext } from "react";
import AxiosApi from "../../api/AxiosApi";
import AuthApi from "../../api/AuthApi";
import styled from "styled-components";
import backIcon from "../../images/back.png";
import exitIcon from "../../images/exit_gray.png";
import sendIcon from "../../images/send_color.png";
import { OverlayContainer, OverlayContent, BtnBox } from "../ChatComponent/OpenChatSearch";
import { useNavigate, useParams } from "react-router-dom";
import Commons from "../../util/Common";
import { type } from "@testing-library/user-event/dist/type";
import { ChatContext } from "../../context/ChatStore";

const ChattingRoomBg = styled.div`
    width: 100%;
    height: 100%;
    /* background-color: peachpuff; */
    padding: 0 30px;
    position: relative;
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
    /* height: 400px; */
    height: calc(100% - 130px);
    overflow-y: auto;
    background-color: #777;
    padding: 10px;
`;

const Message = styled.div`
    max-width: 60%;
    padding: 10px;
    margin: 10px;
    border-radius: 20px;
    background-color: ${(props) => (props.isSender ? "#DCF8C6" : "#E0E0E0")};
    align-self: ${(props) => (props.isSender ? "flex-end" : "flex-start")};
    border: ${(props) =>
        props.isSender ? "1px solid #DCF8C6" : "1px solid #E0E0E0"};
`;

const MsgInput = styled.input`
    padding: 5px 10px;
    width: 90%;
    outline-style: none;
    border: none;
    background: none;
    font-size: 1em;
`;

const MsgInputBox = styled.div`
    width: calc(100% - 20px);
    padding: 10px;
    border-radius: 10px;
    background-color: #EEE;
    display: flex;
    justify-content: space-between;
    position: absolute;
    left: 50%;
    bottom: 10px;
    transform: translateX(-50%);
`
const ExitMsg = styled.p`
    font-size: 1.1em;
    text-align: center;
`

const Chatting = ({ setSelectedPage, fetchChatRooms }) => {
    const [isOverlayOpen, setIsOverlayOpen] = useState(false); // Overlay 상태 관리
    const [socketConnected, setSocketConnected] = useState(false);  // 웹소켓 연결 여부
    const [inputMsg, setInputMsg] = useState("");   // 입력 메시지
    const [chatList, setChatList] = useState([]);   // 채팅 글 목록
    const {roomId} = useContext(ChatContext);   // 채팅방 번호, 새로운 방 개설, 기존 방 입장
    const [sender, setSender] = useState("");   // 보낸사람
    const [roomName, setRoomName] = useState("");   // 채팅방 이름
    const [nickName, setNickName] = useState("");
    const ws = useRef(null);    // 웹소켓 객체 생성, 소켓 연결 정보를 유지해야하지만 렌더링과는 무관
    const navigate = useNavigate(); // 페이지 이동
    const email = localStorage.getItem("email");
    
    console.log("Stored Email:", email);

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



    const onClickMsgSend = () => {
        //웹소켓 연결되 있을 때 정보 보내기
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            if (inputMsg.trim() !== "") {
                ws.current.send(
                JSON.stringify({
                    type: "TALK",
                    roomId: roomId,
                    sender: sender,
                    msg: inputMsg,
                    // profile: profile,
                    nickName: nickName,
                })
                );
                setInputMsg("");
            } else {
                // 빈 값일 경우 아무 동작 없이 종료
                console.log("메시지가 비어있습니다.");
            }
        } else {
        alert("채팅 연결에 실패.");
        }
    };

    // 이전 채팅 내용을 가져오는 함수
    const loadPreviousChat = async () => {
        try {
            const res = await AxiosApi.recentChatLoad(roomId);
            console.log("이전채팅내용 : ", res.data);
            const recentMessages = res.data;
            setChatList(recentMessages);
        } catch (error) {
            alert("error : 이전 대화내용을 불러오지 못했습니다.");
        }
    };


    useEffect(() => {
        // 이메일로 회원 닉네임 가져와서 sender에 저장
        const getMember = async () => {
          try {
            const email = localStorage.getItem('email');  // `localStorage`에서 email 가져오기
            if (!email) {
                throw new Error('이메일 정보가 없습니다.');
            }

            const rsp = await AuthApi.memberInfo(localStorage.email);
            console.log("멤버 데이터 : ", rsp.data);
            setSender(rsp.data.email);
            setNickName(rsp.data.nickName);
        } catch (error) {
            alert(
            "error : 회원 닉네임을 불러오지 못했습니다. 이전 페이지로 이동합니다."
            );
            }
        };
        getMember();
    }, []);



    useEffect(() => {
        // 채팅방 정보 가져 오기
        const getChatRoom = async () => {
          try {
            const rsp = await AxiosApi.chatDetail(roomId);
            setRoomName(rsp.data.name);
            console.log(
              "채팅방 정보 가져오기 : ",
              rsp.data,
              "채팅 룸 아이디 : ",
              roomId
            );
          } catch (error) {
            alert(
              "error : 채팅방 정보를 불러오지 못했습니다. 이전 페이지로 이동합니다."
            );
            navigate(-1);
          }
        };
        getChatRoom();
    }, [roomId]);


    useEffect(() => {
        // 웹소켓 연결하는 부분, 이전 대화내용 불러오는 함수 호출
        if (!ws.current) {
            ws.current = new WebSocket(Commons.Capstone_URL);
            ws.current.onopen = () => {
                setSocketConnected(true);
            };
        }
        if (socketConnected) {
            // 웹소켓 연결이 되어있다면,
            ws.current.send(
                JSON.stringify({
                    type: "ENTER",
                    roomId: roomId,
                    sender: sender,
                //   profile: profile,
                    nickName: nickName,
                    msg: "첫 입장",
                })
            );
            loadPreviousChat();
        }
        ws.current.onmessage = msg => {
            const data = JSON.parse(msg.data);
            setChatList(prev => [...prev, data]);   // 기존 채팅 리스트에 새로운 메시지 추가
        }
        // 뒤로가기를 눌렀을 때, 웹소켓 연결 끊기도록 return을 적어줌
        return () => {
            ws.current.send(
                JSON.stringify({
                type: "CLOSE",
                roomId: roomId,
                sender: sender,
                //   profile: profile,
                nickName: nickName,
                msg: "종료 합니다.",
                })
            );
        };
    }, [socketConnected]);

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
                <ChattingIcon src={backIcon} alt="Back" onClick={onClickExit}/>
                채팅방 {roomName}
                <ChattingIcon src={exitIcon} alt="Exit" onClick={ExitChatRoom}/>
            </ChattingTitle>
            <MessagesContainer ref={ChatContainerRef}>
                {chatList.map((chat, index) => (
                    <Message key={index} isSender={chat.sender === sender}>
                        {`${chat.sender}> ${chat.message}`}
                    </Message>
                ))}
            </MessagesContainer>
            <MsgInputBox>
                <MsgInput
                placeholder="문자 전송"
                value={inputMsg}
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