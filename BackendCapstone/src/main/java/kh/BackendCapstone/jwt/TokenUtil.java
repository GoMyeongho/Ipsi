package kh.BackendCapstone.jwt;


import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class TokenUtil {

    // JWT 토큰을 6자리 인증번호로 변환하는 메서드
    public static String generateShortToken(String token) throws NoSuchAlgorithmException {
        // SHA-256 해시 알고리즘을 사용하여 토큰을 해시화
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hashBytes = digest.digest(token.getBytes());

        // 해시값을 정수로 변환
        long hashValue = 0;
        for (int i = 0; i < 4; i++) { // 해시 값의 앞 4바이트를 사용
            hashValue = (hashValue << 8) + (hashBytes[i] & 0xFF);
        }

        // 6자리 숫자로 제한
        long shortToken = Math.abs(hashValue % 1000000);  // 6자리로 변환
        return String.format("%06d", shortToken);  // 6자리 정수로 반환
    }
}
