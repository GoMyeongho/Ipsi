package kh.BackendCapstone.dto.request;


import kh.BackendCapstone.constant.Authority;
import kh.BackendCapstone.entity.Member;
import kh.BackendCapstone.entity.Univ;
import lombok.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

// DTO : 다른 레이어 간의 데이터를 교환할 때 사용
// 주로 Frontend 와 Backend 사이에 데이터를 주고받는 용도
// 회원 가입용

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MemberReqDto {
	private String email;
	private String pwd;
	private String name;
	private String phone;
	private String nickname;





	public Member toEntity(PasswordEncoder passwordEncoder) {
		return Member.builder()
				.email(email)
				.pwd(passwordEncoder.encode(pwd))
				.nickName(nickname)
				.name(name)
				.phone(phone)
				.regDate(LocalDateTime.now()) // 가입 날짜 자동 설정
				.authority(Authority.ROLE_USER) // 기본 권한 설정
				.build();
	}
	public UsernamePasswordAuthenticationToken toAuthentication() {
		return new UsernamePasswordAuthenticationToken(email, pwd);
	}
}
