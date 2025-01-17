package kh.BackendCapstone.service;

import kh.BackendCapstone.entity.SmsAuthToken;
import kh.BackendCapstone.repository.SmsAuthTokenRepository;
import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.model.Message;
import net.nurigo.sdk.message.service.DefaultMessageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class SmsService {
    private static final Logger logger = LoggerFactory.getLogger(SmsService.class);
    private final DefaultMessageService messageService;
    private final SmsAuthTokenRepository smsAuthTokenRepository;

    public SmsService(SmsAuthTokenRepository smsAuthTokenRepository) {
        this.messageService = NurigoApp.INSTANCE.initialize(
                "NCSA2P34FVE6IQAD",
                "JRSY3JEUEFF2NZM0WBZGLYO1CM9FGXQK",
                "https://api.coolsms.co.kr"
        );
        this.smsAuthTokenRepository = smsAuthTokenRepository;
    }

    // 인증번호를 전송하는 메서드
    public boolean sendVerificationCode(String phone) {
        try {
            String verificationCode = generateSixDigitCode();

            Message message = new Message();
            message.setFrom("01052218948");
            message.setTo(phone);
            message.setText("인증번호: " + verificationCode);
            messageService.send(message);

            saveVerificationCode(phone, verificationCode);

            // 인증번호 저장 여부 확인
            boolean isSaved = smsAuthTokenRepository.findByPhone(phone)
                    .map(token -> token.getToken().equals(verificationCode))
                    .orElse(false);

            if (isSaved) {
                logger.info("인증번호 발송 성공: {}", verificationCode);
                return true;
            } else {
                logger.error("인증번호 저장 실패");
                return false;
            }
        } catch (Exception e) {
            logger.error("SMS 발송 실패: {}", e.getMessage());
            return false;
        }
    }

    // 6자리 인증번호 생성
    private String generateSixDigitCode() {
        int code = (int) (Math.random() * 900000) + 100000; // 100000 ~ 999999 사이의 숫자 생성
        return String.valueOf(code);
    }

    // 인증번호를 DB에 저장하는 메서드
    @Transactional
    public void saveVerificationCode(String phone, String verificationCode) {
        // 전화번호로 기존 인증번호가 있는지 확인
        Optional<SmsAuthToken> existingToken = smsAuthTokenRepository.findByPhone(phone);

        if (existingToken.isPresent()) {
            // 기존 인증번호 삭제
            smsAuthTokenRepository.delete(existingToken.get());
        }

        // 새로운 인증번호 저장
        SmsAuthToken authToken = new SmsAuthToken();
        authToken.setPhone(phone);
        authToken.setToken(verificationCode);
        authToken.setExpiryTime(System.currentTimeMillis() + 300000); // 5분 유효
        smsAuthTokenRepository.save(authToken); // DB에 저장
    }

    // 입력된 인증번호를 검증하는 메서드
    public boolean verifySmsCode(String phone, String inputCode) {
        Optional<SmsAuthToken> authToken = smsAuthTokenRepository.findByPhone(phone);

        if (authToken.isEmpty()) {
            logger.warn("인증번호가 존재하지 않거나 만료되었습니다. phone: {}", phone);
            throw new IllegalArgumentException("인증번호가 존재하지 않거나 만료되었습니다.");
        }

        SmsAuthToken token = authToken.get();

        if (System.currentTimeMillis() > token.getExpiryTime()) {
            smsAuthTokenRepository.delete(token); // 만료된 토큰 삭제
            logger.warn("인증번호가 만료되었습니다. phone: {}", phone);
            throw new IllegalArgumentException("인증번호가 만료되었습니다.");
        }

        boolean isValid = token.getToken().equals(inputCode);
        if (!isValid) {
            logger.warn("잘못된 인증번호 입력. phone: {}, 입력된 코드: {}", phone, inputCode);
            throw new IllegalArgumentException("인증번호가 올바르지 않습니다.");
        }

        return isValid;
    }
}
