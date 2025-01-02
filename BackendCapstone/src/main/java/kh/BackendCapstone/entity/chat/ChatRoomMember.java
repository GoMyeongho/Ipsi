package kh.BackendCapstone.entity.chat;

import kh.BackendCapstone.entity.Member;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;


@Entity
@Getter
@Setter
public class ChatRoomMember {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id; // 고유 ID (자동 생성)
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "room_id")
	private ChatRoom chatRoom; // 채팅방
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "member_id")
	private Member member; // 채팅방 멤버
	
	@Column(name = "active")
	private boolean active; // 멤버의 채팅방 참여 상태
	
	@Column(name = "joined_reg_date")
	private LocalDateTime regDate; // 멤버가 채팅방에 들어온 시간
	
	@Column(name = "left_date")
	private LocalDateTime leftDate; // 멤버가 채팅방을 떠난 시간
	
	@PrePersist
	public void prePersist() {
		if (regDate == null) {
			regDate = LocalDateTime.now(); // 입장 시간 자동 설정
		}
	}
	@PreUpdate
	public void preUpdate() {
		if (!this.active && this.leftDate == null) {
			this.leftDate = LocalDateTime.now(); // 퇴장 시각 설정
		}
	}
}
