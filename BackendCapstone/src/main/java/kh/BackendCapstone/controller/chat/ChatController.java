package kh.BackendCapstone.controller.chat;

import kh.BackendCapstone.dto.chat.ChatMsgDto;
import kh.BackendCapstone.dto.chat.ChatRoomReqDto;
import kh.BackendCapstone.dto.chat.ChatRoomResDto;
import kh.BackendCapstone.entity.chat.Chat;
import kh.BackendCapstone.service.chat.ChatService;
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

    //채팅방 생성
    @PostMapping("/new")
    public ResponseEntity<String> createRoom(@RequestBody ChatRoomReqDto chatRoomReqDto) {

        if (chatRoomReqDto.getName().length() > 20) {
            return ResponseEntity.badRequest().body("채팅방 이름은 20자 이하로 입력해주세요.");
        }
        if (chatRoomReqDto.getPersonCnt() > 30) {
            return ResponseEntity.badRequest().body("참여 가능 인원은 최대 30명입니다.");
        }

        ChatRoomResDto room = chatService.createRoom(chatRoomReqDto);
        return ResponseEntity.ok(room.getRoomId());
    }

    //채팅방 리스트
    @GetMapping("/roomList")
    public ResponseEntity<List<ChatRoomResDto>> findByRoomList() {
        return ResponseEntity.ok(chatService.findRoomList());
    }

    // 전체 채팅 내역 리스트
    @GetMapping("/chatList")
    public ResponseEntity<List<ChatMsgDto>> findAll() {return ResponseEntity.ok(chatService.findAllChat()); }

    // 방 정보 가져오기
    @GetMapping("/room/{roomId}")
    public ResponseEntity<ChatRoomResDto> findRoomById(@PathVariable String roomId) {
        log.info("채팅방 정보 가져가기 : {}", chatService.findRoomById(roomId));
        return ResponseEntity.ok(chatService.findRoomById(roomId));
    }

    // 메세지 저장하기
    @PostMapping("/message")
    public ResponseEntity<ChatMsgDto> saveMessage(@RequestBody ChatMsgDto chatMsgDto) {
        chatService.saveMsg(chatMsgDto.getRoomId(), chatMsgDto.getSender(), chatMsgDto.getMsg(), chatMsgDto.getProfile(),chatMsgDto.getNickName());
        return ResponseEntity.ok(chatMsgDto);
    }

    // 해당 방의 최근 메세지 불러오기
    @GetMapping("/message/{roomId}")
    public List<Chat> getRecentMsg(@PathVariable String roomId) {
        return chatService.getRecentMsg(roomId);
    }

    // 채팅 내역 삭제
    @DeleteMapping("/delChat/{id}")
    public ResponseEntity<Boolean> deleteChat(@PathVariable Long id) {
        boolean isTrue = chatService.deleteChat(id);
        return ResponseEntity.ok(isTrue);
    }
    // 채팅방 삭제
    @DeleteMapping("/delRoom/{roomId}")
    public ResponseEntity<Boolean> deleteRoom(@PathVariable String roomId) {
        boolean isTrue = chatService.deleteRoom(roomId);
        return ResponseEntity.ok(isTrue);
    }
}
