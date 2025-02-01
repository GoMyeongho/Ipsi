package kh.BackendCapstone.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @ToString
@NoArgsConstructor @AllArgsConstructor
public class PsWriteListResDto {
	// 자기소개서 id
	private Long psWriteId;
	
	// 자기소개서 이름
	private String psName;
	
	// 생성일
	private LocalDateTime regDate;
}
