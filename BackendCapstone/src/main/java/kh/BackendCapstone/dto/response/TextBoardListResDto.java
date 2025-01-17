package kh.BackendCapstone.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @ToString @NoArgsConstructor @AllArgsConstructor
public class TextBoardListResDto {
	private Long boardId;
	private String title;
	private LocalDateTime regDate;
	private String nickName;
	private String summary;
}
