package kh.BackendCapstone.repository.chat;

import kh.BackendCapstone.entity.chat.Chat;
import kh.BackendCapstone.entity.chat.ChatRoom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ChatRepository extends JpaRepository <Chat, String> {
    @Query(value = "SELECT * FROM chat WHERE room_id = ?1 ORDER BY sent_at ASC LIMIT 50", nativeQuery = true)
    List<Chat> findRecentMsg(String roomId);
    Page<Chat> findAllByOrderByIdDesc(Pageable pageable);

    Optional<List<Chat>> findByChatRoom(ChatRoom chatRoom);

    Optional<Chat> findById(Long chatId);
}
