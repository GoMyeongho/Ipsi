package kh.BackendCapstone.entity;

import kh.BackendCapstone.constant.Authority;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "member")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Member {

    @Id // 해당 필드를 기본키로 지정
    @Column(name = "member_id")
    @GeneratedValue(strategy = GenerationType.AUTO) //JPA 가 자동으로 생성 전략을 정함
    private Long memberId; // Primary Key
    // nullable=false : null 값이 올 수 없다는 제약 조건
    // length = 50 : 최대 길이(바이트)
    @Column(unique = true)
    private String userId; // 고유 사용자 ID (소셜 또는 직접 가입)
    @Column(name = "nick_name")
    private String nickName;
    @Column(nullable = false, unique = true)
    private String email;
    @Column(nullable = false)
    private String pwd;
    @Column(length = 50)
    private String name;

    @Column(length = 50)
    private String type; // 가입 방식 (예: "kakao", "naver", "direct")
    @Column(name = "revenue", nullable = false)
    private int revenue = 0; // 기본값 0으로 설정

    @Column(name = "refresh_token")
    private String refreshToken;

    @Column(unique = true, length = 13)
    private String phone;
    @Column(name = "member_reg_date")
    private LocalDateTime regDate;

    @ManyToOne
    @JoinColumn(name = "univ_id")
    private Univ univ;
        @Enumerated(EnumType.STRING)
        private Authority authority;

    @Builder
    public Member(String nickName, String email, String pwd, String name, String phone, LocalDateTime regDate, Authority authority, Univ univ) {
        this.nickName = nickName;
        this.email = email;
        this.pwd = pwd;
        this.name = name;
        this.phone = phone;
        this.regDate = regDate;
        this.authority = authority; // Enum 타입
        this.univ = univ;
    }
  public Member(String userId, String email, String type) {
				this.userId = userId;
				this.pwd = "password";
				this.email = email;
				this.type = type;
				this.authority = Authority.valueOf("ROLE_USER");

			}

}

