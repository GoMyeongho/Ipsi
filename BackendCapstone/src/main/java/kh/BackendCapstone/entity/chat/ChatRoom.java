package kh.BackendCapstone.entity.chat;


import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "chatRoom")
public class ChatRoom {
    @Id
    @Column(name = "room_id")
    private String roomId;

    @Column(name = "category")
    private String category; //카테고리(증상, 지역)

    @Column(name = "room_name")
    private String roomName; //방제목

    @Column(name = "created_at")
    private LocalDateTime createdAt; //방 생성시간

    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Chat> chats = new ArrayList<>(); //채팅방 대화 내용 저장

    private String active;
}
