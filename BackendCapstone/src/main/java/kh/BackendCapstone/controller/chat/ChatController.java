package kh.BackendCapstone.controller.chat;

import kh.BackendCapstone.dto.chat.ChatMsgDto;
import kh.BackendCapstone.dto.chat.ChatRoomReqDto;
import kh.BackendCapstone.dto.chat.ChatRoomResDto;
import kh.BackendCapstone.entity.chat.Chat;
import kh.BackendCapstone.security.SecurityUtil;
import kh.BackendCapstone.service.chat.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
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
//        return ResponseEntity.ok(chatService.findRoomList());
        List<ChatRoomResDto> rooms = chatService.findRoomList();
        return ResponseEntity.ok(rooms);
    }

    // 참여중인 채팅방 리스트
    @GetMapping("/myRooms/{memberId}")
    public ResponseEntity<List<ChatRoomResDto>> getChatRoomsByMemberId(@PathVariable Long memberId) {
        log.info("Requested memberId : {}", memberId);
        // Service 호출하여 참여 중인 채팅방 리스트 반환
        List<ChatRoomResDto> chatRooms = chatService.getChatRoomsByMemberId(memberId);

        return ResponseEntity.ok(chatRooms);
    }

    @GetMapping("/rooms")
    public ResponseEntity<List<ChatRoomResDto>> findByRooms() {
//        return ResponseEntity.ok(chatService.findAllRoom());
        List<ChatRoomResDto> rooms = chatService.findAllRoom();
        return ResponseEntity.ok(rooms);
    }

    // 방 정보 가져오기
    @GetMapping("/room/{roomId}")
    public ResponseEntity<ChatRoomResDto> findRoomById(@PathVariable String roomId) {
        log.info("Requested roomId : {}", roomId);
        try {
            ChatRoomResDto room = chatService.findRoomById(roomId);
            if (room != null) {
                log.info("채팅방 정보 가져가기 : {}", room);
                return ResponseEntity.ok(room);
            } else {
                log.warn("채팅방을 ID로 찾을 수 없음: {}", roomId);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("채팅방 정보 조회 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/cntRoomMember/{roomId}")
    public ResponseEntity<Integer> cntRoomMember(@PathVariable String roomId) {
        try {
            int memberCnt = chatService.cntOfRoomMember(roomId);
            log.info("채팅방Id : {}, 입장 회원 수 : {}", roomId, memberCnt);
            return ResponseEntity.ok(memberCnt);
        } catch (Exception e) {
            log.error("채팅방 회원 수 반환 중 오류 : {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 메시지 저장하기
    @PostMapping("/saveMessage")
    public ResponseEntity<ChatMsgDto> saveMessage(@RequestBody ChatMsgDto chatMsgDto) {
        chatService.saveMsg(chatMsgDto.getRoomId(), chatMsgDto.getProfile(),chatMsgDto.getNickName(), chatMsgDto.getMsg());
        return ResponseEntity.ok(chatMsgDto);
    }

    // 채팅 내역 리스트
    @GetMapping("/message/{roomId}")
    public ResponseEntity<List<ChatMsgDto>> findAll(@PathVariable String roomId) {
        return ResponseEntity.ok(chatService.findAllChatting(roomId));
    }

    // 채팅방 삭제
    @DeleteMapping("/delRoom/{roomId}")
    public ResponseEntity<Boolean> removeRoom(@PathVariable String roomId) {
        boolean isTrue = chatService.removeRoom(roomId);
        return ResponseEntity.ok(isTrue);
    }
}
