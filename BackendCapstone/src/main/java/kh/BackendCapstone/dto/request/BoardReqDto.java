package kh.BackendCapstone.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BoardReqDto {
	private String title;
	private String content;
	private String imgPath;
	private String email;
}
