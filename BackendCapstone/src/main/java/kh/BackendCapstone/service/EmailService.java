package kh.BackendCapstone.service;

import kh.BackendCapstone.entity.Member;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final TokenService tokenService;

    public EmailService(JavaMailSender mailSender, TokenService tokenService) {
        this.mailSender = mailSender;
        this.tokenService = tokenService;
    }

    // 이메일 전송 메서드 (토큰 발급 및 전송)
    public boolean sendPasswordResetToken(Member member) {
        try {
            // 예시로 6자리 인증번호 생성
            String resetToken = generateSixDigitToken();

            // 이메일 내용 설정
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(member.getEmail());
            message.setSubject("비밀번호 찾기 인증번호 입니다");
            String messageText = "안녕하세요, UniGuide입니다. \n 본 메일은 비밀번호 찾기 인증번호 안내 메일입니다. \n" +
                    "로그인 후 회원정보 수정 페이지에서 비밀번호를 변경해 주세요. \n 인증번호(유효기간 5분): ";
            message.setText(messageText + resetToken);

            // 이메일 전송
            mailSender.send(message);

            // 토큰 저장 (이메일과 토큰을 저장)
            tokenService.storeToken(member.getEmail(), resetToken);

            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // 6자리 랜덤 인증번호 생성
    private String generateSixDigitToken() {
        int token = (int) (Math.random() * 900000) + 100000;  // 100000 ~ 999999 사이의 숫자 생성
        return String.valueOf(token);
    }
}
