package kh.BackendCapstone.dto.chat;

import com.fasterxml.jackson.annotation.JsonIgnore;
import kh.BackendCapstone.service.chat.ChatService;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.socket.WebSocketSession;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Getter
@Setter
@Slf4j
@NoArgsConstructor
public class ChatRoomResDto {
    private String profile;
    private String nickName;
    private String roomId;
    private String name;
    private LocalDateTime regDate;
    private String active;

    @JsonIgnore // 웹소켓 세션의 직렬화 방지
    private Set<WebSocketSession> sessions; //채팅방에 입장한 세션 정보를 담을 Set

    //세션 수가 0인지 확인하는 메서드
//    public boolean isSessionEmpty() { return this.sessions.size() == 0;}
    public boolean isSessionEmpty() {  return this.sessions == null || this.sessions.size() == 0;}

    @Builder
    public ChatRoomResDto(String roomId, String name, LocalDateTime regDate, String profile, String nickName) {
        this.profile = profile;
        this.nickName = nickName;
        this.roomId = roomId;
        this.name = name;
        this.regDate = regDate;
        this.sessions = Collections.newSetFromMap(new ConcurrentHashMap<>());
    }

    public void handlerActions(WebSocketSession session, ChatMsgDto chatMsg, ChatService chatService) {
        if(chatMsg.getType() != null && chatMsg.getType().equals(ChatMsgDto.MsgType.ENTER)) {
            sessions.add(session);
//            if (chatMsg.getSender() != null) {
//                chatMsg.setMsg(chatMsg.getSender() + "님이 입장했습니다.");
//            }
            log.debug("새로운 세션 추가 : " + session + "현재 세션 수 : " + sessions.size());
        } else if (chatMsg.getType() != null && chatMsg.getType().equals(ChatMsgDto.MsgType.CLOSE)) {
            sessions.remove(session);
//            if (chatMsg.getSender() != null) {
//                chatMsg.setMsg(chatMsg.getSender() + "님이 퇴장했습니다.");
//            }
            log.debug("메세지 삭제 : " + session);
        } else {
            //입장과 퇴장이 아닌 경우 => 메세지를 보내는 경우 => 보낼 때 마다 메세지 저장
            chatService.saveMsg(chatMsg.getRoomId(), chatMsg.getSender(), chatMsg.getMsg(), chatMsg.getProfile(), chatMsg.getNickName());
            log.debug("메세지 받음 : " + chatMsg.getMsg());
        }
        sendMsg(chatMsg, chatService);
    }

    //채팅방 세션 제거
    public void handleSessionClosed(WebSocketSession session, ChatService chatService) {
        sessions.remove(session);
        log.debug("세션 종료 : " + session);
    }

    private <T> void sendMsg(T msg, ChatService chatService){
        for(WebSocketSession session : sessions) {
            try {
                chatService.sendMsg(session, msg);
            } catch (Exception e) {
                log.error("채팅 보내기 에러 메세지 ChatRoomResDto: ", e);
            }
        }
    }
}
