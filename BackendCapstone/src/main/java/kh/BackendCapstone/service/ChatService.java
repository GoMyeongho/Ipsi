package kh.BackendCapstone.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kh.springJpa241217.dto.ChatMessageDto;
import com.kh.springJpa241217.dto.response.ChatRoomResDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import javax.annotation.PostConstruct;
import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@RequiredArgsConstructor
@Service
public class ChatService {
	private final ObjectMapper objectMapper;    // JSON 문자열로 변환하기 위한 객체
	private Map<String, ChatRoomResDto> chatRooms;  // 채팅방 정보를 담을 맵
	
	@PostConstruct  // 의존성 주입 이후 초기화를 수행하는 메서드
	private void init() {
		chatRooms = new LinkedHashMap<>();  // 채팅방 정보를 감을 맵
	}
	public List<ChatRoomResDto> findAllRooms() {    // 채팅방 리스트를 반환
		return new ArrayList<>(chatRooms.values());
	}
	public ChatRoomResDto findRoomById(String roomId) {
		return chatRooms.get(roomId);
	}
	// 채팅방 생성
	public ChatRoomResDto createRoom(String name) {
		String randomId = UUID.randomUUID().toString();
		log.info("UUID : {}", randomId);
		ChatRoomResDto chatRoom = ChatRoomResDto.builder() // 채팅방 생성
			.roomId(randomId)
			.name(name)
			.regDate(LocalDateTime.now())
			.build();
		chatRooms.put(randomId, chatRoom);  // 방 생성, 키를 UUID로 하고 방 정보를 값으로 저장
		return chatRoom;
	}
	
	// 방 삭제
	public void removeRoom(String roomId) {
		ChatRoomResDto room = chatRooms.remove(roomId);
		if(room != null) {
			if(room.isSessionEmpty()){
				chatRooms.remove(roomId);
			}
		}
	}
	// 체팅방에 입장한 세션 추가
	public void addSessionAndHandleEnter(String roomId, WebSocketSession session,
	                                     ChatMessageDto chatMessage) {
		ChatRoomResDto room = findRoomById(roomId);
		if(room != null) {
			room.getSessions().add(session);    // 채팅방에 입장한 세션을 추가
			if(chatMessage.getSender() != null) {
				log.warn(chatMessage.getSender());
				chatMessage.setMessage(chatMessage.getSender() + "님이 입장했습니다.");
				// 채팅방에 입장 메세지 전송코드 추가
				sendMessageToAll(roomId, chatMessage);
			}
			log.debug("새로운 세션 추가!!!!!!!!!!!");
		}
	}
	// 채팅방에서 퇴장한 세션 제거
	public void removeSessionAndHandleExit(String roomId, WebSocketSession session,
	                                       ChatMessageDto chatMessage) {
		ChatRoomResDto room = findRoomById(roomId);
		if(room != null) {
			room.getSessions().remove(session); // 채팅방에서 퇴장한 세션 제거
			if(chatMessage.getSender() != null) {   // 채팅방을 퇴장한 사용자가 있으면
				chatMessage.setMessage(chatMessage.getSender() + "님이 퇴장하였습니다.");
				// 채팅방에 퇴장 메세지 전송 코드 추가
				sendMessageToAll(roomId, chatMessage);
			}
			log.debug("세션 제거됨 : {}",session);
			if(room.isSessionEmpty()) {
				removeRoom(roomId); //세션이 남아있지 않으면 방 삭제
			}
		}
	}
	public void sendMessageToAll(String roomId, ChatMessageDto message) {
		ChatRoomResDto room = findRoomById(roomId);
		if(room != null) {
			for(WebSocketSession session : room.getSessions()) {
				// 해당 세션에 개별 메세지 발송
				sendMessage(session, message);
			}
		}
	}
	public <T> void sendMessage(WebSocketSession session, T message) {
		try {
			session.sendMessage(new TextMessage(objectMapper.writeValueAsString(message)));
		} catch (Exception e) {
			log.error("메세지 전송 실패 : {}", e.getMessage());
		}
	}
}
