package kh.BackendCapstone.entity;

import kh.BackendCapstone.constant.Authority;
import kh.BackendCapstone.entity.chat.ChatRoomMember;
import lombok.*;
import org.checkerframework.common.value.qual.StringVal;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity @Table(name="member")
@Getter @Setter @ToString
@NoArgsConstructor @AllArgsConstructor
public class Member {
	@Id // 해당 필드를 기본키로 지정
	@Column(name = "member_id")
	@GeneratedValue(strategy=GenerationType.AUTO) //JPA 가 자동으로 생성 전략을 정함
	private Long memberId; // Primary Key
	// nullable=false : null 값이 올 수 없다는 제약 조건
	// length = 50 : 최대 길이(바이트)
	@Column(nullable = false, unique = true)
	private String email;
	@Column(nullable=false)
	private String pwd;
	@Column(length = 50)
	private String name;
	@Column(length = 50)
	private String nickName;
	@Column(unique = true, length = 13)
	private String phone;
	@Column(name="member_reg_date")
	private LocalDateTime regDate;
	
	@ManyToOne
	@JoinColumn(name="univ_id")
	private Univ univ;
	
	@Enumerated(EnumType.STRING)
	private Authority authority;
	
	private String refreshToken;
	
	@OneToMany(mappedBy = "member", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<ChatRoomMember> chatRoomMembers = new ArrayList<>();
	
	@Builder
	public Member(String email, String pwd, String name, Authority authority) {
		this.email = email;
		this.pwd = pwd;
		this.name = name;
		this.authority = authority;
		this.regDate = LocalDateTime.now();
	}
}
