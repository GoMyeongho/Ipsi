package kh.BackendCapstone.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

// 토스페이먼츠 샌드박스 결제시스템 관련
public class PaymentsResDto {
    private boolean success;
    private String message;
    private Object data;
}
