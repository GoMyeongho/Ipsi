package kh.BackendCapstone.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import kh.BackendCapstone.entity.CustomOAuth2User;
import kh.BackendCapstone.entity.Member;
import kh.BackendCapstone.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OAuth2UserService extends DefaultOAuth2UserService {
    private final MemberRepository memberRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest request) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(request);
        String oauthClientName = request.getClientRegistration().getClientName();

        try {
            System.out.println(new ObjectMapper().writeValueAsString(oAuth2User.getAttributes()));
        } catch (Exception e) {
            e.printStackTrace();
        }

        Member member = null;
        String userId = null;
        String email = "email@email.com";

        if (oauthClientName.equals("kakao")) {
            userId = "kakao" + oAuth2User.getAttributes().get("id");
            member = new Member(userId, email, "kakao");
        } else if (oauthClientName.equals("naver")) {
            Map<String, String> responseMap = (Map<String, String>) oAuth2User.getAttributes().get("response");
            userId = "naver_" + responseMap.get("id").substring(0, 14);
            email = responseMap.get("email");
            member = new Member(userId, email, "naver");
        }

        // 중복 체크: userId나 email로 이미 존재하는 회원이 있는지 확인
        Optional<Member> existingMemberByEmail = memberRepository.findByEmail(email);

        if ( existingMemberByEmail.isPresent()) {
            // 이미 존재하는 회원이 있으면 저장하지 않음
            System.out.println("회원이 이미 존재합니다. 회원 등록을 건너뜁니다.");
            return new CustomOAuth2User(userId); // 이미 존재하는 사용자 정보 반환
        }

        // 중복이 없으면 회원을 저장
        memberRepository.save(member);
        return new CustomOAuth2User(userId); // 저장된 사용자 정보 반환
    }
}
