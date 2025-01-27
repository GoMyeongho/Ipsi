package kh.BackendCapstone.entity.chat;

import com.fasterxml.jackson.annotation.JsonIgnore;
import kh.BackendCapstone.constant.Active;
import kh.BackendCapstone.entity.Member;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import javax.persistence.*;

@NoArgsConstructor
@Getter @Setter @ToString @Entity
public class ChatMember {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private ChatRoom chatRoom;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;
}
