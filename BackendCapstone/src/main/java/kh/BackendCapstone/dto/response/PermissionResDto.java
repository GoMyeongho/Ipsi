package kh.BackendCapstone.dto.response;


import kh.BackendCapstone.constant.Active;
import kh.BackendCapstone.constant.Authority;
import kh.BackendCapstone.entity.Univ;
import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @ToString
@NoArgsConstructor
@AllArgsConstructor
public class PermissionResDto {
	private Long permissionId;
	private String univName;
	private String univDept;
	private Long memberId;
	private String name;
	private String nickname;
	private Authority authority;
	private Active active;
	private String permissionUrl;
	private LocalDateTime regDate;
	private LocalDateTime activeDate;

	// 필요한 필드만 받는 생성자 추가
	public PermissionResDto(Long memberId, String univName, String univDept) {
		this.memberId = memberId;
		this.univName = univName;
		this.univDept = univDept;
	}
	}