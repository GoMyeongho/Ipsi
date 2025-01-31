package kh.BackendCapstone.service.chat;

import com.fasterxml.jackson.databind.ObjectMapper;
import kh.BackendCapstone.dto.chat.ChatMsgDto;
import kh.BackendCapstone.dto.chat.ChatRoomReqDto;
import kh.BackendCapstone.dto.chat.ChatRoomResDto;
import kh.BackendCapstone.entity.Member;
import kh.BackendCapstone.entity.chat.Chat;
import kh.BackendCapstone.entity.chat.ChatMember;
import kh.BackendCapstone.entity.chat.ChatRoom;
import kh.BackendCapstone.repository.MemberRepository;
import kh.BackendCapstone.repository.chat.ChatMemberRepository;
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
    private final ChatMemberRepository chatMemberRepository;
    private final MemberRepository memberRepository;

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
        for (ChatRoom chatRoom : chatRoomRepository.findAllByOrderByRegDateAsc()) {
            ChatRoomResDto chatRoomDto = convertEntityToRoomDto(chatRoom);
            chatRoomResDtoList.add(chatRoomDto);
        }
        return chatRoomResDtoList;
    }

    // 참여중인 채팅방 리스트
    public List<ChatRoomResDto> getChatRoomsByMemberId(Long memberId) {
        // ChatRoom 엔티티 리스트를 가져옴
        List<ChatRoom> chatRooms = chatRoomRepository.findChatRoomsByMemberId(memberId);

        // ChatRoom 엔티티를 ChatRoomResDto로 변환
        return chatRooms.stream()
                .map(this::convertEntityToRoomDto)
                .collect(Collectors.toList());
    }

    // 채팅방에 입장한 회원 수 반환
    public int cntOfRoomMember(String roomId) {
        try {
            int memberCnt = chatMemberRepository.cntRoomMember(roomId);
            log.info("채팅방Id : {}, 입장 회원 수 : {}", roomId, memberCnt);
            return memberCnt;
        } catch (Exception e) {
            log.error("채팅방 회원 수 반환 중 오류 : {}", e.getMessage());
            throw new RuntimeException("채팅방 회원 수 반환 중 오류");
        }
    }

    // 채팅방 가져오기
    public ChatRoomResDto findRoomById(String roomId) {
//        return chatRooms.get(roomId);
        ChatRoomResDto room = chatRooms.get(roomId);
        if (room == null) {
            throw new RuntimeException("해당 채팅방이 존재하지 않습니다: " + roomId);
        }
        return room;
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
                .personCnt(chatRoomDto.getPersonCnt())
                .build();
        chatRoomEntity.setRoomId(randomId);
        chatRoomEntity.setRoomName(chatRoomDto.getName());
        chatRoomEntity.setRegDate(LocalDateTime.now());
        chatRoomEntity.setRoomType(chatRoomDto.getRoomType());
        chatRoomEntity.setPersonCnt(chatRoomDto.getPersonCnt());
        chatRoomRepository.save(chatRoomEntity);

        chatRooms.put(randomId, chatRoom);
        log.debug("현재 chatRooms: {}", chatRooms);
        return chatRoom;
    }

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
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(
                        () -> new RuntimeException("해당 채팅방이 존재하지 않습니다.1")
                );
        if (room != null) { // 방이 존재하면
            if (room.isSessionEmpty() && chatMemberRepository.findByChatRoom(chatRoom).isEmpty()) {
                chatRooms.remove(roomId); // 방 삭제
                ChatRoom chatRoomEntity = chatRoomRepository.findById(roomId).orElseThrow(
                        () -> new RuntimeException("해당 채팅방이 존재하지 않습니다.2")
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
            log.debug("새로운 세션 추가");

            Member member = memberRepository.findByNickName(chatMessage.getSender()).orElseThrow(
                    () -> new RuntimeException("해당 멤버 없음")
            );
            ChatRoom chatRoom = chatRoomRepository.findById(roomId).orElseThrow(
                    () -> new RuntimeException("해당 채팅방 없음")
            );

            Optional<ChatMember> existingChatMember = chatMemberRepository.findByMemberAndChatRoom(member, chatRoom);
            if (!existingChatMember.isPresent()) {
                ChatMember chatMember = new ChatMember();
                chatMember.setMember(member);
                chatMember.setChatRoom(chatRoom);

                chatMemberRepository.save(chatMember);
            } else {
                log.info("이미 참여한 채팅방 멤버입니다.");
            }
        }
    }

    // 채팅방에서 퇴장한 세션 제거
    public void removeSessionAndHandleExit(String roomId, WebSocketSession session, ChatMsgDto chatMessage) {
        ChatRoomResDto room = findRoomById(roomId);
        if (room != null) {
            room.getSessions().remove(session); // 채팅방에서 퇴장한 세션 제거
            log.debug("세션 제거됨 : {}", session);

            Member member = memberRepository.findByNickName(chatMessage.getSender()).orElseThrow(
                    () -> new RuntimeException("해당 멤버 없음")
            );

            ChatRoom chatRoom = chatRoomRepository.findById(roomId).orElseThrow(
                    () -> new RuntimeException("해당 채팅방 없음")
            );

            ChatMember chatMember = chatMemberRepository.findByMemberAndChatRoom(member, chatRoom).orElseThrow(
                    () -> new RuntimeException("해당 멤버가 있는 채팅방 없음")
            );

            if (chatMember != null) {
                chatMemberRepository.delete(chatMember);
                log.debug("ChatMember 삭제 : member = {}, chatRoom = {}", member.getNickName(), chatRoom.getRoomId());
//                removeRoom(roomId); // 세션이 남아 있지 않으면 채팅방 삭제
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

    // 채팅 메세지 DB 저장
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

    // ChatRoom 엔티티 Dto로 변환
    private ChatRoomResDto convertEntityToRoomDto(ChatRoom chatRoom) {
        ChatRoomResDto chatRoomResDto = new ChatRoomResDto();
        chatRoomResDto.setRoomId(chatRoom.getRoomId());
        chatRoomResDto.setName(chatRoom.getRoomName());
        chatRoomResDto.setRegDate(chatRoom.getRegDate());
        chatRoomResDto.setRoomType(chatRoom.getRoomType());
        chatRoomResDto.setPersonCnt(chatRoom.getPersonCnt());
        return chatRoomResDto;
    }

    // Chat 엔티티 Dto로 변환
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