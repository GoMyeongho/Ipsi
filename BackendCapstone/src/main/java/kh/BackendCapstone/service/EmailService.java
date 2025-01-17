package kh.BackendCapstone.service;

import kh.BackendCapstone.entity.Member;
import kh.BackendCapstone.entity.SmsAuthToken;
import kh.BackendCapstone.entity.email_auth_token;
import kh.BackendCapstone.repository.EmailAuthTokenRepository;
import kh.BackendCapstone.repository.MemberRepository;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import java.util.Optional;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final EmailAuthTokenRepository emailAuthTokenRepository;
    private final MemberRepository memberRepository;
    private final HttpServletRequest request;

    public EmailService(JavaMailSender mailSender, EmailAuthTokenRepository emailAuthTokenRepository, HttpServletRequest request, MemberRepository memberRepository) {
        this.mailSender = mailSender;
        this.emailAuthTokenRepository = emailAuthTokenRepository;
        this.request = request;
        this.memberRepository = memberRepository;
    }

    // 이메일 전송 메서드 (토큰 발급 및 전송)
    public boolean sendPasswordResetToken(String email) {
        try {
            String resetToken = generateSixDigitToken();
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("비밀번호 찾기 인증번호 입니다");
            String messageText = "안녕하세요, UniGuide입니다. \n 본 메일은 비밀번호 찾기 인증번호 안내 메일입니다. \n" +
                    "로그인 후 회원정보 수정 페이지에서 비밀번호를 변경해 주세요. \n 인증번호(유효기간 5분): ";
            message.setText(messageText + resetToken);

            mailSender.send(message);
            storeToken(email, resetToken);

            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    private String generateSixDigitToken() {
        int token = (int) (Math.random() * 900000) + 100000;
        return String.valueOf(token);
    }

    private void storeToken(String email, String token) {
        Optional<email_auth_token> existingToken = emailAuthTokenRepository.findByEmail(email);
        emailAuthTokenRepository.deleteByEmail(email);

        if(existingToken.isPresent()) {
            emailAuthTokenRepository.delete(existingToken.get());
        }

        email_auth_token authToken = new email_auth_token();
        authToken.setEmail(email);
        authToken.setToken(token);
        authToken.setExpiryTime(System.currentTimeMillis() + 300000);
        emailAuthTokenRepository.save(authToken);
    }

    public boolean verifyEmailToken(String email, String inputToken) {
        Optional<email_auth_token> authToken = emailAuthTokenRepository.findByEmail(email);

        if (authToken.isEmpty()) {
            throw new RuntimeException("토큰이 존재하지 않거나 만료되었습니다.");
        }

        email_auth_token token = authToken.get();

        if (System.currentTimeMillis() > token.getExpiryTime()) {
            emailAuthTokenRepository.delete(token);
            throw new RuntimeException("토큰이 만료되었습니다.");
        }

        boolean isValid = token.getToken().equals(inputToken);
        if (!isValid) {
            throw new IllegalArgumentException("인증번호가 올바르지 않습니다.");
        }
        emailAuthTokenRepository.delete(token);
        request.getSession().setAttribute("email", email); // 수정된 세션 접근 방식
        System.out.println("세션 ID: " + request.getSession().getId());

        return isValid;
    }

    @Transactional

    public void changePassword(String newPassword, PasswordEncoder passwordEncoder) {
        String email = (String) request.getSession().getAttribute("email"); // 수정된 세션 접근 방식
        System.out.println("세션 ID: " + request.getSession().getId());
        if (email == null) {
            throw new RuntimeException("정보가 만료 되었습니다. 인증을 다시 진행해주세요.");
        }

        Optional<Member> memberOptional = memberRepository.findByEmail(email);
        Member member = memberOptional.orElseThrow(() -> new RuntimeException("이메일에 해당하는 회원이 존재하지 않습니다."));

        String encodedPassword = passwordEncoder.encode(newPassword);
        member.setPwd(encodedPassword);
        memberRepository.save(member);
        request.getSession().removeAttribute("email"); // 세션에서 이메일 제거
    }
}
