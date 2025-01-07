package kh.BackendCapstone.service;
import java.util.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import kh.BackendCapstone.entity.CustomOAuth2User;
import kh.BackendCapstone.entity.Member;
import kh.BackendCapstone.entity.UserEntity;
import kh.BackendCapstone.repository.MemberRepository;
import kh.BackendCapstone.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.User;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OAuth2UserService  extends DefaultOAuth2UserService {
    private final UserRepository userRepository;
    @Override
    public OAuth2User loadUser(OAuth2UserRequest request) throws OAuth2AuthenticationException{
        OAuth2User oAuth2User = super.loadUser(request);
        String oauthClientName = request.getClientRegistration().getClientName();
        try{
            System.out.println(new ObjectMapper().writeValueAsString(oAuth2User.getAttributes()));
        }catch (Exception e){
            e.printStackTrace();
        }
        UserEntity userEntity = null;
        String userId = null;
        String email ="email@email.com";
        if(oauthClientName.equals("kakao")){
            userId = "kakao"+ oAuth2User.getAttributes().get("id");
            userEntity = new UserEntity(userId,email,"kakao");
        }
        if(oauthClientName.equals("naver")){
            Map<String,String> responseMap =(Map<String, String>) oAuth2User.getAttributes().get("response");
            userId = "naver_"+responseMap.get("id").substring(0,14);
            email =responseMap.get("email");
            userEntity = new UserEntity(userId,email,"naver");
        }
        userRepository.save(userEntity);
        return new CustomOAuth2User(userId);

    }
}
