package kh.BackendCapstone.config;

import com.google.auth.oauth2.JwtProvider;


import kh.BackendCapstone.dto.TokenDto;
import kh.BackendCapstone.entity.CustomOAuth2User;
import kh.BackendCapstone.jwt.TokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final TokenProvider tokenProvider;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();

        TokenDto tokenDto = tokenProvider.generateTokenDto(authentication);

        // 액세스 토큰을 가져와서 리다이렉트 URL에 포함시킴
        String token = tokenDto.getAccessToken();

        // 만료 시간을 설정 (예: 3600초 = 1시간)
        long expirationTime = tokenDto.getAccessTokenExpiresIn() / 1000; // 밀리초를 초로 변환

        // 프론트엔드로 리다이렉트하면서 토큰과 만료 시간을 전달
        response.sendRedirect("http://localhost:3000/auth/oauth-response/" + token + "/" + expirationTime);
    }
}