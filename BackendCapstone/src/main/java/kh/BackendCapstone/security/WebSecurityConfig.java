package kh.BackendCapstone.security;

import kh.BackendCapstone.config.OAuth2SuccessHandler;
import kh.BackendCapstone.jwt.TokenProvider;
import kh.BackendCapstone.service.OAuth2UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@RequiredArgsConstructor  // Lombok 어노테이션: final 필드에 대한 생성자를 자동 생성
@Configuration  // Spring 설정 클래스를 나타내는 어노테이션
@EnableWebSecurity  // Spring Security를 활성화하는 어노테이션
@Component  // Spring 빈으로 등록되도록 하는 어노테이션
public class WebSecurityConfig implements WebMvcConfigurer {  // WebMvcConfigurer 인터페이스 구현하여 Spring MVC 설정을 확장
	private final OAuth2SuccessHandler oAuth2SuccessHandler;
	private final TokenProvider tokenProvider;  // JWT 토큰을 생성하고 검증하는 객체
	private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;  // 인증 실패 시 처리할 클래스
	private final JwtAccessDeniedHandler jwtAccessDeniedHandler;  // 인가 실패 시 처리할 클래스
	private final OAuth2UserService oauth2UserService;
	@Bean  // PasswordEncoder Bean 등록
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();  // BCryptPasswordEncoder 사용하여 비밀번호 암호화
	}

	@Bean  // SecurityFilterChain Bean 등록
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {  // HttpSecurity를 사용한 보안 설정

		http
				.httpBasic()  // HTTP 기본 인증 방식을 활성화 (기본값 사용)
				.and()
				.csrf().disable()  // CSRF 보호 비활성화 (REST API에서는 보통 비활성화)
				.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)  // 세션 사용하지 않음, JWT 방식 사용
				.and()
				.exceptionHandling()  // 예외 처리 설정
				.authenticationEntryPoint(jwtAuthenticationEntryPoint)  // 인증 실패 시 처리할 객체 설정
				.accessDeniedHandler(jwtAccessDeniedHandler)  // 인가 실패 시 처리할 객체 설정
				.and()
				.authorizeRequests()  // 요청에 대한 권한 설정
				.antMatchers("/", "/static/**", "/auth/**", "/ws/**","/oauth2/**","/api/v1/auth/**","/chat/**","/api/bank-verification/**","/flask/**").permitAll()  // 특정 경로는 모두 허용
				.antMatchers("/v2/api-docs", "/swagger-resources/**", "/swagger-ui.html", "/webjars/**", "/swagger/**", "/sign-api/exception").permitAll()  // Swagger 관련 경로는 모두 허용
				.antMatchers(HttpMethod.OPTIONS, "/**").permitAll()  // OPTIONS 메서드 요청은 모두 허용
				.antMatchers("/favicon.ico","/manifest.json").permitAll()  // favicon 및 manifest 파일은 모두 허용
				.anyRequest().authenticated()  // 나머지 모든 요청은 인증된 사용자만 접근 허용
				.and()
				.oauth2Login(oauth2 -> oauth2
						.authorizationEndpoint(endpoint->endpoint.baseUri("/api/v1/auth/oauth2"))
						.redirectionEndpoint(endpoint-> endpoint.baseUri("/oauth2/callback/*"))
						.userInfoEndpoint(endpoint->endpoint.userService(oauth2UserService))
						.successHandler(oAuth2SuccessHandler)
				)

				.apply(new JwtSecurityConfig(tokenProvider)); // JWT 인증 설정을 적용



		return http.build();  // 설정을 적용한 http 객체 반환
	}
}

