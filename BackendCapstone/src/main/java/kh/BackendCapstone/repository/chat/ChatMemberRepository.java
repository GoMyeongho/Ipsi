package kh.BackendCapstone.repository.chat;

import kh.BackendCapstone.entity.Member;
import kh.BackendCapstone.entity.chat.ChatMember;
import kh.BackendCapstone.entity.chat.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatMemberRepository extends JpaRepository<ChatMember, Long> {
    List<ChatMember> findByChatRoom(ChatRoom chatRoom);

    Optional<ChatMember> findByMemberAndChatRoom(Member member, ChatRoom chatRoom);
}
