package kh.BackendCapstone.dto.response;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter @NoArgsConstructor
public class BoardResDto {
	private Long boardId;
	private String title;
	private String content;
	private String imgPath;
	private LocalDateTime regDate;
	private String email;
	private List<CommentResDto> comments;
}
