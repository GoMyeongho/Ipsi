package kh.BackendCapstone.security;


import kh.BackendCapstone.jwt.JwtFilter;
import kh.BackendCapstone.jwt.TokenProvider;
import lombok.RequiredArgsConstructor;

import org.springframework.security.config.annotation.SecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.DefaultSecurityFilterChain;

import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

// HTTP 요청에서 JWT 를 확인하고, 인증 객체를 설정하는 역할
@RequiredArgsConstructor
public class JwtSecurityConfig extends SecurityConfigurerAdapter<DefaultSecurityFilterChain, HttpSecurity> {
	private final TokenProvider tokenProvider;
	
	@Override
	public void configure(HttpSecurity http) {
		JwtFilter customFilter = new JwtFilter(tokenProvider);
		http.addFilterBefore(customFilter, UsernamePasswordAuthenticationFilter.class);
	}



}

