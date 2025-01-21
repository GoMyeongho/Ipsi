package kh.BackendCapstone.service;

import kh.BackendCapstone.dto.request.MemberReqDto;
import kh.BackendCapstone.dto.response.MemberResDto;
import kh.BackendCapstone.repository.MemberRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestPropertySource(locations = "classpath:application-test.properties")
public  class SingupServiceTest {

    @Autowired
    private MemberService memberService;

    @Autowired
    private MemberRepository memberRepository;
    @Autowired
    private AuthService authService;

    @Test
    @DisplayName("회원가입 테스트")
    void testSignup() {
        // Given
        MemberReqDto requestDto = MemberReqDto.builder()
                .email("test@example.com")
                .pwd("password123")
                .name("Test User")
                .nickname("Tester")
                .phone("01012345678")
                .build();

        // When
        MemberResDto responseDto = authService.signup(requestDto);

        // Then
        assertNotNull(responseDto);
        assertEquals("test@example.com", responseDto.getEmail());
        assertEquals("Test User", responseDto.getName());

        // 중복 회원가입 테스트
        Exception exception = assertThrows(RuntimeException.class, () -> {
            authService.signup(requestDto);
        });
        assertEquals("이미 가입되어 있는 유저입니다.", exception.getMessage());
    }
}