package kh.BackendCapstone.service;

import kh.BackendCapstone.constant.Authority;
import kh.BackendCapstone.constant.FileCategory;
import kh.BackendCapstone.dto.request.PayReqDto;
import kh.BackendCapstone.dto.response.FilePurchaseStatusResDto;
import kh.BackendCapstone.dto.response.PayResDto;
import kh.BackendCapstone.entity.FileBoard;
import kh.BackendCapstone.entity.Member;
import kh.BackendCapstone.entity.Pay;
import kh.BackendCapstone.repository.FileBoardRepository;
import kh.BackendCapstone.repository.MemberRepository;
import kh.BackendCapstone.repository.PayRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class PayService {

    private final PayRepository payRepository; // Pay 엔티티 저장소 추가
    private final FileBoardRepository fileBoardRepository;
    private final MemberRepository memberRepository;

    // 메모리에 저장된 결제 정보를 저장하는 Map (orderId -> PayReqDto)
    private final Map<String, PayReqDto> paymentMap = new ConcurrentHashMap<>();

    // 결제 정보 저장 메서드 (DB에 저장)
    public PayReqDto savePay(Long fileId, Long memberId, String orderId) {
        // FileBoard와 Member 객체를 가져옵니다.
        FileBoard fileBoard = fileBoardRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("파일을 찾을 수 없습니다."));
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        log.info("파일 정보: {}", fileBoard); // fileBoard 정보 로그
        log.info("회원 정보: {}", member); // member 정보 로그

        // 새로운 결제 정보 생성 (DB에 저장)
        Pay pay = new Pay();
        pay.setFileBoard(fileBoard);
        pay.setMember(member);
        pay.setPrice(fileBoard.getPrice()); // 파일의 가격 정보를 저장
        pay.setPurchased(false); // 처음에는 구매하지 않음
        pay.setStatus("PENDING"); // 상태는 "PENDING"
        pay = payRepository.save(pay); // DB에 저장

        PayReqDto payReqDto = new PayReqDto(
                pay.getPayId(),  // DB에서 생성된 payId
                fileBoard.getFileId(),
                member.getMemberId(),
                pay.getRegDate(),  // DB에서 생성된 regDate
                pay.getStatus(),
                fileBoard.getTitle(),
                pay.getPrice() // 저장된 가격 정보 추가
        );

        // 주문 ID(orderId)를 메모리에 저장
        paymentMap.put(orderId, payReqDto);
        log.info("orderId: {}", orderId);
        log.info("paymentMap에 저장된 데이터: {}", paymentMap);

        return payReqDto;
    }

    // 결제 완료 처리 메서드 (DB에 상태 업데이트 및 금액 분배)
    public void completePayment(String orderId) {
        // 메모리에서 orderId로 결제 정보 찾기
        PayReqDto payReqDto = paymentMap.get(orderId);
        if (payReqDto == null) {
            throw new RuntimeException("결제 요청 정보가 메모리에 존재하지 않습니다.");
        }

        log.info("결제 완료 처리 시작: {}", payReqDto);

        // DB에서 해당 결제 정보 찾기
        Pay pay = payRepository.findById(payReqDto.getPayId())
                .orElseThrow(() -> new RuntimeException("결제 정보를 DB에서 찾을 수 없습니다."));

        // 파일 등록자와 관리자 정보 가져오기
        FileBoard fileBoard = pay.getFileBoard();
        Member fileOwner = fileBoard.getMember(); // 파일을 등록한 사용자
        Member admin = memberRepository.findByAuthority(Authority.ROLE_ADMIN) // 관리자 조회
                .orElseThrow(() -> new RuntimeException("관리자 정보를 찾을 수 없습니다."));

        // 금액 분배 로직
        int price = pay.getPrice();
        int adminShare = (int) (price * 0.1); // 관리자는 10% 수수료
        int ownerShare = price - adminShare; // 나머지는 파일 등록자에게 지급

        // Pay 엔티티에 금액 분배 설정
        pay.setFileOwnerAmount(ownerShare);
        pay.setAdminAmount(adminShare);

        // 금액 분배
        fileOwner.setRevenue(fileOwner.getRevenue() + ownerShare);
        admin.setRevenue(admin.getRevenue() + adminShare);

        memberRepository.save(fileOwner);
        memberRepository.save(admin);

        log.info("금액 분배: 등록자 {}에게 {} 지급, 관리자 {}에게 {} 지급",
                fileOwner.getName(), ownerShare, admin.getName(), adminShare);

        // 결제 상태를 "COMPLETED"로 업데이트
        pay.setStatus("COMPLETED");

        // purchased 값을 true(로) 설정
        pay.setPurchased(true);

        payRepository.save(pay); // DB에 상태 업데이트

        log.info("결제 완료 처리 후: {}", pay);

        // 메모리에서 삭제
        paymentMap.remove(orderId);
        log.info("paymentMap에서 결제 정보 삭제: {}", orderId);
    }

    // 구매유무 반환
    public List<FilePurchaseStatusResDto> getPurchasedFileStatusesByMemberId(Long memberId) {
        List<Pay> payList = payRepository.findByMember_MemberId(memberId);
        return payList.stream()
                .map(pay -> new FilePurchaseStatusResDto(
                        pay.getFileBoard().getFileId(),
                        pay.isPurchased()
                ))
                .collect(Collectors.toList());
    }

    // 내가 구매한 자료 가져오기
    public List<PayResDto> getPurchasedData(Long memberId, FileCategory fileCategory, String status) {
        // fileCategory(를) "PERSONAL_STATEMENT", "STUDENT_RECORD" 파라미터로 받는 방식으로 처리
        List<Pay> pays = payRepository.findByMember_MemberIdAndFileBoard_FileCategoryAndStatus(memberId, fileCategory, status);

        return pays.stream().map(pay -> new PayResDto(
                pay.getPayId(),
                pay.getPrice(),
                pay.getRegDate(),
                pay.getStatus(),
                pay.getFileBoard().getFileId(),
                pay.getFileBoard().getTitle(),
                pay.getFileBoard().getMainFile(),
                pay.getFileBoard().getPreview(),
                pay.getFileBoard().getKeywords(),
                pay.getFileBoard().getSummary(),
                pay.getFileBoard().getRegDate(),
                pay.getFileBoard().getMember().getName(),
                pay.getFileBoard().getUniv().getUnivImg(),
                pay.getFileBoard().getUniv().getUnivName(),
                pay.getFileBoard().getUniv().getUnivDept()
        )).collect(Collectors.toList());
    }

}
