package kh.BackendCapstone.dto.response;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

// 자소서,생기부 구매 현황 관련
public class FilePurchaseStatusResDto {
    private Long fileId;
    private boolean purchased;
}
