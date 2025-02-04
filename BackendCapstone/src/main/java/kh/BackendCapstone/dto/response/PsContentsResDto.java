package kh.BackendCapstone.dto.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@Builder
@ToString
@NoArgsConstructor
public class PsContentsResDto {
    // 항목 ID
    private Long psContentsId;

    // 항목 제목
    private String psTitle;

    // 항목 내용
    private String psContent;
}
