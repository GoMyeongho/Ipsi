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

	private final Map<WebSocketSession, String> sessionRoomIdMap = new ConcurrentHashMap<>();
	private final Map<String, Set<String>> roomMembersMap = new ConcurrentHashMap<>();



	// 실시간으로 채팅방 참여자 목록을 가져오기 위한 메서드
	@GetMapping("/chat/members/{roomId}")
	public ResponseEntity<Set<String>> getChatMembers(@PathVariable String roomId) {
		Set<String> members = roomMembersMap.getOrDefault(roomId, Collections.emptySet());
		log.info("실시간 채팅방 참여자 룸멤버맵 어떻게 가져오나? : {}", roomMembersMap);
		return ResponseEntity.ok(members);
	}
}