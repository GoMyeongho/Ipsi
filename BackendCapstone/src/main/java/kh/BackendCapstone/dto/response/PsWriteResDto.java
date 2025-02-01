package kh.BackendCapstone.dto.response;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PsWriteResDto {
    // 자기소개서 id
    private Long psWriteId;

    // 작성자
    private Long memberId;

    // 자기소개서 이름
    private String psName;

    // 생성일
    private LocalDateTime regDate;

    // 자기소개서 항목 리스트
    private List<PsContentsResDto> psContents;
}
