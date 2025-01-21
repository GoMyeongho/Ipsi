package kh.BackendCapstone.service;

import kh.BackendCapstone.dto.TokenDto;
import kh.BackendCapstone.dto.request.MemberReqDto;
import kh.BackendCapstone.entity.Member;
import kh.BackendCapstone.entity.RefreshToken;
import kh.BackendCapstone.repository.MemberRepository;
import kh.BackendCapstone.repository.RefreshTokenRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.TestPropertySource;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestPropertySource(locations = "classpath:application-test.properties")
class LoginServiceTest {

    @Autowired
    private MemberService memberService;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthService authService;

    @Test
    @DisplayName("로그인 테스트")
    void loginServiceTest() {
        // Given
        // 이미 가입된 회원이 있다고 가정
        Member member = memberRepository.findByEmail("test@example.com")
                .orElseThrow(() -> new RuntimeException("회원이 존재하지 않습니다."));

        MemberReqDto loginRequest = MemberReqDto.builder()
                .email("test@example.com")
                .pwd("password123")
                .build();

        // When: 로그인 시도
        TokenDto tokenDto = authService.login(loginRequest);

        // Then: 로그인 성공 체크
        assertNotNull(tokenDto);
        assertNotNull(tokenDto.getAccessToken());
        assertNotNull(tokenDto.getRefreshToken());

        // RefreshToken 저장 확인
        RefreshToken refreshToken = refreshTokenRepository.findByMember(member).orElse(null);
        assertNotNull(refreshToken);
        assertEquals(tokenDto.getRefreshToken() + "=", refreshToken.getRefreshToken());

        // 예외 테스트: 존재하지 않는 이메일
        MemberReqDto invalidEmailRequest = MemberReqDto.builder()
                .email("notexist@example.com")
                .pwd("password123")
                .build();
        Exception exception1 = assertThrows(RuntimeException.class, () -> {
            authService.login(invalidEmailRequest);
        });
        assertEquals("존재하지 않는 이메일입니다.", exception1.getMessage());

        // 예외 테스트: 잘못된 비밀번호
        MemberReqDto invalidPasswordRequest = MemberReqDto.builder()
                .email("test@example.com")
                .pwd("wrongpassword")
                .build();
        Exception exception2 = assertThrows(RuntimeException.class, () -> {
            authService.login(invalidPasswordRequest);
        });
        assertTrue(exception2.getMessage().contains("Bad credentials"));
    }
}
