		package kh.BackendCapstone.entity;

		import kh.BackendCapstone.constant.Authority;

		import lombok.*;

		import javax.persistence.*;
		import java.time.LocalDateTime;

		@Entity @Table(name="member")
		@Getter @Setter @ToString
		@NoArgsConstructor @AllArgsConstructor
		public class Member {



			@Id // 해당 필드를 기본키로 지정
			@Column(name = "member_id")
			@GeneratedValue(strategy = GenerationType.AUTO) //JPA 가 자동으로 생성 전략을 정함
			private Long memberId; // Primary Key
			// nullable=false : null 값이 올 수 없다는 제약 조건
			// length = 50 : 최대 길이(바이트)
			@Column(name = "nick_name")
			private String nickName;
			@Column(nullable = false, unique = true)
			private String email;
			@Column(nullable = false)
			private String pwd;
			@Column(length = 50)
			private String name;

			@Column(length = 50)
			private String type;

			@Column(name = "refresh_token")
			private String refreshToken;
			@Column(name = "nick_name")
			private String nickName;

			@Column(unique = true, length = 13)
			private String phone;
			@Column(name = "member_reg_date")
			private LocalDateTime regDate;
			@Column(length = 50)
			private String type;
			@ManyToOne
			@JoinColumn(name = "univ_id")
			private Univ univ;
			@Enumerated(EnumType.STRING)
			private Authority authority;



			@Builder
			public Member( String nickName, String email, String pwd, String name, String phone, LocalDateTime regDate, Authority authority, Univ univ) {
				this.nickName = nickName;
				this.email = email;
				this.pwd = pwd;
				this.name = name;
				this.phone = phone;
				this.regDate = regDate;
				this.authority = authority; // Enum 타입
				this.univ = univ;
			}

		}