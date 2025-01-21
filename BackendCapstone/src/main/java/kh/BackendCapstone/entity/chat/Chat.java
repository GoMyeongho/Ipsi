package kh.BackendCapstone.entity.chat;

import com.fasterxml.jackson.annotation.JsonIgnore;
import kh.BackendCapstone.entity.Member;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "chat")
public class Chat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chat_id")
    private Long chatId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @Column(name = "sender")
    private String sender;

    @Column(name = "profile")
    private String profile;

    @Column(name = "nickName")
    private String nickName;

    @Column(name = "msg")
    private String msg; // 전송 내용

    @Column(name = "sent_at")
    private LocalDateTime regDate;   // 전송 시간
//    private String regDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    @JsonIgnore
    private ChatRoom chatRoom;
}
