package kh.BackendCapstone.jwt;

import kh.BackendCapstone.dto.TokenDto;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.stream.Collectors;
// JWT 토큰 생성
// 클라이언트에 전달한 JWT 를 검증
// 토큰에서 사용자 정보를 추출

@Component
@Slf4j
public class TokenProvider {
	private static final String AUTHORITIES_KEY = "auth";   // 권한 정보를 저장하는 키
	private final Key key;  // JWT 서명에 사용할 비밀 키
	// 비밀키를 기반으로 키 객체 초기화
	// 주의점 : @Value 어노테이션은 springframework 의 어노테이션이다.
	public TokenProvider(@Value("${jwt.secret}") String secretKey) {
		this.key = Keys.hmacShaKeyFor(secretKey.getBytes());
	}
	public TokenDto generateTokenDto(Authentication authentication) {
		// 인증 객체에서 권한 정보 추출
		String authorities = authentication.getAuthorities().stream()
			.map(GrantedAuthority::getAuthority)
			.collect(Collectors.joining(","));
		
		// 현재 시간과 토큰 만료 시간 계산
		long now = (new Date()).getTime();
		Date accessTokenExpiresIn = new Date(now + 30 * 60 * 1000); // 30분
		Date refreshTokenExpiresIn = new Date(now + 30 * 60 * 1000 * 48 * 6);   // 6일
		
		// Access Token 생성
		String accessToken = Jwts.builder()
			.setSubject(authentication.getName()) // 사용자명 설정
			.claim(AUTHORITIES_KEY, authorities)  // 권한 정보 저장
			.setExpiration(accessTokenExpiresIn)  // 만료 시간 설정
			.signWith(key, SignatureAlgorithm.HS512) // 서명 방식 설정
			.compact();
		
		// Refresh Token 생성
		String refreshToken = Jwts.builder()
			.setSubject(authentication.getName()) // 사용자명 설정
			.claim(AUTHORITIES_KEY, authorities)  // 권한 정보 저장
			.setExpiration(refreshTokenExpiresIn)  // 만료 시간 설정
			.signWith(key, SignatureAlgorithm.HS512) // 서명 방식 설정
			.compact();
		
		// 결과를 DTO로 반환
		return TokenDto.builder()
			.grantType("Bearer")
			.accessToken(accessToken)
			.accessTokenExpiresIn(accessTokenExpiresIn.getTime())
			.refreshToken(refreshToken)
			.refreshTokenExpiresIn(refreshTokenExpiresIn.getTime())
			.build();
		
		
	}
	
	// 토큰에서 인증 객체 생성
	public Authentication getAuthentication(String token) {
		Claims claims = parseClaims(token);
		
		// 권한 정보 추출
		Collection<? extends GrantedAuthority> authorities =
			Arrays.stream(claims.get(AUTHORITIES_KEY).toString().split(","))
				.map(SimpleGrantedAuthority::new)
				.collect(Collectors.toList());
		
		// 인증 객체 생성 후 반환
		User principal = new User(claims.getSubject(), "", authorities);
		return new UsernamePasswordAuthenticationToken(principal, token, authorities);
	}
	
	// 토큰 유효성 검증
	public boolean validateToken(String token) {
		try {
			Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
			return true;
		} catch (Exception e) {
			log.info("JWT 검증 실패: {}", e.getMessage());
		}
		return false;
	}
	
	// 토큰의 Claims(내용) 추출
	private Claims parseClaims(String token) {
		try {
			return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
		} catch (ExpiredJwtException e) {
			return e.getClaims();
		}
	}
	
}

