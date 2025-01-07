package kh.BackendCapstone.service;

import kh.BackendCapstone.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TokenService {

    private final MemberRepository memberRepository;

    // 인증 토큰을 저장할 맵 (단순 예시로 메모리에 저장)
    private final Map<String, String> tokenStorage = new HashMap<>();
    private final Map<String, Long> tokenExpiryTime = new HashMap<>();

    // 이메일로 발급된 인증번호를 저장
    public void storeToken(String email, String token) {
        // 이메일에 해당하는 인증번호 저장
        tokenStorage.put(email, token);
        // 유효시간 (5분)
        tokenExpiryTime.put(email, System.currentTimeMillis() + 300000); // 5분 = 300000ms
    }

    // 이메일과 입력된 인증번호를 비교하여 검증
    public boolean verifyToken(String email, String inputToken) {
        String storedToken = tokenStorage.get(email);
        Long expiryTime = tokenExpiryTime.get(email);

        if (storedToken == null) {
            throw new RuntimeException("토큰이 존재하지 않거나 만료되었습니다.");
        }

        if (System.currentTimeMillis() > expiryTime) {
            tokenStorage.remove(email);  // 만료된 토큰은 삭제
            tokenExpiryTime.remove(email);
            throw new RuntimeException("토큰이 만료되었습니다.");
        }

        // 입력된 토큰과 저장된 토큰이 일치하는지 확인
        return storedToken.equals(inputToken);
    }

    // 토큰 삭제 (비밀번호 변경 등 후 처리)
    public void removeToken(String email) {
        tokenStorage.remove(email);
        tokenExpiryTime.remove(email);
    }
}
