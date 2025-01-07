package kh.BackendCapstone.dto.request;

import kh.BackendCapstone.constant.TextCategory;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class TextBoardReqDto {
	private String title;
	private String content;
	private String textCategory;
	private String email;
}
