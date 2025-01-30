package kh.BackendCapstone.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PsWriteReqDto {
    // 작성자
    private Long memberId;

    // 자기소개서 이름
    private String psName;
}
