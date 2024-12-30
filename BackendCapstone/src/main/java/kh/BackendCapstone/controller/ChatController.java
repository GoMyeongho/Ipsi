package kh.BackendCapstone.controller;


import com.kh.springJpa241217.dto.request.ChatRoomReqDto;
import com.kh.springJpa241217.dto.response.ChatRoomResDto;
import com.kh.springJpa241217.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/chat")
public class ChatController {
	private final ChatService chatService;
	
	@PostMapping("/new")    // 채팅방 개설
	public ResponseEntity<String> createRoom(@RequestBody ChatRoomReqDto chatRoomReqDto) {
		log.info("chatRoomReqDto : {}", chatRoomReqDto);
		ChatRoomResDto chatRoomResDto = chatService.createRoom(chatRoomReqDto.getName());
		log.info("chatRoomResDto : {}", chatRoomResDto);
		return ResponseEntity.ok(chatRoomResDto.getRoomId());
	}
	@GetMapping("/list")
	public ResponseEntity<List<ChatRoomResDto>> findAllRoom() {
		List<ChatRoomResDto> rst = chatService.findAllRooms();
		return ResponseEntity.ok(rst);
	}
	@GetMapping("/room/{roomId}")
	public ResponseEntity<ChatRoomResDto> findRoomById(@PathVariable String roomId) {
		ChatRoomResDto rst = chatService.findRoomById(roomId);
		log.info("findRoomById : {}",rst);
		return ResponseEntity.ok(rst);
	}
}
