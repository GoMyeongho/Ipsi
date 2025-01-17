package kh.BackendCapstone.service.chat;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.ObjectMapper;
import kh.BackendCapstone.dto.chat.ChatMsgDto;
import kh.BackendCapstone.dto.chat.ChatRoomReqDto;
import kh.BackendCapstone.dto.chat.ChatRoomResDto;
import kh.BackendCapstone.entity.chat.Chat;
import kh.BackendCapstone.entity.chat.ChatRoom;
import kh.BackendCapstone.repository.chat.ChatRepository;
import kh.BackendCapstone.repository.chat.ChatRoomRepository;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
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
//    private void init() {chatRooms = new LinkedHashMap<>();}
    private void init() {
        chatRooms = chatRoomRepository.findAll()
                .stream()
                .collect(Collectors.toMap(ChatRoom::getRoomId, this::convertEntityToRoomDto));
    }
    public List<ChatRoomResDto> findAllRoom() {
        return new ArrayList<>(chatRooms.values());
    }

    // 채팅방 리스트 반환
    public List<ChatRoomResDto> findRoomList() {
        List<ChatRoomResDto> chatRoomResDtoList = new ArrayList<>();
        for (ChatRoom chatRoom : chatRoomRepository.findAllByOrderByRegDateDesc()) {
            ChatRoomResDto chatRoomDto = convertEntityToRoomDto(chatRoom);
            chatRoomResDtoList.add(chatRoomDto);
        }
        return chatRoomResDtoList;
    }

    // 채팅방 가져오기
    public ChatRoomResDto findRoomById(String roomId) {
        return chatRooms.get(roomId);
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
        log.debug("현재 chatRooms: {}", chatRooms);
        return chatRoom;
    }

/*    // 이전 채팅 내역
    public List<Chat> getRecentMsg(String roomId) {
        List<Chat> chatList = chatRepository.findRecentMsg(roomId);
        return chatRepository.findRecentMsg(roomId);
    }*/

    // 전체 채팅 내역
    public List<ChatMsgDto> findAllChatting(String roomId) {
        List<Chat> chat = chatRepository.findRecentMsg(roomId);
        List<ChatMsgDto> chatMsgDtos = new ArrayList<>();
        for (Chat chat1 : chat) {
            chatMsgDtos.add(convertEntityToChatDto(chat1));
        }
        return chatMsgDtos;
    }

    // 채팅방 삭제
    public boolean removeRoom(String roomId) {
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

    // 채팅방에 입장한 세션 추가
    public void addSessionAndHandlerEnter(String roomId, WebSocketSession session, ChatMsgDto chatMessage) {
        ChatRoomResDto room = findRoomById(roomId);
        if (room != null) {
            room.getSessions().add(session);    // 채팅방에 입장한 세션을 추가
/*            if (chatMessage.getSender() != null) {   // 채팅방에 입장한 사용자가 있으면
                chatMessage.setMsg(chatMessage.getSender() + "님이 입장했습니다.");
                // 채팅방에 입장 메시지 전송 코드 추가
                sendMsgToAll(roomId, chatMessage);  // 메세지를 보내기 위한 메소드
            }*/
            log.debug("새로운 세션 추가");
        }
    }

    // 채팅방에서 퇴장한 세션 제거
    public void removeSessionAndHandleExit(String roomId, WebSocketSession session, ChatMsgDto chatMessage) {
        ChatRoomResDto room = findRoomById(roomId);
        if (room != null) {
            room.getSessions().remove(session); // 채팅방에서 퇴장한 세션 제거
/*            if (chatMessage.getSender() != null) {  //  채팅방에 퇴장한 사용자가 있으면
                chatMessage.setMsg(chatMessage.getSender() + "님이 퇴장했습니다.");
                // 채팅방에 퇴장 메시지 전송 코드 추가
                sendMsgToAll(roomId, chatMessage);  // 메세지를 보내기 위한 메소드
            }*/
            log.debug("세션 제거됨 : {}", session);
            if (room.isSessionEmpty()) {
                removeRoom(roomId); // 세션이 남아 있지 않으면 채팅방 삭제
            }
        }
    }

    public void sendMsgToAll(String roomId, ChatMsgDto msg) {
        ChatRoomResDto room = findRoomById(roomId);
        if (room != null) {
            for (WebSocketSession session : room.getSessions()) {
                // 해당 세션에 메시지 발송
                sendMsg(session, msg);  // 채팅 메세지를 보내는 메소드
            }
        }
    }

    public <T> void sendMsg(WebSocketSession session, T msg) {
        try {
            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(msg)));
        }catch (IOException e) {
            log.error("메시지 전송 실패 : {}", e.getMessage());
        }
    }

    //채팅 메세지 데이터베이스 저장하기
    public void saveMsg(String roomId, String nickName, String msg, String profile) {
        ChatRoom chatRoom = chatRoomRepository.findById(roomId).orElseThrow(() -> new RuntimeException("해당 채팅방이 존재하지 않습니다."));
        Chat chatMsg = new Chat();
        chatMsg.setChatRoom(chatRoom);
        chatMsg.setSender(nickName);
        chatMsg.setMsg(msg);
        chatMsg.setProfile(profile);
        chatMsg.setNickName(nickName);
        chatMsg.setRegDate(LocalDateTime.now(ZoneId.of("Asia/Seoul")));
        chatRepository.save(chatMsg);
        log.warn("DB에 채팅 저장");
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
        chatMsgDto.setProfile(chat.getProfile());
        chatMsgDto.setNickName(chat.getNickName());
        chatMsgDto.setSender(chat.getSender());
        chatMsgDto.setMsg(chat.getMsg());
        chatMsgDto.setRegDate(chat.getRegDate());

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


/*
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
    }*/
