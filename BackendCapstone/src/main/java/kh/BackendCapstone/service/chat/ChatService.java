package kh.BackendCapstone.service.chat;

import com.fasterxml.jackson.databind.ObjectMapper;
import kh.BackendCapstone.dto.chat.ChatMsgDto;
import kh.BackendCapstone.dto.chat.ChatRoomReqDto;
import kh.BackendCapstone.dto.chat.ChatRoomResDto;
import kh.BackendCapstone.entity.chat.Chat;
import kh.BackendCapstone.entity.chat.ChatRoom;
import kh.BackendCapstone.repository.chat.ChatRepository;
import kh.BackendCapstone.repository.chat.ChatRoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class ChatService {
    private final ObjectMapper objectMapper; // JSON 문자열로 변환하기 위한 객체
    private Map<String, ChatRoomResDto> chatRooms; // 채팅방 정보를 담을 맵
    private final ChatRoomRepository chatRoomRepository;
    private final ChatRepository chatRepository;

    @PostConstruct // 의존성 주입 이후 초기화 수행하는 메소드
    private void init() { chatRooms = new LinkedHashMap<>();}
    public List<ChatRoomResDto> findAllRoom() { return new ArrayList<>(chatRooms.values());}


    // 채팅 내역 전체 조회
    public List<ChatMsgDto> findAllChat() {
        List<Chat> chat = chatRepository.findAll();
        List<ChatMsgDto> chatMsgDtos = new ArrayList<>();
        for(Chat chat1 : chat) {
            chatMsgDtos.add(convertEntityToChatDto(chat1));
        }
        return chatMsgDtos;
    }

    public List<ChatRoomResDto> findRoomList() { // 채팅방 리스트 반환
        List<ChatRoomResDto> chatRoomResDtoList = new ArrayList<>();
        for (ChatRoom chatRoom : chatRoomRepository.findAllByOrderByRegDateDesc()) {
            ChatRoomResDto chatRoomDto = convertEntityToRoomDto(chatRoom);
            chatRoomResDtoList.add(chatRoomDto);
//            log.warn("챗룸{}", chatRoomDto);
        }
//        log.warn("채팅방 리스트 검색{}", chatRoomResDtoList);
        return chatRoomResDtoList;
    }

    // 채팅방 가져오기
    public ChatRoomResDto findRoomById(String roomId) {
        log.warn(roomId);
        return chatRooms.get(roomId);}

    // 이전 채팅 가져오기
    public List<Chat> getRecentMsg(String roomId) {
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
            .orElseThrow(() -> new RuntimeException("해당 하는 채팅방이 없습니다."));
        return chatRepository.findRecentMsg(chatRoom);
    }

    // 방 개설하기
    public ChatRoomResDto createRoom(ChatRoomReqDto chatRoomDto) {
        String randomId = UUID.randomUUID().toString();
        log.info("UUID : {}", randomId);
        ChatRoom chatRoomEntity = new ChatRoom(); //ChatRoom엔티티 객체 생성(채팅방 정보db저장 하려고)
        ChatRoomResDto chatRoom = ChatRoomResDto.builder()
                .roomId(randomId)
                .name(chatRoomDto.getName())
                .regDate(LocalDateTime.now())
                .build();
        chatRoomEntity.setRoomId(randomId);
        chatRoomEntity.setRoomName(chatRoomDto.getName());
        chatRoomEntity.setRegDate(LocalDateTime.now());
        chatRoomEntity.setRoomType(chatRoomDto.getRoomType());
        chatRoomEntity.setMaxMembers(chatRoomDto.getPersonCnt());
        chatRoomRepository.save(chatRoomEntity);

        chatRooms.put(randomId, chatRoom);
        return chatRoom;
    }
    // 채팅방 삭제
    public boolean deleteRoom(String roomId) {
        ChatRoomResDto room = chatRooms.get(roomId); // 방 정보 가져오기
        if (room != null) { // 방이 존재하면
            if (room.isSessionEmpty()) { // 방에 세션이 없으면
                chatRooms.remove(roomId); // 방 삭제
                ChatRoom chatRoomEntity = chatRoomRepository.findById(roomId).orElseThrow(
                        () -> new RuntimeException("해당 채팅방이 존재하지 않습니다.")
                );
                if (chatRoomEntity != null) {
                    chatRoomRepository.delete(chatRoomEntity);
                    return true;
                }
            }
        }
        return false;
    }

    // 채팅 내역 삭제
    public boolean deleteChat(Long id) {
        try {
            Chat chat = chatRepository.findByChatId(id).orElseThrow(
                    () -> new RuntimeException("해당 채팅 내역이 없습니다.")
            );
            chatRepository.delete(chat);
            return true;
        } catch (Exception e) {
            log.error("채팅 내역 삭제중 오류 : {}", e.getMessage());
            return false;
        }
    }

    public <T> void sendMsg(WebSocketSession session, T msg) {
        try {
            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(msg)));
        }catch (IOException e) {
            log.error(e.getMessage(), e);
        }
    }



    //채팅 메세지 데이터베이스 저장하기
    public void saveMsg(String roomId, String sender, String msg, String profile, String nickName) {
        ChatRoom chatRoom = chatRoomRepository.findById(roomId).orElseThrow(() -> new RuntimeException("해당 채팅방이 존재하지 않습니다."));
        Chat chatMsg = new Chat();
        chatMsg.setChatRoom(chatRoom);
        chatMsg.setMsg(msg);
        chatMsg.setRegDate(LocalDateTime.now());
//        chatMsg.setActive("active");
        chatRepository.save(chatMsg);
    }

    //ChatRoom 엔티티를 dto로 변환
    private ChatRoomResDto convertEntityToRoomDto(ChatRoom chatRoom) {
        ChatRoomResDto chatRoomResDto = new ChatRoomResDto();
        chatRoomResDto.setRoomId(chatRoom.getRoomId());
        chatRoomResDto.setName(chatRoom.getRoomName());
        chatRoomResDto.setRegDate(chatRoom.getRegDate());
        return chatRoomResDto;
    }

    //Chat 엔티티 dto로 변환
    private ChatMsgDto convertEntityToChatDto(Chat chat) {
        ChatMsgDto chatMsgDto = new ChatMsgDto();
        chatMsgDto.setId(chat.getChatId());
        chatMsgDto.setRoomId(chat.getChatRoom().getRoomId());
        chatMsgDto.setMsg(chat.getMsg());
//        chatMsgDto.setActive(chat.getActive());
        return chatMsgDto;
    }
}


/*    // 채팅방 참여자 목록 가져오기
    public List<String> getChatMembers(String roomId) {
        Optional<Chat> chatOptional = chatRepository.findById(roomId);
        if (chatOptional.isPresent()) {
            Chat chat = chatOptional.get();
            return chat.getMembers();
        } else {
            throw new RuntimeException("채팅방을 찾을 수 없습니다.");
        }
    }

    // 채팅방 참여자 목록 업데이트
    public void updateChatMembers(String roomId, List<String> members) {
        Optional<Chat> chatOptional = chatRepository.findById(roomId);
        if (chatOptional.isPresent()) {
            Chat chat = chatOptional.get();
            chat.setMembers(members);
            chatRepository.save(chat);
        } else {
            throw new RuntimeException("채팅방을 찾을 수 없습니다.");
        }
    }*/

/*    // 채팅방전체조회
    public List<ChatRoomResDto> findAllChatRoom() {
        List<ChatRoom> chatRoom = chatRoomRepository.findAllByOrderByRegDateDesc();
        List<ChatRoomResDto> chatRoomResDtos = new ArrayList<>();
        for(ChatRoom chatRoom1 : chatRoom) {
            chatRoomResDtos.add(convertEntityToRoomDto(chatRoom1));
        }
        return chatRoomResDtos;
    }*/