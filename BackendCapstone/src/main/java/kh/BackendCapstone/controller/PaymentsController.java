package kh.BackendCapstone.controller;

import kh.BackendCapstone.dto.request.PaymentsReqDto;
import kh.BackendCapstone.dto.response.PaymentsResDto;
import kh.BackendCapstone.service.PaymentsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Slf4j // 로깅 기능 추가
@RequiredArgsConstructor // final 필드와 @NonNull 필드에 대해 생성자를 자동으로 생성
@RestController // 해당 클래스가 RESTful 웹 서비스를 처리하는 컨트롤러임을 나타냄, 모든 메서드의 반환 값은 자동으로 JSON 형태로 변환되어 HTTP 응답 본문에 포함됨
@RequestMapping("/api/v1/payments") // HTTP 요청의 URL(을) 특정 클래스나 메서드와 매핑
@CrossOrigin(origins = "http://localhost:3000") // CORS(Cross-Origin Resource Sharing)**를 설정
public class PaymentsController {
    private final PaymentsService paymentsService;

    @PostMapping("confirm")
    public ResponseEntity<PaymentsResDto> confirmPayment(
            @Validated @RequestBody PaymentsReqDto paymentsRequestDto) {
        PaymentsResDto response = paymentsService.confirmPayments(paymentsRequestDto);
        return ResponseEntity.ok(response);
    }
}
