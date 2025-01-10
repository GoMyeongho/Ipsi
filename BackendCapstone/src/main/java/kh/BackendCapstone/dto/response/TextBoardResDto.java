package kh.BackendCapstone.dto.response;


import kh.BackendCapstone.constant.TextCategory;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter @NoArgsConstructor @ToString
public class TextBoardResDto {
	private Long boardId;
	private String title;
	private String content;
	private LocalDateTime regDate;
	private String nickName;
	private TextCategory textCategory;
}
