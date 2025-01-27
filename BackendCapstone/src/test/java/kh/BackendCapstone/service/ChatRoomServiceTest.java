package kh.BackendCapstone.service;

import kh.BackendCapstone.dto.chat.ChatMsgDto;
import kh.BackendCapstone.dto.chat.ChatRoomResDto;
import kh.BackendCapstone.entity.chat.ChatRoom;
import kh.BackendCapstone.repository.chat.ChatMemberRepository;
import kh.BackendCapstone.repository.chat.ChatRepository;
import kh.BackendCapstone.repository.chat.ChatRoomRepository;
import kh.BackendCapstone.service.chat.ChatService;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.List;

import static kh.BackendCapstone.constant.ChatRoomType.GROUP;
import static kh.BackendCapstone.constant.ChatRoomType.PRIVATE;
import static org.junit.jupiter.api.Assertions.assertEquals;

@Slf4j
@SpringBootTest
@TestPropertySource(locations = "classpath:application-test.properties")

public class ChatRoomServiceTest {

    public static final String FONT_YELLOW = "\u001B[33m";

    @Autowired
    private ChatService chatService;
    @Autowired
    private ChatRoomRepository chatRoomRepository;
    @Autowired
    private ChatRepository chatRepository;
    @Autowired
    private ChatMemberRepository chatMemberRepository;

    @Test
    @DisplayName("채팅방 목록 조회 테스트")
    public void findAllChatRoom() {

        // 샘플 채팅방1 생성
        ChatRoom chatRoomEntity1 = new ChatRoom();
        chatRoomEntity1.setRoomId("aedde70f-5e5f-4f8e-a7fe-7a2c49890c6f");
        chatRoomEntity1.setRoomName("채팅방1");
        chatRoomEntity1.setRegDate(LocalDateTime.now());
        chatRoomEntity1.setRoomType(PRIVATE);
        chatRoomEntity1.setMaxMembers(2);
        chatRoomRepository.save(chatRoomEntity1);

        // 샘플 채팅방2 생성
        ChatRoom chatRoomEntity2 = new ChatRoom();
        chatRoomEntity2.setRoomId("baccy70f-5e7f-4f8e-a8fe-8a2c35780c6g");
        chatRoomEntity2.setRoomName("채팅방2");
        chatRoomEntity2.setRegDate(LocalDateTime.now());
        chatRoomEntity2.setRoomType(GROUP);
        chatRoomEntity2.setMaxMembers(5);
        chatRoomRepository.save(chatRoomEntity2);

        // 채팅방 목록 조회
        List<ChatRoomResDto> chatRoomList = chatService.findRoomList();

        // 채팅방 목록 확인
        assertEquals(2, chatRoomList.size());
        assertEquals("채팅방1", chatRoomList.get(0).getName(), "첫 번째 채팅방 - '채팅방1'");
        assertEquals("채팅방2", chatRoomList.get(1).getName(), "두 번째 채팅방 - '채팅방2'");

        // 조회된 목록
        System.out.println(FONT_YELLOW + "모든 채팅방 개수 : " + chatRoomList.size());
        System.out.println(FONT_YELLOW + "모든 채팅방 목록 : " + chatRoomList);
    }

    @Test
    @DisplayName("채팅 메시지 저장 및 조회 테스트")
    public void saveAndFindChatMsg() {

        // 샘플 채팅방3 생성
        ChatRoom chatRoomEntity3 = new ChatRoom();
        chatRoomEntity3.setRoomId("apish70f-89us-20pt-a7fe-7a2c44820c6f");
        chatRoomEntity3.setRoomName("채팅방3");
        chatRoomEntity3.setRegDate(LocalDateTime.now());
        chatRoomEntity3.setRoomType(GROUP);
        chatRoomEntity3.setMaxMembers(10);
        chatRoomRepository.save(chatRoomEntity3);

        // 메시지 저장
        String roomId = "apish70f-89us-20pt-a7fe-7a2c44820c6f";
        String sender = "마리모";
        String msg = "test message";
        String profile = "";
        LocalDateTime regDate = LocalDateTime.now();


        chatService.saveMsg(roomId, sender, msg, profile);

        // 채팅 내역 조회
        List<ChatMsgDto> chatMessages = chatService.findAllChatting(roomId);

        // 저장된 메시지 조회 확인
        assertEquals(1, chatMessages.size(), "저장된 메시지 개수 - 1개");
        assertEquals(msg, chatMessages.get(0).getMsg(), "채팅 메시지가 올바르게 저장되지 않았습니다.");
        assertEquals(sender, chatMessages.get(0).getSender(), "메시지 보낸 사람 정보가 올바르지 않습니다.");
        assertEquals(profile, chatMessages.get(0).getProfile(), "프로필 정보가 올바르지 않습니다.");
    }
}