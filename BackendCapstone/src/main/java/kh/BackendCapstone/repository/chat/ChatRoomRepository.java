package kh.BackendCapstone.repository.chat;

import kh.BackendCapstone.entity.chat.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatRoomRepository extends JpaRepository<ChatRoom,String> {
    List<ChatRoom> findAllByOrderByCreatedAtDesc();
    List<ChatRoom> findAllByCategory(String category);
}
