package kh.BackendCapstone.repository.chat;

import kh.BackendCapstone.entity.Member;
import kh.BackendCapstone.entity.chat.ChatMember;
import kh.BackendCapstone.entity.chat.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatMemberRepository extends JpaRepository<ChatMember, Long> {
    List<ChatMember> findByChatRoom(ChatRoom chatRoom);

    Optional<ChatMember> findByMemberAndChatRoom(Member member, ChatRoom chatRoom);

    // 해당 roomId에 입장한 회원 수
    @Query("SELECT COUNT(cm) FROM ChatMember cm WHERE cm.chatRoom.roomId = :roomId")
    int cntRoomMember(@Param("roomId") String roomId);
}
