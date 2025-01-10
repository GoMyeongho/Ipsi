package kh.BackendCapstone.entity.chat;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import kh.BackendCapstone.constant.Active;
import kh.BackendCapstone.entity.Member;
import lombok.*;

import javax.persistence.*;
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

    @Column(name = "room_name")
    private String roomName; // 방제목

    @Column(name = "created_at")
    private LocalDateTime regDate; // 방 생성 시간
    
    @Enumerated(EnumType.STRING)
    private Active access;
    
    @Enumerated(EnumType.STRING)
    private Active active;

    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Chat> chats = new ArrayList<>(); // 채팅방 대화 내용 저장
    
    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChatRoomMember> members = new ArrayList<>(); // 채팅방 멤버들
}
