package kh.BackendCapstone.dto.response;


import com.kh.springJpa241217.entity.Member;
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
	private String imgPath;
	
	public static MemberResDto of(Member member) {
		return MemberResDto.builder()
			.name(member.getName())
			.email(member.getEmail())
			.imgPath(member.getImgPath())
			.regDate(member.getRegDate())
			.build();
	}
}
