package kh.BackendCapstone.dto.response;

import lombok.*;

@Getter @Setter @ToString
@NoArgsConstructor
@AllArgsConstructor
public class MemberPermissionResDto {
    private Long memberId;
    private String univName;
    private String univDept;

}
