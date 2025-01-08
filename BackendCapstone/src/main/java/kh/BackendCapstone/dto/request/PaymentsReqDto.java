package kh.BackendCapstone.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class PaymentsReqDto {
    @NotBlank
    private String paymentKey;

    @NotBlank
    private String orderId;

    @NotNull
    private Integer amount;
}
