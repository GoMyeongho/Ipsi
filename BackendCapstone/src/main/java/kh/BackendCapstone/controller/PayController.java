package kh.BackendCapstone.controller;

import kh.BackendCapstone.constant.FileCategory;
import kh.BackendCapstone.dto.request.PayReqDto;
import kh.BackendCapstone.dto.response.PayResDto;
import kh.BackendCapstone.service.PayService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j // 로깅 기능 추가
@RequiredArgsConstructor // final 필드와 @NonNull 필드에 대해 생성자를 자동으로 생성
@RestController // 해당 클래스가 RESTful 웹 서비스를 처리하는 컨트롤러임을 나타냄, 모든 메서드의 반환 값은 자동으로 JSON 형태로 변환되어 HTTP 응답 본문에 포함됨
@RequestMapping("/pay") // HTTP 요청의 URL(을) 특정 클래스나 메서드와 매핑
@CrossOrigin(origins = "http://localhost:3000") // CORS(Cross-Origin Resource Sharing)**를 설정, 이 경우 http://localhost:3000에서 오는 요청을 허용

public class PayController {
    private final PayService payService;

    // 결제 정보를 저장하는 메서드
    @PostMapping("/save")
    public PayReqDto savePay(
            @RequestParam Long fileBoardId,
            @RequestParam Long memberId,
            @RequestParam String orderId) { // orderId를 추가로 받음
        return payService.savePay(fileBoardId, memberId, orderId); // service에 전달
    }

    // 결제 완료 처리 메서드 (orderId로 결제 완료 처리)
    @PostMapping("/complete/{orderId}")
    public void completePayment(@PathVariable String orderId) {
//        log.info(orderId);
        payService.completePayment(orderId); // service에서 결제 완료 처리
    }

    // 구매한 자소서 내역 확인
    @GetMapping("/purchasedEnumPS")
    public List<PayResDto> getPurchasedPSItems(      @RequestParam Long memberId,
                                                   @RequestParam("fileCategory") FileCategory fileCategory,
                                                     @RequestParam String status) {
//        log.info("Fetching purchased items for member ID: {} with fileCategory: {}", memberId, fileCategory);
        return payService.getPurchasedData(memberId, fileCategory, status);
    }

    // 구매한 생기부 내역 확인
    @GetMapping("/purchasedEnumSR")
    public List<PayResDto> getPurchasedISRtems(      @RequestParam Long memberId,
                                                   @RequestParam("fileCategory") FileCategory fileCategory,
                                                     @RequestParam String status) {
//        log.info("Fetching purchased items for member ID: {} with fileCategory: {}", memberId, fileCategory);
        return payService.getPurchasedData(memberId, fileCategory, status);
    }

}