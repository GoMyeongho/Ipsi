package kh.BackendCapstone.repository.chat;

import com.hopeback.entity.chat.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatRoomRepository extends JpaRepository<ChatRoom,String> {
    List<ChatRoom> findAllByOrderByCreatedAtDesc();
    List<ChatRoom> findAllByCategory(String category);
}
