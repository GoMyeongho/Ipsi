package kh.BackendCapstone.dto.request;

import kh.BackendCapstone.constant.Authority;
import lombok.*;

@Getter @Setter @ToString
@NoArgsConstructor @AllArgsConstructor
public class AdminMemberReqDto {
	private Long memberId;
	private Authority authority;
	private Long univId;
}
