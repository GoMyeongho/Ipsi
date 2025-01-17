package kh.BackendCapstone.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PayReqDto {
    private Long payId;          // 결제 ID
    private Long fileId;         // FileBoard의 ID
    private Long memberId;       // Member의 ID
    private LocalDateTime regDate; // 결제 등록 날짜
    private String status;       // 결제 상태 (예: PENDING, APPROVED, FAILED)
    private String productName;  // 제품 이름
    private int productPrice;    // 제품 가격
}
