package kh.BackendCapstone.service;

import kh.BackendCapstone.entity.Member;
import kh.BackendCapstone.entity.email_auth_token;
import kh.BackendCapstone.repository.EmailAuthTokenRepository;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final EmailAuthTokenRepository emailAuthTokenRepository;

    public EmailService(JavaMailSender mailSender, EmailAuthTokenRepository emailAuthTokenRepository) {
        this.mailSender = mailSender;
        this.emailAuthTokenRepository = emailAuthTokenRepository;
    }

    // 이메일 전송 메서드 (토큰 발급 및 전송)
    public boolean sendPasswordResetToken(Member member) {
        try {
            // 6자리 인증번호 생성
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

            // 토큰을 DB에 저장 (이메일과 토큰을 저장)
            storeToken(member.getEmail(), resetToken);

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

    // 이메일과 토큰을 DB에 저장
    private void storeToken(String email, String token) {
        // 기존에 있던 토큰 삭제
        emailAuthTokenRepository.deleteByEmail(email);

        // 새로운 토큰 저장
        email_auth_token authToken = new email_auth_token();
        authToken.setEmail(email);
        authToken.setToken(token);
        authToken.setExpiryTime(System.currentTimeMillis() + 300000); // 5분 유효
        emailAuthTokenRepository.save(authToken);  // DB에 저장
    }

    // 입력된 토큰을 검증하는 메서드
    public boolean verifyEmailToken(String email, String inputToken) {
        Optional<email_auth_token> authToken = emailAuthTokenRepository.findByEmail(email);

        if (authToken.isEmpty()) {
            throw new RuntimeException("토큰이 존재하지 않거나 만료되었습니다.");
        }

        email_auth_token token = authToken.get();

        if (System.currentTimeMillis() > token.getExpiryTime()) {
            emailAuthTokenRepository.delete(token);  // 만료된 토큰은 삭제
            throw new RuntimeException("토큰이 만료되었습니다.");
        }

        return token.getToken().equals(inputToken);
    }
}
