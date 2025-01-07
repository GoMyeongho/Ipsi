package kh.BackendCapstone.dto.response;

import kh.BackendCapstone.entity.Member;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MemberResDto {
	private String email;
	private String name;
	private LocalDateTime regDate;

	
	public static MemberResDto of(Member member) {
		return MemberResDto.builder()
			.name(member.getName())
			.email(member.getEmail())
			.regDate(member.getRegDate())
			.build();
	}
}
