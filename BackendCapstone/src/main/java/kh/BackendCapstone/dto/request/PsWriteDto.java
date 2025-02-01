package kh.BackendCapstone.dto.request;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class PsWriteDto {
    private PsWriteReqDto psWriteReqDto;  // 자기소개서 기본 정보
    private List<PsContentsReqDto> psContentsReqDtoList;
}
