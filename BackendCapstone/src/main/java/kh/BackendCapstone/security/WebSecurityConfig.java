package kh.BackendCapstone.security;

import kh.BackendCapstone.config.OAuth2SuccessHandler;
import kh.BackendCapstone.jwt.TokenProvider;
import kh.BackendCapstone.service.OAuth2UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.stereotype.Component;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

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

//	@Bean
//	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//		http
//				.httpBasic() // HTTP 기본 인증
//				.and()
//				.csrf().disable() // CSRF 비활성화
//				.sessionManagement()
//				.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED) // 세션이 필요할 때 생성
//				.and()
//				.exceptionHandling()
//				.authenticationEntryPoint(jwtAuthenticationEntryPoint) // 인증 실패 처리
//				.accessDeniedHandler(jwtAccessDeniedHandler) // 인가 실패 처리
//				.and()
//				.authorizeRequests()
//				.antMatchers("/", "/static/**", "/auth/**", "/ws/**", "/oauth2/**", "/api/v1/auth/**", "/api/v1/payments/**", "/chat/**", "/flask/**", "/file/**", "/univ/**").permitAll()
//				.antMatchers("/v2/api-docs", "/swagger-resources/**", "/swagger-ui.html", "/webjars/**", "/swagger/**", "/sign-api/exception").permitAll()
//				.antMatchers(HttpMethod.OPTIONS, "/**").permitAll()
//				.antMatchers("/favicon.ico", "/manifest.json").permitAll()
//				.anyRequest().authenticated() // 나머지 요청은 인증 필요
//				.and()
//				.oauth2Login(oauth2 -> oauth2
//						.authorizationEndpoint(endpoint -> endpoint.baseUri("/api/v1/auth/oauth2"))
//						.redirectionEndpoint(endpoint -> endpoint.baseUri("/oauth2/callback/*"))
//						.userInfoEndpoint(endpoint -> endpoint.userService(oauth2UserService))
//						.successHandler(oAuth2SuccessHandler)
//				)
//				.apply(new JwtSecurityConfig(tokenProvider)); // JWT 인증 설정
//
//		return http.build();
//	}
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
	http
			.cors().configurationSource(request -> {
				CorsConfiguration corsConfig = new CorsConfiguration();
				corsConfig.setAllowedOrigins(List.of("http://localhost:3000")); // 프론트엔드 도메인
				corsConfig.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
				corsConfig.setAllowCredentials(true); // 쿠키 허용
				corsConfig.addAllowedHeader("*");
				corsConfig.setExposedHeaders(List.of(HttpHeaders.CONTENT_DISPOSITION));  // Content-Disposition 헤더 노출
				return corsConfig;
			})
			.and()
			.httpBasic()
			.and()
			.csrf().disable()
			.sessionManagement()
			.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
			.and()
			.exceptionHandling()
			.authenticationEntryPoint(jwtAuthenticationEntryPoint)
			.accessDeniedHandler(jwtAccessDeniedHandler)
			.and()
			.authorizeRequests()
			.antMatchers("/", "/static/**", "/auth/**", "/ws/**", "/oauth2/**", "/api/v1/auth/**", "/api/v1/payments/**", "/chat/**", "/flask/**", "/file/**", "/univ/**", "/board/**","/pay/**", "/write/**").permitAll()
			.antMatchers("/v2/api-docs", "/swagger-resources/**", "/swagger-ui.html", "/webjars/**", "/swagger/**", "/sign-api/exception").permitAll()
			.antMatchers(HttpMethod.OPTIONS, "/**").permitAll()
			.antMatchers("/favicon.ico", "/manifest.json").permitAll()
			.anyRequest().authenticated()
			.and()
			.oauth2Login(oauth2 -> oauth2
					.authorizationEndpoint(endpoint -> endpoint.baseUri("/api/v1/auth/oauth2"))
					.redirectionEndpoint(endpoint -> endpoint.baseUri("/oauth2/callback/*"))
					.userInfoEndpoint(endpoint -> endpoint.userService(oauth2UserService))
					.successHandler(oAuth2SuccessHandler)
			)
			.apply(new JwtSecurityConfig(tokenProvider));

		return http.build();  // 설정을 적용한 http 객체 반환
	}
}