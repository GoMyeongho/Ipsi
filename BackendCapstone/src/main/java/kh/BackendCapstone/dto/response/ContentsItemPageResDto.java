package kh.BackendCapstone.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString

// 자소서,생기부 자료 렌더링 관련
public class ContentsItemPageResDto {
    private List<FileBoardResDto> content;
    private int totalPages;
    private List<FilePurchaseStatusResDto> purchasedFileIds; // 구매된 파일 ID 목록
}
