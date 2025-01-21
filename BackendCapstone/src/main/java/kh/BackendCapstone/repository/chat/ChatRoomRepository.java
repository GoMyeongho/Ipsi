package kh.BackendCapstone.repository.chat;

import kh.BackendCapstone.entity.chat.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom,String> {
    List<ChatRoom> findAllByOrderByRegDateAsc();
}
