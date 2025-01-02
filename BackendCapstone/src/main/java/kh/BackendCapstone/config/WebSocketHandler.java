package kh.BackendCapstone.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import kh.BackendCapstone.dto.chat.ChatMsgDto;
import kh.BackendCapstone.dto.chat.ChatRoomResDto;
import kh.BackendCapstone.service.chat.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Collections;
import java.util.HashSet;
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
	private final Map<String, Set<String>> roomMembersMap = new ConcurrentHashMap<>();
	@Override
	//클라이언트가 서버로 연결을 시도할 때 호출
	protected void handleTextMessage(WebSocketSession session, TextMessage msg) throws Exception {
		try {
			String payload = msg.getPayload();
			log.warn("{}", payload);
			ChatMsgDto chatMsg = objectMapper.readValue(payload, ChatMsgDto.class);
			String roomId = chatMsg.getRoomId();
			ChatRoomResDto chatRoom = chatService.findRoomById(roomId);

			if (chatRoom != null) {
				log.info("채팅룸의 getRegDate() : {}", chatRoom.getRegDate());
				sessionRoomIdMap.put(session, roomId);
				log.info("채팅룸 세션 확인해야함!!!!@2222 : {}", sessionRoomIdMap);
				roomMembersMap.computeIfAbsent(roomId, k -> new HashSet<>()).add(chatMsg.getSender());
				chatRoom.handlerActions(session, chatMsg, chatService);
			} else {
				log.error("채팅룸을 ID로 찾을 수 없습니다. RoomId: {}", roomId);
			}
		} catch (Exception e) {
			log.error("handleTextMessage에서 에러 발생", e);
		}
	}
	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		//세션과 매핑된 채팅방 ID 가져오기
		try {
			log.warn("채팅방 종료 : {}", session);
			String roomId = sessionRoomIdMap.remove(session);

			Set<String> roomMembers = roomMembersMap.get(roomId);

			if (roomMembers != null) {
				roomMembers.remove(session.getId()); // 세션 아이디로 사용자 제거
			}

			ChatRoomResDto chatRoom = chatService.findRoomById(roomId);
			if (chatRoom != null) {
				chatRoom.handleSessionClosed(session, chatService);
			} else {
				log.warn("채팅창을 아이디로 찾을 수 없음: {}", roomId);
			}
		}catch (Exception e) {
			log.error("채팅방 종료 에러", e);
		}
	}

	// 실시간으로 채팅방 참여자 목록을 가져오기 위한 메서드
	@GetMapping("/chat/members/{roomId}")
	public ResponseEntity<Set<String>> getChatMembers(@PathVariable String roomId) {
		Set<String> members = roomMembersMap.getOrDefault(roomId, Collections.emptySet());
		log.info("실시간 채팅방 참여자 룸멤버맵 어떻게 가져오나? : {}", roomMembersMap);
		return ResponseEntity.ok(members);
	}
}