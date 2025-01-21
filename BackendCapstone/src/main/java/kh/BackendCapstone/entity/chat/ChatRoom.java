package kh.BackendCapstone.entity.chat;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import kh.BackendCapstone.constant.ChatRoomType;
import kh.BackendCapstone.entity.Member;
import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "chatRoom")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoom {
    @Id
    @Column(name = "room_id")
    private String roomId;

    @Column(name = "room_name", length = 20, nullable = false)
    @Size(max = 20, message = "채팅방 이름은 최대 20자 입력 가능")
    private String roomName; // 방제목

    @Column(name = "created_at")
    private LocalDateTime regDate; // 방 생성 시간

    @Enumerated(EnumType.STRING)
    @Column(name = "room_type", nullable = false)
    private ChatRoomType roomType; // 채팅방 유형: PRIVATE or GROUP

    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Chat> chats = new ArrayList<>(); // 채팅방 대화 내용 저장

    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChatMember> chatMember = new ArrayList<>();

    // 채팅방 최대 멤버 수 설정
    @Column(name = "max_members", nullable = false)
    private int maxMembers; // 최대 입장 가능 인원

    // 기본값 설정
    @PrePersist
    public void prePersist() {
        if (this.roomType == null) {
            this.roomType = ChatRoomType.PRIVATE;
        }
    }
}
