package kh.BackendCapstone.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import kh.BackendCapstone.dto.chat.ChatMsgDto;
import kh.BackendCapstone.dto.chat.ChatRoomResDto;
import kh.BackendCapstone.service.chat.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@RequiredArgsConstructor
@Slf4j
@Component
//WebSocketHandler 를 상속받아 WebSocketHandler 를 구현
public class WebSocketHandler extends TextWebSocketHandler {
	private final ObjectMapper objectMapper; //JSON 문자열로 변환하기 위한 객체
	private final ChatService chatService; // 채팅방 관련 비즈니스 로직을 처리할 서비스
	private final Map<WebSocketSession, String> sessionRoomIdMap = new ConcurrentHashMap<>();
	@Override
	//클라이언트가 서버로 연결을 시도할 때 호출
	protected void handleTextMessage(WebSocketSession session, TextMessage msg) throws Exception {
		try {
			String payload = msg.getPayload();
			log.warn("payload : {}", payload);
			// JSON 문자열을 ChatMessageDto 변환 작업
			ChatMsgDto chatMsg = objectMapper.readValue(payload, ChatMsgDto.class);
			String roomId = chatMsg.getRoomId();

			/*ChatRoomResDto chatRoom = chatService.findRoomById(roomId);
			if (chatRoom != null) {
				log.warn("session : {}", session);
				log.info("채팅룸의 getRegDate() : {}", chatRoom.getRegDate());
				sessionRoomIdMap.put(session, roomId);
				log.info("채팅룸 세션 확인해야함 : {}", sessionRoomIdMap);

				if (chatMsg.getType() == ChatMsgDto.MsgType.ENTER) {
					chatRoom.handlerActions(session, chatMsg, chatService);
					log.info("입장 메시지 전송");
					roomMembersMap.computeIfAbsent(roomId, k -> new HashSet<>()).add(chatMsg.getSender());
				} else if (chatMsg.getType() == ChatMsgDto.MsgType.TALK) {
					chatRoom.handlerActions(session, chatMsg, chatService);
				} else if (chatMsg.getType() == ChatMsgDto.MsgType.CLOSE) {
					chatRoom.handleSessionClosed(session, chatService);
				}
			} else {
				log.error("채팅룸을 ID로 찾을 수 없습니다. RoomId: {}", roomId);
			}*/
			if (chatMsg.getType() == ChatMsgDto.MsgType.ENTER) {
				sessionRoomIdMap.put(session, chatMsg.getRoomId());
				chatService.addSessionAndHandlerEnter(roomId, session, chatMsg);
			} else if (chatMsg.getType() == ChatMsgDto.MsgType.CLOSE) {
				chatService.removeSessionAndHandleExit(roomId, session, chatMsg);
			} else {
				chatService.sendMsgToAll(roomId, chatMsg);
				chatService.saveMsg(chatMsg.getRoomId(), chatMsg.getSender(), chatMsg.getMsg(), chatMsg.getProfile());
			}
		} catch (Exception e) {
			log.error("handleTextMessage에서 에러 발생", e);
		}
	}
	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		//세션과 매핑된 채팅방 ID 가져오기
		try {
			log.error("연결 해제 이후 동작(채팅방 종료) : {}", session);
			String roomId = sessionRoomIdMap.remove(session);

			/*if (roomId != null) {
				Set<String> roomMembers = roomMembersMap.get(roomId);
				if (roomMembers != null) {
					roomMembers.remove(session.getId());
				}

				ChatRoomResDto chatRoom = chatService.findRoomById(roomId);
				if (chatRoom != null) {
					chatRoom.handleSessionClosed(session, chatService);
				} else {
					log.warn("채팅창을 아이디로 찾을 수 없음: {}", roomId);
				}
			}*/
			if (roomId != null) {
				ChatMsgDto chatMsg = new ChatMsgDto();
				chatMsg.setType(ChatMsgDto.MsgType.CLOSE);
				chatService.removeSessionAndHandleExit(roomId, session, chatMsg);
			}
		} catch (Exception e) {
			log.error("채팅방 종료 에러", e);
		}
	}
}