package kh.BackendCapstone.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import lombok.extern.java.Log;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class PsWriteReqDto {
    // 작성자
    private Long memberId;

    // 자기소개서 id
    @JsonProperty("psWriteId")
    private Long psWriteId;

    // 자기소개서 이름
    private String psName;
}
