		package kh.BackendCapstone.service;

		import kh.BackendCapstone.dto.AccessTokenDto;
		import kh.BackendCapstone.dto.TokenDto;
		import kh.BackendCapstone.dto.request.MemberReqDto;
		import kh.BackendCapstone.dto.response.MemberResDto;
		import kh.BackendCapstone.entity.Member;
		import kh.BackendCapstone.entity.RefreshToken;
		import kh.BackendCapstone.jwt.TokenProvider;

		import kh.BackendCapstone.repository.MemberRepository;
		import kh.BackendCapstone.repository.RefreshTokenRepository;
		import lombok.RequiredArgsConstructor;
		import lombok.extern.slf4j.Slf4j;
		import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
		import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
		import org.springframework.security.core.Authentication;
		import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
		import org.springframework.security.crypto.password.PasswordEncoder;
		import org.springframework.stereotype.Service;
		import org.springframework.transaction.annotation.Transactional;

		import javax.servlet.http.HttpSession;
		import java.util.HashMap;
		import java.util.Map;
		import java.util.Optional;
		// 스프링게 조금 더 낫다


		@Slf4j  // 로그 정보를 출력하기 위함
		@Service    // 스프링 컨테이너에 빈(객체) 등록
		@RequiredArgsConstructor    // 생성자 생성
		@Transactional  // 여러가지 작업을 하나의 논리적인 단위로 묶어 줌
		public class AuthService {
			// 생성자를 통한 의존성 주입, 생상자를 통해서 의존성 주입을 받는 경우 AutoWired 생략
			private final AuthenticationManagerBuilder managerBuilder; // 인증을 담당하는 클래스
			private final MemberRepository memberRepository;
			private final PasswordEncoder passwordEncoder;
			private final TokenProvider tokenProvider;
			private final HttpSession session;

			private  final RefreshTokenRepository refreshTokenRepository;
			//---------------------------- 중복확인 ---------------------------------------------
			// 회원가입 여부  // 이메일 존재 여부
			public boolean existEmail(String email) {
				return memberRepository.existsByEmail(email);
			}
			// 닉네임 여부 확인
			public boolean existNickName(String nickName) {
				return memberRepository.existsByNickName(nickName);
			}
			// 핸드폰 중복 여부 확인
			public boolean existPhone(String phone) {
				return memberRepository.existsByPhone(phone);
			}
	//-----------------------------------회원가입 및 로그인 ----------------------------------------

			// 회원가입


			public MemberResDto signup(MemberReqDto requestDto) {
				// 이메일 중복 확인
				if (memberRepository.existsByEmail(requestDto.getEmail())) {
					throw new RuntimeException("이미 가입되어 있는 유저입니다.");
				}

				// 엔티티 변환 및 저장
				Member member = requestDto.toEntity(passwordEncoder);
				Member savedMember = memberRepository.save(member);

				return MemberResDto.of(savedMember);
			}


			// member 로그인

			public TokenDto login(MemberReqDto memberReqDto) {
				try {
					UsernamePasswordAuthenticationToken authenticationToken = memberReqDto.toAuthentication();
					log.info("authenticationToken : {}", authenticationToken);

					Authentication authentication = managerBuilder.getObject().authenticate(authenticationToken);
					log.info("authentication : {}", authentication);


					TokenDto token = tokenProvider.generateTokenDto(authentication);

					//refreshToken DB에 저장
					Member member = memberRepository.findByEmail(memberReqDto.getEmail())
							.orElseThrow(() -> new RuntimeException("존재하지 않는 이메일입니다."));


					// 이미 db에 해당 계정으로 저장된 refreshToken 정보가 있다면 삭제
					log.info("Exists by member: {}", refreshTokenRepository.existsByMember(member));
					if(refreshTokenRepository.existsByMember(member)) {
						refreshTokenRepository.deleteByMember(member);
					}

					RefreshToken refreshToken = new RefreshToken();
					String encodedToken = token.getRefreshToken();
					refreshToken.setRefreshToken(encodedToken.concat("="));
					refreshToken.setRefreshTokenExpiresIn(token.getRefreshTokenExpiresIn());
					refreshToken.setMember(member);

					refreshTokenRepository.save(refreshToken);

					return token;

				} catch (Exception e) {
					log.error("로그인 중 에러 발생 : ", e);
					throw new RuntimeException("로그인 중 에러 발생", e);
				}

			}

			public AccessTokenDto refreshAccessToken(String refreshToken) {
				log.info("refreshToken : {}", refreshToken);
				log.info("일반refreshExist : {}", refreshTokenRepository.existsByRefreshToken(refreshToken));


				//DB에 일치하는 refreshToken이 있으면
				if(refreshTokenRepository.existsByRefreshToken(refreshToken) ) {
					// refreshToken 검증
					try {
						if(tokenProvider.validateToken(refreshToken)) {
							return tokenProvider.generateAccessTokenDto(tokenProvider.getAuthentication(refreshToken));
						}
					}catch (RuntimeException e) {
						log.error("토큰 유효성 검증 중 예외 발생 : {}", e.getMessage());
					}
				}
				return null;
			}


			@Transactional
			public boolean updatePassword(String email, String newPassword) {
				// 이메일로 회원 조회
				return memberRepository.findByEmail(email).map(member -> {
					// 비밀번호 변경 로직 (암호화 포함 가능)
					member.setPwd(newPassword);
					memberRepository.save(member);
					return true;
				}).orElse(false); // 회원이 없으면 false 반환
			}





		}