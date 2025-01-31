package kh.BackendCapstone.dto.request;

import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode
public class PsContentsReqDto {
    // 항목 제목
    private String psTitle;

    // 항목 내용
    private String psContent;

    // 항목 번호
    private Integer sectionsNum;
    
    private Long psContentsId;
}
