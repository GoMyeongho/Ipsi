package kh.BackendCapstone.dto.request;

import lombok.*;

@Getter @Setter @ToString
@NoArgsConstructor @AllArgsConstructor
public class CommentReqDto {    // 댓글 쓰기
	private Long commentId;
	private Long boardId;
	private String content;
}
