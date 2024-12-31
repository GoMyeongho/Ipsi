package kh.BackendCapstone.entity.chat;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
    @Column(name = "id")
    private Long id;

    @Column(name = "sender")
    private String sender;

    @Column(name = "profile")
    private String profile;

    @Column(name = "nickName")
    private String nickName;

    @Column(name = "msg")
    private String msg;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    @JsonIgnore
    private ChatRoom chatRoom;

    @ElementCollection
    @CollectionTable(
            name = "chat_member",
            joinColumns = @JoinColumn(name = "chat_id")
    )
    @Column(name = "member")
    private List<String> members;

    private String active;
}
